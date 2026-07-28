const SHEET_ID = "1nxcIGQBB6mI_JXcSBeDvKdeX41vuPsaek8I-RRLtoO8";
const SHEET_NAME = "2º SEMESTRE";
const SHEET_GID = "1366818204";
const REFRESH_MS = 15 * 1000;

const fallbackRows = [
  ["DATA", "DIA DA SEMANA", "EVENTO / ATIVIDADE", "OBS"],
  ["27/07/2026", "2ª Feira", "Início do 3º Bimestre", ""],
  ["27/07/2026", "2ª Feira", "Reunião Formatura.", ""],
  ["31/07/2026", "6ª Feira", "Abordar sobre o dia 25 de Julho - mulher negra e caribenha", ""],
  ["31/07/2026", "6ª Feira", "ECA (Lei 8.069/90)", ""],
  ["03/08/2026", "2ª Feira", "Simulado Saresp 2º anos", ""],
  ["03/08/2026", "2ª Feira", "5ºs anos - MANHÃ (total aproximado: 68 alunos). \"O Gato de Botas”", ""],
  ["03/08/2026", "2ª Feira", "Projeto Ecograna - Início da Arrecadação", ""],
  ["04/08/2026", "3ª Feira", "Simulado Saresp 2º anos", ""],
  ["05/08/2026", "4ª Feira", "Simulado Saresp 2º anos", ""],
  ["06/08/2026", "5ª Feira", "Simulado Saresp 2º anos", ""],
  ["07/08/2026", "6ª Feira", "Simulado Saresp 2º anos", ""],
  ["07/08/2026", "6ª Feira", "Projeto Pequenos Doutores (8º e 9º)", "10h15min"],
  ["08/08/2026", "Sábado", "Detetização", ""],
  ["11/08/2026", "3ª Feira", "1ºs, 2ºs, 3ºs e 4ºs anos - TARDE (total aproximado: 204 alunos). \"O Gato de Botas”", ""],
  ["17/08/2026", "2ª Feira", "VIII EDIÇÃO DA SEMANA DA VALORIZAÇÃO DAS DIFERENÇAS - Tema: Capacitismo: Conscientização e direitos na Educação Especial\" Pensar e organizar:", ""],
  ["18/08/2026", "3ª Feira", "VIII EDIÇÃO DA SEMANA DA VALORIZAÇÃO DAS DIFERENÇAS - Tema: Capacitismo: Conscientização e direitos na Educação Especial\" Pensar e organizar:", ""],
  ["19/08/2026", "4ª Feira", "VIII EDIÇÃO DA SEMANA DA VALORIZAÇÃO DAS DIFERENÇAS - Tema: Capacitismo: Conscientização e direitos na Educação Especial\" Pensar e organizar:", ""],
  ["20/08/2026", "5ª Feira", "VIII EDIÇÃO DA SEMANA DA VALORIZAÇÃO DAS DIFERENÇAS - Tema: Capacitismo: Conscientização e direitos na Educação Especial\" Pensar e organizar:", ""],
  ["21/08/2026", "6ª Feira", "VIII EDIÇÃO DA SEMANA DA VALORIZAÇÃO DAS DIFERENÇAS - Tema: Capacitismo: Conscientização e direitos na Educação Especial\" Pensar e organizar:", ""],
  ["18 a 21/08", "3ª a 6ª Feira", "Simulados SAEB (5º e 9º anos - Mat/LP e CN/CH)", "Prévia"],
  ["17 a 21/08", "Seg a Sex", "Avaliações Mensais (3º Bim)", ""],
  ["24 a 28/08", "Seg a Sex", "Período do Abraço", ""],
  ["25/08/2026", "3ª Feira", "5º OBMEP Mirim - 1º Fase", ""],
  ["28/08/2026", "6ª Feira", "Prazo final Sicoob", ""],
  ["31/08/2026", "2ª Feira", "Prazo para formatação de provas bimestrais e início de impressões", ""],
  ["01/09/2026", "3ª Feira", "Planejamento de ações Pensar em ações pedagógicas relacionadas ao Setembro Amarelo para ser incluso no Plano de Aula de Setembro. Considerar atividades que promovam o acolhimento, a empatia, a valorização da vida, a saúde emocional e o fortalecimento dos vínculos entre os estudantes. As propostas poderão ser desenvolvidas ao longo do mês de setembro, respeitando a faixa etária e as especificidades de cada turma.", ""],
  ["02/09/2026", "4ª Feira", "Projeto Pequenos Doutores (8º e 9º)", "7h10min"],
  ["03/09/2026", "5ª Feira", "5º OBMEP Mirim - 1º Fase - Prazo final para correção.", ""],
  ["04/09/2026", "6ª Feira", "SICOOB - Prazo final para entrega na SE.", ""],
  ["07/09/2026", "2ª Feira", "Independência do Brasil - Feriado (Evento Cívico)", "Sem Aula"],
  ["08/09/2026", "3ª Feira", "Simulado SAEB 2º ano", "Prévia"],
  ["09/09/2026", "4ª Feira", "Avaliação Diagnóstica Processual", ""],
  ["10/09/2026", "5ª Feira", "Avaliação Diagnóstica Processual", ""],
  ["14 a 18/09", "2ª a 6ª Feira", "Simulados SARESP Digital (Plataforma Jovens Notáveis - 2º, 5º e 9º anos)", "Prévia"],
  ["14 a 18/09", "Ter a Qui", "Avaliações Bimestrais (Caderno A, B e Produção de Texto)", ""],
  ["18/09/2026", "6ª Feira", "Parecer descritivo - Prazo final.", ""],
  ["21/09/2026", "2ª Feira", "Dia da Árvore", ""],
  ["22/09/2026", "3ª Feira", "Entre o Eco e o Verde: Ações para combater a crise climática", ""],
  ["26/09/2026", "Sábado", "FIEB TECH das 9h às 15h", ""],
  ["28/09/2026", "2ª Feira", "Conselho de Classe 5º ao 9º (3º Bim)", ""],
  ["29/09/2026", "3ª Feira", "Conselho de Classe 1º ao 4º (3º Bim)", ""],
  ["30/09/2026", "4ª Feira", "Término do 3º Bimestre (48 Dias)", ""],
  ["01/10/2026", "5ª Feira", "Início do 4º Bimestre / Simulado Interno ITB-IDEB", ""],
  ["02/10/2026", "2ª Feira", "Projeto Pequenos Doutores (8º e 9º)", "10h15min"],
  ["05/10/2026", "2ª Feira", "Semana das Crianças PEB 1 - Abertura Lojinha", ""],
  ["07/10/2026", "4ª Feira", "Data da Prova Objetiva: ITB", ""],
  ["08 e 09/10", "5ª e 6ª Feira", "Simulado SAEB Impresso (2º, 5º e 9º anos)", ""],
  ["09/10/2026", "6ª Feira", "Saída Pedagógica Hopi Hari (FUND 2)", "Saída Pedagógica - Hopi Hari em 09/10/2026, valor R$240,00 pix, dinheiro ou cartão de crédito parcelado até 02/10/2026."],
  ["12/10/2026", "2ª Feira", "Nossa Senhora Aparecida - Feriado", "Sem Aula"],
  ["15/10/2026", "5ª Feira", "Dia dos Professores", "Sem Aula"],
  ["16/10/2026", "6ª Feira", "Saída Pedagógica Animalia (FUND 1)", "Saída Pedagógica - Animália Park em 16/10/2026, valor R$250,00 pix, dinheiro ou cartão de crédito parcelado até 09/10/2026."],
  ["17/10/2026", "Sábado", "Reunião de Pais + Ecograna", ""],
  ["17/10/2026", "Sábado", "OBMEP - 2ª Fase", ""],
  ["19 a 23/10", "Qua a Sex", "Avaliações Mensais (4º Bim)", ""],
  ["28/10/2026", "4ª Feira", "Dia do Funcionário Público - Ponto Facultativo", "Sem Aula"],
  ["02/11/2026", "2ª Feira", "Finados - Feriado", "Sem Aula"],
  ["03/11/2026", "3ª Feira", "Novembro Negro", ""],
  ["05/11/2026", "6ª Feira", "Projeto Pequenos Doutores (8º e 9º)", ""],
  ["10/11/2026", "3ª Feira", "OBMEP Mirim - 2ª Fase", ""],
  ["16 e 19/11", "Seg e Ter", "Avaliações Bimestrais (Caderno A e B - 4º Bim)", ""],
  ["19/11/2026", "6ª Feira", "Parecer descritivo - Prazo final.", ""],
  ["17/11/2026", "3ª Feira", "SARESP 2º e 5º anos (Impressa) / 9º anos (Digital)", "Prévia"],
  ["17/11 a 04/12", "Período", "Fluência Leitora - SEDUC/SP (Alfabetiza Juntos)", "Prévia"],
  ["20/11/2026", "6ª Feira", "Consciência Negra - Feriado", "Sem Aula"],
  ["21/11/2026", "Sábado", "Nossa Senhora da Escada - Ponto Facultativo", "Sem Aula"],
  ["25/11/2026", "5ª Feira", "Projeto Pequenos Doutores (8º e 9º)", ""],
  ["25/11/2026", "5ª Feira", "4º Avaliação Diagnóstica Processual", ""],
  ["26/11/2026", "6ª Feira", "4º Avaliação Diagnóstica Processual", ""],
  ["24/11/2026", "3ª Feira", "ITB", "Prévia"],
  ["03/12/2026", "5ª Feira", "Conselho de Classe 5º ao 9º (4º Bim)", ""],
  ["04/12/2026", "6ª Feira", "Conselho de Classe 1º ao 4º (4º Bim)", ""],
  ["12/12/2026", "Sábado", "Reunião de Pais/Responsáveis (Encerramento)", ""],
  ["14/12/2026", "2ª Feira", "Colação de Grau", ""],
  ["15/12/2026", "3ª Feira", "Divulgação Premiados OBMEP", ""],
  ["18/12/2026", "6ª Feira", "Término do 4º Bimestre (54 Dias)", ""]
];

