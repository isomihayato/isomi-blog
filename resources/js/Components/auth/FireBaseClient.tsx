import { FirebaseError, initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';

import {
  deleteStorage,
  getStorage,
  setStorage,
} from '@/Components/common/functions';
import 'firebase/auth';
import { registerMember } from '@/Components/axios/axiosMember';
// Firebase の設定は .env の VITE_FIREBASE_* から読む(環境ごとに別の Firebase プロジェクトを使えるようにする)。
// .env に値がないときは、これまでの本番の値を使う(本番の .env に追加する前にデプロイしても動くようにするため)。
// Web 用の APIキーはブラウザに配信される前提の値。悪用を防ぐ制限は Firebase / Google Cloud のコンソールでかける(BLOG-68)。
const env = import.meta.env;
const firebaseConfig = {
  apiKey:
    env.VITE_FIREBASE_API_KEY || 'AIzaSyCYeWqXbNz5kvbPymgWTWHSgZFYHfiIkwY',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'info-box-eea0c.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'info-box-eea0c',
  storageBucket:
    env.VITE_FIREBASE_STORAGE_BUCKET || 'info-box-eea0c.appspot.com',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '968801419268',
  appId:
    env.VITE_FIREBASE_APP_ID || '1:968801419268:web:9de0cd22b035d24b537551',
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || 'G-S5HP2QHWW3',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// ログイン状態として localStorage に保存しているキー
const USER_KEY = 'user';
const PHOTO_KEY = 'photoUrl';

function saveLoginState(user: User) {
  setStorage(USER_KEY, { uid: user.uid });
  if (user.photoURL) {
    setStorage(PHOTO_KEY, user.photoURL);
  } else {
    deleteStorage(PHOTO_KEY);
  }
}

function clearLoginState() {
  deleteStorage(USER_KEY);
  deleteStorage(PHOTO_KEY);
}

/**
 * Firebase のログイン状態の変化を監視し、localStorage の値をそれに合わせる。
 * Firebase 側でセッションが切れた(別タブでログアウトした、期限切れなど)ときに、
 * 画面だけ「ログイン中」のままにならないようにする。
 * 戻り値は監視をやめる関数。
 */
export function watchLoginState(onChange: (loggedIn: boolean) => void) {
  return onAuthStateChanged(auth, (user) => {
    const stored = getStorage(USER_KEY);
    if (user) {
      if (!stored || stored.uid !== user.uid) saveLoginState(user);
    } else if (stored) {
      clearLoginState();
    }
    onChange(Boolean(user));
  });
}

// Firebase のエラーコードを、画面で使う結果の文字列("error:<コード>")にする
function toErrorResult(error: unknown): string {
  if (error instanceof FirebaseError) return `error:${error.code}`;
  console.error(error);
  return 'error:unknown';
}

/**
 * ログイン中のユーザーの Firebase IDトークンを返す(ログインしていなければ null)。
 * サーバーはこのトークンで本人確認をする。期限が切れていれば Firebase が自動で更新する。
 */
export async function getIdToken(): Promise<string | null> {
  // ページを開いた直後は、保存されたログイン状態の読み込みが終わるまで待つ
  await auth.authStateReady();
  return auth.currentUser ? auth.currentUser.getIdToken() : null;
}

export class FBClient {
  async passwordSignIn(email: string, password: string) {
    return await createUserWithEmailAndPassword(auth, email, password);
  }
  async googlePopup() {
    const provider = new GoogleAuthProvider();
    try {
      const auth = getAuth();
      const result = await signInWithPopup(auth, provider);
      // 会員登録が終わる前にコメントを投稿されないよう、完了を待ってからログイン状態にする
      await registerMember({
        fb_uid: result.user.uid,
        photo_url: result.user.photoURL,
      }).catch((err) => console.log(err));
      saveLoginState(result.user);
      return 'success';
    } catch (error) {
      return toErrorResult(error);
    }
  }

  async githubPopup() {
    const provider = new GithubAuthProvider();
    try {
      const auth = getAuth();
      const result = await signInWithPopup(auth, provider);
      // 会員登録が終わる前にコメントを投稿されないよう、完了を待ってからログイン状態にする
      await registerMember({ fb_uid: result.user.uid }).catch((err) =>
        console.log(err),
      );
      saveLoginState(result.user);
      return 'success';
    } catch (error) {
      return toErrorResult(error);
    }
  }

  /**
   * メールアドレスとパスワードでログインする。
   * 失敗しても新規登録はしない(打ち間違いで別のアカウントが作られないように)。
   */
  async mailSignIn(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // 以前の会員登録に失敗していた場合に備えて登録し直す(登録済みなら何もしない)
      await registerMember({ fb_uid: result.user.uid }).catch((err) =>
        console.log(err),
      );
      saveLoginState(result.user);
      return 'signin';
    } catch (error) {
      return toErrorResult(error);
    }
  }

  /**
   * メールアドレスとパスワードで新規登録する。
   */
  async mailSignUp(email: string, password: string) {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      // 会員登録が終わる前にコメントを投稿されないよう、完了を待ってからログイン状態にする
      await registerMember({ fb_uid: result.user.uid }).catch((err) =>
        console.log(err),
      );
      saveLoginState(result.user);
      return 'create';
    } catch (error) {
      return toErrorResult(error);
    }
  }

  /**
   * ログアウトする。Firebase のセッションと localStorage の両方を消す。
   */
  async signOut() {
    try {
      await signOut(auth);
    } finally {
      clearLoginState();
    }
  }

  async emailSignUp(email: string, pwd: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        pwd,
      );
      // await sendEmailVerification(userCredential.user);
      return userCredential.user.uid;
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e);
      }
    }
    return '';
  }
}
