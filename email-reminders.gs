const CONFIG = {
  abaCronograma: '2º SEMESTRE',
  abaProfessores: 'PROFESSORES',
  timezone: 'America/Sao_Paulo',
  assuntoPrefixo: 'Lembrete do cronograma',
  fallbackEmails: []
};

function criarDisparoDiario() {
  ScriptApp.getProjectTriggers()
    .filter((trigger) => trigger.getHandlerFunction() === 'enviarLembretesDeAmanha')
    .forEach((trigger) => ScriptApp.deleteTrigger(trigger));

  ScriptApp.newTrigger('enviarLembretesDeAmanha')
    .timeBased()
    .everyDays(1)
    .atHour(7)
    .create();
}

function enviarLembretesDeAmanha() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  const eventos = eventosDeAmanha(planilha);
  const emails = emailsDosProfessores(planilha);

  if (!eventos.length || !emails.length) return;

  const amanha = new Date();
  amanha.setDate(amanha.getDate() + 1);
  const dataFormatada = Utilities.formatDate(amanha, CONFIG.timezone, 'dd/MM/yyyy');
  const assunto = `${CONFIG.assuntoPrefixo} - ${dataFormatada}`;
  const corpo = montarCorpoEmail(eventos, dataFormatada);

  MailApp.sendEmail({
    to: emails.join(','),
    subject: assunto,
    htmlBody: corpo,
    name: 'Calendário Escolar'
  });
}

function eventosDeAmanha(planilha) {
  const aba = planilha.getSheetByName(CONFIG.abaCronograma);
  if (!aba) throw new Error(`Aba não encontrada: ${CONFIG.abaCronograma}`);

  const linhas = aba.getRange(2, 1, Math.max(aba.getLastRow() - 1, 0), 4).getDisplayValues();
  const amanha = new Date();
  amanha.setHours(0, 0, 0, 0);
  amanha.setDate(amanha.getDate() + 1);
  const chaveAmanha = chaveData(amanha);

  return linhas
    .filter((linha) => linha[0] && linha[2])
    .flatMap((linha) => {
      const datas = interpretarDatas(linha[0]);
      return datas
        .filter((data) => chaveData(data) === chaveAmanha)
        .map(() => ({
          dataOriginal: linha[0],
          diaSemana: linha[1],
          titulo: linha[2],
          obs: linha[3]
        }));
    });
}

function emailsDosProfessores(planilha) {
  const aba = planilha.getSheetByName(CONFIG.abaProfessores);
  const emails = [...CONFIG.fallbackEmails];

  if (aba) {
    const valores = aba.getRange(1, 1, aba.getLastRow(), 1).getDisplayValues().flat();
    valores.forEach((valor) => {
      const email = String(valor).trim();
      if (email && email.includes('@') && !/^e-?mail$/i.test(email)) emails.push(email);
    });
  }

  return [...new Set(emails)];
}

function montarCorpoEmail(eventos, dataFormatada) {
  const itens = eventos.map((evento) => `
    <li>
      <strong>${escapar(evento.titulo)}</strong><br>
      ${escapar(evento.diaSemana || dataFormatada)}
      ${evento.obs ? `<br><span>${escapar(evento.obs)}</span>` : ''}
    </li>
  `).join('');

  return `
    <p>Bom dia, professores.</p>
    <p>Segue lembrete dos eventos previstos para amanhã (${dataFormatada}):</p>
    <ul>${itens}</ul>
    <p>Mensagem enviada automaticamente pelo calendário escolar.</p>
  `;
}

function interpretarDatas(valor) {
  const texto = String(valor || '').trim();
  const unica = partesData(texto);
  if (unica) return [unica];

  const mesmoMes = texto.match(/^(\d{1,2})\s*(a|e)\s*(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?$/i);
  if (mesmoMes) {
    const ano = Number(mesmoMes[5] || '2026');
    const mes = Number(mesmoMes[4]) - 1;
    const inicio = new Date(ano, mes, Number(mesmoMes[1]));
    const fim = new Date(ano, mes, Number(mesmoMes[3]));
    return mesmoMes[2].toLowerCase() === 'e' ? [inicio, fim] : intervalo(inicio, fim);
  }

  const faixaCompleta = texto.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?\s*a\s*(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?$/i);
  if (faixaCompleta) {
    const anoInicio = Number(faixaCompleta[3] || faixaCompleta[6] || '2026');
    const anoFim = Number(faixaCompleta[6] || anoInicio);
    return intervalo(
      new Date(anoInicio, Number(faixaCompleta[2]) - 1, Number(faixaCompleta[1])),
      new Date(anoFim, Number(faixaCompleta[5]) - 1, Number(faixaCompleta[4]))
    );
  }

  return [];
}

function partesData(valor) {
  const match = String(valor).match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?$/);
  if (!match) return null;
  return new Date(Number(match[3] || '2026'), Number(match[2]) - 1, Number(match[1]));
}

function intervalo(inicio, fim) {
  const datas = [];
  const cursor = new Date(inicio);
  while (cursor <= fim) {
    datas.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return datas;
}

function chaveData(data) {
  return Utilities.formatDate(data, CONFIG.timezone, 'yyyy-MM-dd');
}

function escapar(valor) {
  return String(valor || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