const state = {
  events: [],
  currentDate: new Date(2026, 6, 1),
  filter: "todos",
  query: "",
  isSyncing: false
};

const elements = {
  grid: document.querySelector("#calendarGrid"),
  monthLabel: document.querySelector("#monthLabel"),
  syncStatus: document.querySelector("#syncStatus"),
  upcomingList: document.querySelector("#upcomingList"),
  searchInput: document.querySelector("#searchInput"),
  refreshButton: document.querySelector("#refreshButton"),
  totalEvents: document.querySelector("#totalEvents"),
  monthEvents: document.querySelector("#monthEvents"),
  nextEventDate: document.querySelector("#nextEventDate"),
  prevMonth: document.querySelector("#prevMonth"),
  nextMonth: document.querySelector("#nextMonth"),
  filters: document.querySelectorAll(".filter"),
  dialog: document.querySelector("#eventDialog"),
  dialogDate: document.querySelector("#dialogDate"),
  dialogTitle: document.querySelector("#dialogTitle"),
  dialogObs: document.querySelector("#dialogObs")
};

function serialDate(date) {
  return date.toISOString().slice(0, 10);
}

function formatDate(date, options = {}) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    ...options
  }).format(date);
}

function parseDateParts(value) {
  const match = String(value).trim().match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?$/);
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]) - 1;
  const year = Number(match[3] || "2026");
  return new Date(year, month, day);
}

