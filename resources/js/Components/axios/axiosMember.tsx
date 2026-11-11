import AxiosWrapper from "./axios"

export default function postMember(data: any, cb: any, er: any) {
    AxiosWrapper({
        method: 'post',
        url: '/members',
        data: data,
        callback: (res) => {cb(res)},
        errors: (res) => {er(res)},
    })
}

// 会員登録の完了を待てるようにした版(登録済みの会員でも成功として扱われる)
export function registerMember(data: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
        postMember(data, resolve, reject)
    })
}
