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