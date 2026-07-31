const CONFIG = {
  abaCronograma: '2º SEMESTRE',
  abaProfessores: 'PROFESSORES',
  timezone: 'America/Sao_Paulo',
  diasAntes: 3,
  assuntoPrefixo: 'Em breve',
  emailRemetente: 'sharlayne.fonseca@professor.barueri.br',
  nomeRemetente: 'EMEF DEP. AGENOR LINO DE MATTOS',
  fallbackEmails: []
};

function instalarEnvioAutomatico() {
  criarDisparoDiario();
}

function criarDisparoDiario() {
  ScriptApp.getProjectTriggers()
    .filter((trigger) => ['enviarLembretesAntecipados', 'enviarLembretesDeAmanha'].includes(trigger.getHandlerFunction()))
    .forEach((trigger) => ScriptApp.deleteTrigger(trigger));

  ScriptApp.newTrigger('enviarLembretesAntecipados')
    .timeBased()
    .everyDays(1)
    .atHour(7)
    .nearMinute(0)
    .inTimezone(CONFIG.timezone)
    .create();
}

function enviarLembretesAntecipados() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  const dataEvento = dataComAntecedencia(CONFIG.diasAntes);
  const eventos = eventosPorData(planilha, dataEvento);
  const professores = professoresParaAviso(planilha);

  if (!eventos.length) {
    console.log(`Nenhum evento encontrado para ${chaveData(dataEvento)}.`);
    return;
  }

  if (!professores.length) {
    throw new Error(`Nenhum e-mail encontrado na aba ${CONFIG.abaProfessores}.`);
  }

  const dataFormatada = Utilities.formatDate(dataEvento, CONFIG.timezone, 'dd/MM/yyyy');
  const assunto = `${CONFIG.assuntoPrefixo}: ${tituloAssunto(eventos)}.`;

  professores.forEach((professor) => {
    enviarEmail({
      destinatario: professor.email,
      assunto,
      html: montarCorpoEmail(professor, eventos, dataFormatada)
    });
  });
}

function enviarLembretesDeAmanha() {
  enviarLembretesAntecipados();
}

function enviarTesteDia27() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  const dataEvento = new Date(2026, 6, 27);
  const eventos = eventosPorData(planilha, dataEvento);
  const propriedades = PropertiesService.getScriptProperties();
  const emailTeste = propriedades.getProperty('EMAIL_TESTE_DIA_27');
  const professor = {
    nome: propriedades.getProperty('NOME_TESTE_DIA_27') || 'SHARLAYNE',
    email: emailTeste
  };

  if (!emailTeste) throw new Error('Configure a propriedade EMAIL_TESTE_DIA_27 antes de executar o teste.');
  if (!eventos.length) throw new Error('Nenhum evento encontrado em 27/07/2026.');

  const dataFormatada = Utilities.formatDate(dataEvento, CONFIG.timezone, 'dd/MM/yyyy');
  enviarEmail({
    destinatario: professor.email,
    assunto: `${CONFIG.assuntoPrefixo}: ${tituloAssunto(eventos)}.`,
    html: montarCorpoEmail(professor, eventos, dataFormatada)
  });
}

function enviarEmail({ destinatario, assunto, html }) {
  const opcoes = {
    htmlBody: html,
    name: CONFIG.nomeRemetente
  };
  configurarRemetente(opcoes);

  GmailApp.sendEmail(destinatario, assunto, textoSimples(html), opcoes);
  console.log(`E-mail enviado para ${destinatario}.`);
}

