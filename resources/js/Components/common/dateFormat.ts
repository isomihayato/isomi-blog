const TIME_ZONE = 'Asia/Tokyo';

/**
 * 日時を日本時間の「YYYY-MM-DD」にする。
 *
 * - created_at / updated_at は UTC(例: 2026-11-04T15:30:00.000000Z)で渡されるため、日本時間に直す
 *   (そのまま先頭10文字を使うと、日本時間の0〜9時は前日の日付になる)
 * - published_at はタイムゾーンなしの日本時間(例: 2026-11-05 00:30:00)なので、そのまま日付部分を使う
 */
export function formatJstDate(value: string | null | undefined): string {
  if (!value) return '';
  const hasTimeZone = /(Z|[+-]\d{2}:?\d{2})$/.test(value);
  if (!hasTimeZone) return value.slice(0, 10);

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);
  // sv-SE は「YYYY-MM-DD」の形で出力される
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}
