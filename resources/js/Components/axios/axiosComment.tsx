import AxiosWrapper from './axios';
import { getIdToken } from '@/Components/auth/FireBaseClient';

// 本人確認のため、Firebase の IDトークンを Authorization ヘッダーに付けて送る
// (ログインしていないときは付けずに送り、サーバーから 401 が返る)
function withIdToken(send: (headers: Record<string, string>) => void, er: any) {
  getIdToken()
    .then((token) => send(token ? { Authorization: `Bearer ${token}` } : {}))
    .catch((e) => {
      console.error(e);
      er(e);
    });
}

// 記事のコメントを取得(失敗時は er を呼ぶ)
export function postComments(data: any, cb: any, er: any) {
  AxiosWrapper({
    method: 'post',
    url: '/comments/get/comments',
    data: data,
    callback: (res) => {
      cb(res);
    },
    errors: (res) => {
      er(res);
    },
  });
}

// コメントを投稿(失敗時は er を呼ぶ)
export default function postComment(data: any, cb: any, er: any) {
  withIdToken((headers) => {
    AxiosWrapper({
      method: 'post',
      url: '/comments',
      data: data,
      headers: headers,
      callback: (res) => {
        cb(res);
      },
      errors: (res) => {
        er(res);
      },
    });
  }, er);
}

export function getComments(articleId: number, cb: any) {
  AxiosWrapper({
    method: 'get',
    url: '/comments/article_comments/' + articleId,
    data: null,
    callback: (res) => {
      cb(res);
    },
    errors: (res) => {
      cb(res);
    },
  });
}

// コメントを編集(失敗時は er を呼ぶ。自分のコメント以外は 403)
export function postUpdateComment(data: any, cb: any, er: any) {
  withIdToken((headers) => {
    AxiosWrapper({
      method: 'post',
      url: '/comments/update',
      data: data,
      headers: headers,
      callback: (res) => {
        cb(res);
      },
      errors: (res) => {
        er(res);
      },
    });
  }, er);
}

// コメントを削除(失敗時は er を呼ぶ。自分のコメント以外は 403)
export function deleteComment(commentId: number, cb: any, er: any) {
  withIdToken((headers) => {
    AxiosWrapper({
      method: 'delete',
      url: '/comments/' + commentId,
      data: null,
      headers: headers,
      callback: (res) => {
        cb(res);
      },
      errors: (res) => {
        er(res);
      },
    });
  }, er);
}
