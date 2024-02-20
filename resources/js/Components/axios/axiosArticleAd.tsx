import AxiosWrapper from "./axios"

export default function postArticleAd(data: any,cb: any,errors: any) {
    AxiosWrapper({
        method: 'post',
        url: '/article_ad_templates',
        data: data,
        callback: (res: any) => { cb(res) },
        errors: (res: any) => { errors(res) },
    })
}