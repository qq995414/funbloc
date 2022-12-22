import { ajax } from "../Api"


export const fetchDashboard = (startDate = '', endDate = '') => {
    return new Promise((resolve, reject) => {
        ajax({
            url: '/dashboard',
            params: {
                startDate,
                endDate
            }
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}

export const fetchMyPriceTotal = () => {
    return new Promise((resolve, reject) => {
        ajax({
            url: `/my-price-total`
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}