/**
 * 日時を日本時間の「YYYY-MM-DD HH:mm」にする(秒は出さない)。
 * created_at などは UTC(例: 2026-11-04T15:30:12.000000Z)で渡されるため、日本時間に直す。
 */
export function formatJstDateTime(value: string | null | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 16);
  // sv-SE は「YYYY-MM-DD HH:mm」の形で出力される
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
