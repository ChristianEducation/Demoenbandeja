export const formatCLP = (value: number) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);

const dateFormatter = new Intl.DateTimeFormat("es-CL", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

export const formatLongDate = (date: string) => {
  const value = dateFormatter.format(new Date(`${date}T12:00:00Z`));
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const formatShortDate = (date: string) =>
  new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  })
    .format(new Date(`${date}T12:00:00Z`))
    .replace(".", "");

const diacriticsPattern = new RegExp(
  `[${String.fromCharCode(0x300)}-${String.fromCharCode(0x36f)}]`,
  "g",
);

export const normalizeSearch = (value: string) =>
  value
    .normalize("NFD")
    .replace(diacriticsPattern, "")
    .toLocaleLowerCase("es-CL")
    .trim();

export const matchesSearch = (value: string, query: string) => {
  const terms = normalizeSearch(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const words = normalizeSearch(value).split(/\s+/).filter(Boolean);
  return terms.every((term) => words.some((word) => word.startsWith(term)));
};

/** Hora actual en Santiago, formato HH:mm, para comparar contra un corte configurado. */
export const currentSantiagoTime = (now = new Date()) =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Santiago",
  }).format(now);

export const isBeforeCutoff = (cutoff: string, now = new Date()) =>
  currentSantiagoTime(now) < cutoff;

const dayAbbreviations: Record<string, string> = {
  Lunes: "LUN",
  Martes: "MAR",
  Miércoles: "MIÉ",
  Jueves: "JUE",
};

export const formatDayLabel = (date: string, dayName: string) =>
  `${dayAbbreviations[dayName] ?? dayName.slice(0, 3).toUpperCase()} ${Number(date.slice(-2))}`;
