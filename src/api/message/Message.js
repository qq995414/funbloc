import { ajax } from "../Api"

export const fetchMessages = ({ page, keyword, perPage = 10 } = {}) => {
    return new Promise((resolve, reject) => {
        ajax({
            url: '/notify',
            params: {
                page,
                perPage,
                keyword
            }
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}

export const createWish = (data) => {
    return new Promise((resolve, reject) => {
        ajax({
            url: '/wish',
            method: 'post',
            data
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}

export const createComment = (data) => {
    return new Promise((resolve, reject) => {
        ajax({
            url: '/comment',
            method: 'post',
            data
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}