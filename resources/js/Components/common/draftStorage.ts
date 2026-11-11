// エディターの下書きを localStorage に自動保存する。
// 書きかけの内容が、タブを閉じたり再読み込みしたりして消えるのを防ぐ。

const PREFIX = 'blogEditorDraft:';

export type Draft = {
  body: string;
  savedAt: string; // ISO 8601
};

export function loadDraft(key: string): Draft | null {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const draft = JSON.parse(raw);
    return typeof draft?.body === 'string' ? draft : null;
  } catch {
    // プライベートモードなどで localStorage が使えない、または壊れた値のときは下書きなしとして扱う
    return null;
  }
}

export function saveDraft(key: string, body: string): void {
  try {
    const draft: Draft = { body, savedAt: new Date().toISOString() };
    localStorage.setItem(PREFIX + key, JSON.stringify(draft));
  } catch {
    // 容量オーバーなどで保存できなくても、編集は続けられるようにする
  }
}

export function clearDraft(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    // 何もしない
  }
}
