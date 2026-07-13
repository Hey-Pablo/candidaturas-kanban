/**
 * Converte "YYYY-MM-DD" para Date considerando o timezone local.
 * Evita o bug de -1 dia causado pelo ISO 8601 ser interpretado como UTC.
 */
export function parseDataLocal(dataStr: string): Date {
  const [y, m, d] = dataStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Formata "YYYY-MM-DD" no formato pt-BR (dd/mm/aaaa) sem erro de timezone.
 */
export function formatarData(dataStr: string): string {
  if (!dataStr) return "";
  const data = parseDataLocal(dataStr);
  return data.toLocaleDateString("pt-BR");
}
