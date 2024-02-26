import AxiosWrapper from "./axios"

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