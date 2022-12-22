import { ajaxManager } from "../Api"


export const fetchHawkers = ({
                                 page,
                                 perPage = 10,
                                 keyword,
                                 stats,
                                 type
                             } = {}) => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: '/hawker',
            params: {
                page,
                perPage,
                keyword,
                stats,
                type
            }
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}

export const fetchHawker = (hawkerId) => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: `/hawker/${hawkerId}`
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}

export const createHawker = ({
                                 name,
                                 phone,
                                 address,
                                 joinAt,
                                 bankCode,
                                 bankAccount,
                                 type,
                                 note,
                                 account,
                                 password
                             }) => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: '/hawker',
            method: 'post',
            data: {
                name,
                phone,
                address,
                join_at: joinAt,
                bank_code: bankCode,
                bank_account_: bankAccount,
                type,
                note,
                account,
                password
            }
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}

export const fetchBlockHawker = (hawkerId) => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: `/hawker/${hawkerId}/black`
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}

export const activateHawker = (hawkerId) => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: `/hawker/${hawkerId}/black`,
            method: 'post',
            data: {
                value: 0
            }
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}

export const blockHawker = (hawkerId, note) => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: `/hawker/${hawkerId}/black`,
            method: 'post',
            data: {
                value: 1,
                note
            }
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}


export const editHawker = (hawkerId, data) => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: `/hawker/${hawkerId}`,
            method: 'put',
            data
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}


// type

export const fetchHawkerTypes = ({
                                     page,
                                     perPage = 100,
                                     keyword,
                                     stats,
                                     type
                                 }) => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: '/types/hawker',
            params: {
                page,
                perPage,
                keyword,
                stats,
                type
            }
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}

export const fetchHawkerTypeDetail = (hawkerTypeId) => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: `/types/hawker/${hawkerTypeId}`
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}

export const deleteHawkerType = (hawkerTypeId) => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: `/types/hawker/${hawkerTypeId}`,
            method: 'delete'
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}

export const createHawkerType = (num, name, note) => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: '/types/hawker',
            method: 'post',
            data: {
                num,
                name,
                note
            }
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}

export const editHawkerType = (hawkerTypeId, num, name, note) => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: `/types/hawker/${hawkerTypeId}`,
            method: 'put',
            data: {
                num,
                name,
                note
            }
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}

export const sortHawkerType = (ids) => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: '/types/hawker/sort',
            method: 'put',
            data: ids
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}

export const resetHawkerPassword = (hawkerId) => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: `/hawker/${hawkerId}/reset-password`,
            method: 'post'
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}
