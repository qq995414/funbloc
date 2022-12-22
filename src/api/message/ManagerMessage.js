import { ajaxManager } from "../Api"

export const fetchWishes = ({ page, perPage = 15, keyword } = {}) => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: `/wish`,
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


export const fetchWish = (wishId) => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: `/wish/${wishId}`,
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}

export const fetchComments = ({ page, perPage = 15, keyword } = {}) => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: `/comment`,
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

export const fetchComment = (commentId) => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: `/comment/${commentId}`,
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}