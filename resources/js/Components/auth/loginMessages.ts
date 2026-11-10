// ログイン・新規登録の結果(FBClient の戻り値)を、画面に出すメッセージにする

export type LoginMessage = {
  severity: 'success' | 'warning' | 'error';
  text: string;
} | null; // null は何も表示しない(ユーザーが自分でポップアップを閉じたときなど)

const ERROR_MESSAGES: Record<string, LoginMessage> = {
  // パスワード違い・未登録のメールアドレス(Firebase はどちらか区別できないコードを返すことがある)
  'auth/invalid-credential': {
    severity: 'error',
    text: 'メールアドレスまたはパスワードが違います。はじめての方は「新規登録」を押してください。',
  },
  'auth/invalid-login-credentials': {
    severity: 'error',
    text: 'メールアドレスまたはパスワードが違います。はじめての方は「新規登録」を押してください。',
  },
  'auth/wrong-password': {
    severity: 'error',
    text: 'パスワードが違います。',
  },
  'auth/user-not-found': {
    severity: 'error',
    text: 'このメールアドレスは登録されていません。はじめての方は「新規登録」を押してください。',
  },
  'auth/email-already-in-use': {
    severity: 'warning',
    text: 'このメールアドレスは登録済みです。「ログイン」を押してください。',
  },
  'auth/weak-password': {
    severity: 'error',
    text: 'パスワードは6文字以上にしてください。',
  },
  'auth/invalid-email': {
    severity: 'error',
    text: 'メールアドレスの形式が正しくありません。',
  },
  'auth/too-many-requests': {
    severity: 'error',
    text: '失敗が続いたため、一時的にログインできません。しばらくしてからもう一度お試しください。',
  },
  'auth/network-request-failed': {
    severity: 'error',
    text: '通信に失敗しました。ネットワークを確認して、もう一度お試しください。',
  },
  'auth/account-exists-with-different-credential': {
    severity: 'warning',
    text: 'このメールアドレスは、他のログイン方法(Google・GitHub・メールアドレス)で登録済みです。',
  },
  'auth/popup-blocked': {
    severity: 'error',
    text: 'ログイン用の画面がブラウザにブロックされました。ポップアップを許可してください。',
  },
  // 自分でポップアップを閉じた・続けて押した場合はエラーを出さない
  'auth/popup-closed-by-user': null,
  'auth/cancelled-popup-request': null,
};

export function toLoginMessage(result: string | undefined): LoginMessage {
  if (result === 'signin' || result === 'success') {
    return { severity: 'success', text: 'ログインしました。' };
  }
  if (result === 'create') {
    return { severity: 'success', text: '新規登録しました。' };
  }
  const code = result?.startsWith('error:')
    ? result.slice('error:'.length)
    : '';
  if (code in ERROR_MESSAGES) return ERROR_MESSAGES[code];
  return {
    severity: 'error',
    text: 'ログインできませんでした。時間をおいて、もう一度お試しください。',
  };
}

export function isLoginSucceeded(result: string | undefined) {
  return result === 'signin' || result === 'success' || result === 'create';
}
