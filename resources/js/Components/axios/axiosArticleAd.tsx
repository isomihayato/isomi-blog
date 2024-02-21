import axios from "axios";
import AxiosWrapper, { axiosAwait } from "./axios"

export default function postArticleAd(data: any,cb: any,errors: any) {
    AxiosWrapper({
        method: 'post',
        url: '/article_ad_templates',
        data: data,
        callback: (res: any) => { cb(res) },
        errors: (res: any) => { errors(res) },
    })
}

export function putArticleAd(ad_template_id: number,data: any,cb: any,errors: any) {
    const url = '/article_ad_templates/update/' + ad_template_id;
    AxiosWrapper({
        method: 'post',
        url: url,
        data: data,
        callback: (res: any) => { cb(res) },
        errors: (res: any) => { errors(res) },
    })
    // axiosAwait({
    //     method: 'PATCH',
    //     url: url,
    //     data: data
    // }).then((res: any) => { cb(res) })
    // .catch((res: any) => { errors(res) });
}