function configurarRemetente(opcoes) {
  const usuarioAtual = Session.getActiveUser().getEmail();
  const usuarioEfetivo = Session.getEffectiveUser().getEmail();
  const aliases = GmailApp.getAliases();
  const remetente = CONFIG.emailRemetente.toLowerCase();

  if (aliases.map((email) => email.toLowerCase()).includes(remetente)) {
    opcoes.from = CONFIG.emailRemetente;
    return;
  }

  if (usuarioAtual && usuarioAtual.toLowerCase() === remetente) return;
  if (usuarioEfetivo && usuarioEfetivo.toLowerCase() === remetente) return;

  throw new Error(
    `Para enviar como ${CONFIG.emailRemetente}, abra este Apps Script logada nessa conta ` +
    'ou configure esse endereço como alias autorizado no Gmail.'
  );
}

function eventosPorAntecedencia(planilha, diasAntes) {
  return eventosPorData(planilha, dataComAntecedencia(diasAntes));
}

function eventosPorData(planilha, dataAlvo) {
  const aba = planilha.getSheetByName(CONFIG.abaCronograma);
  if (!aba) throw new Error(`Aba não encontrada: ${CONFIG.abaCronograma}`);

  const linhas = aba.getRange(2, 1, Math.max(aba.getLastRow() - 1, 0), 4).getDisplayValues();
  const chaveAlvo = chaveData(dataAlvo);

  return linhas
    .filter((linha) => linha[0] && linha[2])
    .flatMap((linha) => {
      const datas = interpretarDatas(linha[0]);
      return datas
        .filter((data) => chaveData(data) === chaveAlvo)
        .map(() => ({
          data,
          dataOriginal: linha[0],
          diaSemana: linha[1],
          titulo: linha[2],
          obs: linha[3]
        }));
    });
}

function professoresParaAviso(planilha) {
  const aba = planilha.getSheetByName(CONFIG.abaProfessores);
  const professores = CONFIG.fallbackEmails.map((email) => ({ nome: '', email }));

  if (aba) {
    if (aba.getLastRow() < 1) return professores;
    const valores = aba.getRange(1, 1, aba.getLastRow(), 2).getDisplayValues();
    valores.forEach((linha) => {
      const primeiro = String(linha[0] || '').trim();
      const segundo = String(linha[1] || '').trim();
      const email = [primeiro, segundo].find((valor) => valor.includes('@') && !/^e-?mail$/i.test(valor));
      const nome = email === primeiro ? segundo : primeiro;
      if (email) professores.push({ nome, email });
    });
  }

  return professores.filter((professor, index, lista) =>
    professor.email && lista.findIndex((item) => item.email === professor.email) === index
  );
}

function montarCorpoEmail(professor, eventos, dataFormatada) {
  const itens = eventos.map((evento) => `
    <li>
      <strong>${escapar(dataFormatada)} (${escapar(diaSemanaPorExtenso(evento.data))})</strong> - ${escapar(evento.titulo)}
      ${evento.obs ? `<br><span>${escapar(evento.obs)}</span>` : ''}
    </li>
  `).join('');
  const saudacao = professor.nome ? `Olá, ${escapar(professor.nome)}!` : 'Olá, professor(a)!';

  return `
    <h2>${escapar(`${CONFIG.assuntoPrefixo}: ${tituloAssunto(eventos)}.`)}</h2>
    <p>${saudacao}</p>
    <p>Fique ligado(a)!</p>
    <ul>${itens}</ul>
    <p><strong>Bom trabalho!</strong></p>
    <p>EMEF DEP. AGENOR LINO DE MATTOS</p>
  `;
}

function dataComAntecedencia(diasAntes) {
  const data = new Date();
  data.setHours(0, 0, 0, 0);
  data.setDate(data.getDate() + diasAntes);
  return data;
}

function tituloAssunto(eventos) {
  if (eventos.length === 1) return eventos[0].titulo;
  return `${eventos.length} eventos do cronograma`;
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

function diaSemanaPorExtenso(data) {
  return [
    'domingo',
    'segunda-feira',
    'terça-feira',
    'quarta-feira',
    'quinta-feira',
    'sexta-feira',
    'sábado'
  ][data.getDay()];
}

function escapar(valor) {
  return String(valor || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function textoSimples(html) {
  return String(html || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
