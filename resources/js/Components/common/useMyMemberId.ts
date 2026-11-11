import { useEffect, useState } from 'react';
import AxiosWrapper from '../axios/axios';
import { getIdToken } from '../auth/FireBaseClient';
import { getStorage } from './functions';

// ログイン中の会員ID。同じページで何度も問い合わせないよう、ログイン中のユーザーごとに1回だけ取得する
let cache: { uid: string; promise: Promise<number | null> } | null = null;

function fetchMyMemberId(): Promise<number | null> {
  return getIdToken().then(
    (token) =>
      new Promise<number | null>((resolve) => {
        if (!token) return resolve(null);
        AxiosWrapper({
          method: 'get',
          url: '/members/me',
          data: null,
          headers: { Authorization: `Bearer ${token}` },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          callback: (res: any) => resolve(res.data?.id ?? null),
          errors: () => resolve(null),
        });
      }),
    () => null,
  );
}

/**
 * ログイン中の会員のIDを返す(未ログイン・取得中・取得失敗のときは null)。
 * 自分のコメントにだけ編集・削除のメニューを出すために使う。
 */
export function useMyMemberId(): number | null {
  const [memberId, setMemberId] = useState<number | null>(null);
  const uid: string | undefined = getStorage('user')?.uid;

  useEffect(() => {
    if (!uid) {
      setMemberId(null);
      return;
    }
    if (!cache || cache.uid !== uid) {
      cache = { uid, promise: fetchMyMemberId() };
    }
    let active = true;
    cache.promise.then((id) => {
      if (active) setMemberId(id);
    });
    return () => {
      active = false;
    };
  }, [uid]);

  return memberId;
}
