import { ajax } from "../Api"


export const fetchOrders = (funblocId, { page, perPage = 10, keyword, stats, startDate, endDate } = {}) => {
    return new Promise((resolve, reject) => {
        ajax({
            url: `/funbloc/ing/${funblocId}/order`,
            params: {
                page,
                perPage,
                keyword,
                stats,
                startDate,
                endDate
            }
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}

export const fetchOrderDetail = (funblocId) => {
    return new Promise((resolve, reject) => {
        ajax({
            url: `/funbloc/ing/${funblocId}/detail`,
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}