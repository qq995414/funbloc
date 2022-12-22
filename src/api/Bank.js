import { ajaxManager } from "./Api"

export const fetchBankCode = () => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: '/banks'
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}