function parseDateRange(value) {
  const text = String(value || "").trim();
  if (!text) return [];

  const single = parseDateParts(text);
  if (single) return [single];

  const sameMonth = text.match(/^(\d{1,2})\s*(a|e)\s*(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?$/i);
  if (sameMonth) {
    const startDay = Number(sameMonth[1]);
    const connector = sameMonth[2].toLowerCase();
    const endDay = Number(sameMonth[3]);
    const month = Number(sameMonth[4]) - 1;
    const year = Number(sameMonth[5] || "2026");
    if (connector === "e") {
      return [new Date(year, month, startDay), new Date(year, month, endDay)];
    }
    return buildDateSpan(new Date(year, month, startDay), new Date(year, month, endDay));
  }

  const fullRange = text.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?\s*a\s*(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?$/i);
  if (fullRange) {
    const startYear = Number(fullRange[3] || fullRange[6] || "2026");
    const endYear = Number(fullRange[6] || startYear);
    return buildDateSpan(
      new Date(startYear, Number(fullRange[2]) - 1, Number(fullRange[1])),
      new Date(endYear, Number(fullRange[5]) - 1, Number(fullRange[4]))
    );
  }

  return [];
}

function buildDateSpan(start, end) {
  const dates = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

function normalizeText(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function categorize(title, obs) {
  const text = normalizeText(`${title} ${obs}`);
  if (text.includes("feriado") || text.includes("sem aula") || text.includes("ponto facultativo")) return "feriados";
  if (text.includes("prova") || text.includes("avaliacao") || text.includes("simulado") || text.includes("saresp") || text.includes("saeb") || text.includes("obmep")) return "provas";
  if (text.includes("reuniao") || text.includes("conselho")) return "reunioes";
  if (text.includes("projeto") || text.includes("ecograna")) return "projetos";
  return "eventos";
}

function rowsToEvents(rows) {
  return rows
    .slice(1)
    .flatMap((row, index) => {
      const [dateText, weekday, title, obs] = row;
      if (!dateText || !title) return [];
      const dates = parseDateRange(dateText);
      const category = categorize(title, obs);
      return dates.map((date) => ({
        id: `${index}-${serialDate(date)}-${title}`,
        date,
        dateText,
        weekday: weekday || "",
        title: String(title).trim(),
        obs: String(obs || "").trim(),
        category
      }));
    })
    .sort((a, b) => a.date - b.date || a.title.localeCompare(b.title, "pt-BR"));
}

function parseGoogleTable(jsonText) {
  const json = JSON.parse(jsonText.substring(jsonText.indexOf("{"), jsonText.lastIndexOf("}") + 1));
  return json.table.rows.map((row) =>
    (row.c || []).map((cell) => {
      if (!cell) return "";
      return cell.f || cell.v || "";
    })
  );
}

function parseCsv(csvText) {
  const rows = [];
  let row = [];
  let cell = "";
  let insideQuotes = false;

  for (let index = 0; index < csvText.length; index += 1) {
    const char = csvText[index];
    const next = csvText[index + 1];

    if (char === '"' && insideQuotes && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell);
  if (row.some((value) => value.trim())) rows.push(row);
  return rows;
}

async function loadCsvSheet() {
  const cacheBust = Date.now();
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GID}&range=A:D&_=${cacheBust}`;
  const response = await fetch(url, { cache: "reload" });
  if (!response.ok) throw new Error("Não foi possível ler o CSV da planilha.");
  return parseCsv(await response.text());
}

async function loadGvizSheet() {
  const cacheBust = Date.now();
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}&range=A:D&_=${cacheBust}`;
  const response = await fetch(url, { cache: "reload" });
  if (!response.ok) throw new Error("Não foi possível ler a planilha.");
  return parseGoogleTable(await response.text());
}

async function loadSheet() {
  try {
    return {
      rows: await loadCsvSheet(),
      source: "CSV"
    };
  } catch (csvError) {
    console.warn(csvError);
    return {
      rows: await loadGvizSheet(),
      source: "Google"
    };
  }
}

function filteredEvents() {
  const query = normalizeText(state.query);
  return state.events.filter((event) => {
    const matchesFilter = state.filter === "todos" || event.category === state.filter;
    const matchesQuery = !query || normalizeText(`${event.title} ${event.obs} ${event.dateText}`).includes(query);
    return matchesFilter && matchesQuery;
  });
}

function eventsForDate(date) {
  const key = serialDate(date);
  return filteredEvents().filter((event) => serialDate(event.date) === key);
}

function renderCalendar() {
  const year = state.currentDate.getFullYear();
  const month = state.currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - firstDay.getDay());

  elements.monthLabel.textContent = formatDate(firstDay, { month: "long", year: "numeric" });
  elements.grid.innerHTML = "";

  const todayKey = serialDate(new Date());
  for (let i = 0; i < 42; i += 1) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    const dayEvents = eventsForDate(day);
    const cell = document.createElement("article");
    cell.className = "day";
    if (day.getMonth() !== month) cell.classList.add("outside");
    if (serialDate(day) === todayKey) cell.classList.add("today");

    const heading = document.createElement("div");
    heading.className = "day-number";
    heading.innerHTML = `<span>${day.getDate()}</span>${dayEvents.length ? `<span class="event-count">${dayEvents.length}</span>` : ""}`;
    cell.append(heading);

    dayEvents.slice(0, 3).forEach((event) => {
      const button = document.createElement("button");
      button.className = `day-event ${event.category}`;
      button.innerHTML = `<p>${escapeHtml(event.title)}</p>${event.obs ? `<small>${escapeHtml(event.obs)}</small>` : ""}`;
      button.addEventListener("click", () => openEvent(event));
      cell.append(button);
    });

    if (dayEvents.length > 3) {
      const more = document.createElement("div");
      more.className = "more";
      more.textContent = `+${dayEvents.length - 3} evento(s)`;
      cell.append(more);
    }

    elements.grid.append(cell);
  }
}

function renderUpcoming() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = filteredEvents().filter((event) => event.date >= today).slice(0, 8);

  if (!upcoming.length) {
    elements.upcomingList.innerHTML = '<p class="empty">Nenhum evento encontrado.</p>';
    return;
  }

  elements.upcomingList.innerHTML = "";
  upcoming.forEach((event) => {
    const item = document.createElement("button");
    item.className = `upcoming-item ${event.category}`;
    item.innerHTML = `
      <span class="date-chip">${formatDate(event.date, { day: "2-digit", month: "2-digit" })}</span>
      <span>
        <p>${escapeHtml(event.title)}</p>
        <small>${escapeHtml(event.weekday || event.dateText)}</small>
      </span>
    `;
    item.addEventListener("click", () => openEvent(event));
    elements.upcomingList.append(item);
  });
}

