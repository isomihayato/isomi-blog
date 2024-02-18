import AxiosWrapper from "./axios"

export function postArticleImg(data:any,cb:any) {
    AxiosWrapper({
      method: 'post',
      url: '/articles/uploadImg',
      data: data,
      callback: (res:any) => {cb(res)},
      errors: (res:any) => {cb(res)},
    })
}

export function postArticle(data:any,cb:any) {
    AxiosWrapper({
      method: 'post',
      url: '/articles',
      data: data,
      callback: (res:any) => {cb(res)},
      errors: (res:any) => {cb(res)},
    })
}
