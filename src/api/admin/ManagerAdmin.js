import { ajaxManager } from "../Api"

export const fetchAdminAccounts = ({ page, keyword, stats, type, perPage = 10 }) => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: '/auth',
            params: { page, keyword: keyword, stats: stats, type: type, perPage: perPage }
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}

export const createAdminAccount = (data) => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: '/auth/register',
            method: 'post',
            data
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}


export const editAdminAccount = (id, data) => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: `/auth/${id}`,
            method: 'post',
            data
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}

export const changeAdminAccountStats = (id, stats) => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: `/auth/${id}/stats`,
            method: 'put',
            data: {
                value: stats
            }
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}

export const fetchNotifies = () => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: `/notify`,
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}

export const sendNotify = (data) => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: '/notify',
            method: 'post',
            data
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}