function openEvent(event) {
  elements.dialogDate.textContent = `${formatDate(event.date, { weekday: "long", day: "2-digit", month: "long", year: "numeric" })} • ${event.dateText}`;
  elements.dialogTitle.textContent = event.title;
  elements.dialogObs.textContent = event.obs || "Sem observações.";
  elements.dialog.showModal();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function rerender() {
  renderSummary();
  renderCalendar();
  renderUpcoming();
}

function renderSummary() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const month = state.currentDate.getMonth();
  const year = state.currentDate.getFullYear();
  const visibleEvents = filteredEvents();
  const monthEvents = visibleEvents.filter((event) =>
    event.date.getMonth() === month && event.date.getFullYear() === year
  );
  const nextEvent = state.events.find((event) => event.date >= today);

  elements.totalEvents.textContent = state.events.length;
  elements.monthEvents.textContent = monthEvents.length;
  elements.nextEventDate.textContent = nextEvent
    ? formatDate(nextEvent.date, { day: "2-digit", month: "short" })
    : "-";
}

async function syncEvents() {
  if (state.isSyncing) return;
  state.isSyncing = true;
  elements.syncStatus.textContent = "Sincronizando com a planilha...";
  if (elements.refreshButton) {
    elements.refreshButton.disabled = true;
    elements.refreshButton.textContent = "Atualizando";
  }

  try {
    const { rows, source } = await loadSheet();
    state.events = rowsToEvents(rows);
    elements.syncStatus.textContent = `Atualizado às ${formatDate(new Date(), { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`;
  } catch (error) {
    if (!state.events.length) state.events = rowsToEvents(fallbackRows);
    elements.syncStatus.textContent = "Usando dados salvos; verifique o acesso da planilha";
    console.warn(error);
  } finally {
    state.isSyncing = false;
    if (elements.refreshButton) {
      elements.refreshButton.disabled = false;
      elements.refreshButton.textContent = "Atualizar";
    }
  }
  rerender();
}

elements.prevMonth.addEventListener("click", () => {
  state.currentDate.setMonth(state.currentDate.getMonth() - 1);
  rerender();
});

elements.nextMonth.addEventListener("click", () => {
  state.currentDate.setMonth(state.currentDate.getMonth() + 1);
  rerender();
});

elements.searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  rerender();
});

elements.refreshButton.addEventListener("click", syncEvents);

elements.filters.forEach((button) => {
  button.addEventListener("click", () => {
    elements.filters.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    state.filter = button.dataset.filter;
    rerender();
  });
});

syncEvents();
setInterval(syncEvents, REFRESH_MS);
