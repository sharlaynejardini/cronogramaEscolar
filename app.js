const SHEET_ID = "1nxcIGQBB6mI_JXcSBeDvKdeX41vuPsaek8I-RRLtoO8";
const SHEET_GID = "1366818204";
const REFRESH_MS = 15 * 1000;


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

async function loadSheet() {
  const cacheBust = Date.now();
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GID}&range=A:D&_=${cacheBust}`;
  const response = await fetch(url, { cache: "reload" });
  if (!response.ok) throw new Error("Não foi possível ler o CSV da planilha.");
  return parseCsv(await response.text());
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
    const rows = await loadSheet();
    state.events = rowsToEvents(rows);
    elements.syncStatus.textContent = `Atualizado às ${formatDate(new Date(), { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`;
  } catch (error) {
    elements.syncStatus.textContent = "Não foi possível carregar a planilha";
    console.error(error);
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
