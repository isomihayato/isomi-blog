import React from 'react';
import { postFavorite } from '../axios/axiosFavorite';

const ANIMATION_CLASS = 'jump-animation';

/**
 * お気に入りアイコンのジャンプアニメーションを(再)実行する。
 * クラスが残ったままだと2回目以降のクリックでアニメーションが再生されないため、
 * 一度外してリフローさせてから付け直す。
 */
export function playFavoriteAnimation(element: HTMLElement | null) {
  if (!element) return;
  element.classList.remove(ANIMATION_CLASS);
  void element.getBoundingClientRect(); // リフローを発生させてアニメーションをリセット
  element.classList.add(ANIMATION_CLASS);
}

/**
 * お気に入り数を楽観的に更新するクリックハンドラを返す。
 * - クリック直後に件数を +1 しアニメーションを開始(API応答を待たない)
 * - API成功時はサーバーが返した件数で確定(最新リクエストの応答のみ反映)
 * - API失敗時は +1 した分を取り消す
 */
export function useFavoriteClick(
  articleId: number,
  setFavorites: React.Dispatch<React.SetStateAction<number | undefined>>,
) {
  const latestRequest = React.useRef(0);

  return React.useCallback(() => {
    const requestId = ++latestRequest.current;
    setFavorites((prev) => (prev ?? 0) + 1);
    playFavoriteAnimation(document.getElementById('favorite'));

    postFavorite(
      { article_id: articleId },
      (res) => {
        const count = (res.data as { favorites?: unknown })?.favorites;
        if (requestId === latestRequest.current && typeof count === 'number') {
          setFavorites(count);
        }
      },
      (err) => {
        console.log(err);
        setFavorites((prev) => Math.max((prev ?? 1) - 1, 0));
      },
    );
  }, [articleId, setFavorites]);
}
