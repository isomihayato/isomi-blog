type SaveError = {
  response?: {
    data?: { message?: string; errors?: Record<string, string[]> };
  };
};

/**
 * 広告テンプレートの保存に失敗したときのメッセージ。入力エラー(422)は項目ごとのメッセージをまとめる
 */
export function adTemplateSaveErrorMessage(error: SaveError): string {
  const data = error.response?.data;
  const fieldErrors = data?.errors ? Object.values(data.errors).flat() : [];
  if (fieldErrors.length > 0) {
    return `保存できませんでした。入力を確認してください。\n${fieldErrors.join('\n')}`;
  }
  return (
    data?.message ??
    '保存できませんでした。時間をおいて、もう一度お試しください。'
  );
}
