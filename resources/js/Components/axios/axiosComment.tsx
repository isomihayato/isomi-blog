import AxiosWrapper from "./axios"

// 記事のコメントを取得
export function postComments(data: any, cb: any) {
    AxiosWrapper({
        method: 'post',
        url: '/comments/get/comments',
        data: data,
        callback: (res) => {cb(res)},
        errors: (res) => {cb(res)},
    })
}

export default function postComment(data: any, cb: any) {
    AxiosWrapper({
        method: 'post',
        url: '/comments',
        data: data,
        callback: (res) => {cb(res)},
        errors: (res) => {cb(res)},
    })
}

export function getComments(articleId: number, cb: any) {
    AxiosWrapper({
        method: 'get',
        url: '/comments/article_comments/' + articleId,
        data: null,
        callback: (res) => {cb(res)},
        errors: (res) => {cb(res)},
    })
}
export function postUpdateComment(data: any, cb: any) {
    AxiosWrapper({
        method: 'post',
        url: '/comments/update',
        data: data,
        callback: (res) => {cb(res)},
        errors: (res) => {cb(res)},
    })
}

export function deleteComment(commentId: number, cb: any) {
    AxiosWrapper({
        method: 'delete',
        url: '/comments/' + commentId,
        data: null,
        callback: (res) => {cb(res)},
        errors: (res) => {cb(res)},
    })
}