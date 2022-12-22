import { ajaxManager } from "./Api"

export const fetchCompanies = ({ page, keyword, stats, type, perPage = 10 }) => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: '/supplys',
            params: { page, keyword: keyword, stats: stats, type: type, perPage: perPage }
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}

export const fetchCompany = (companyId) => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: `/supplys/${companyId}`
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}


export const changeCompanyStats = (stats, ids) => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: '/supplys/stats',
            method: 'put',
            data: {
                value: stats,
                ids
            }
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}

export const createCompany = ({
                                  name,
                                  window,
                                  phone,
                                  address,
                                  bank_code,
                                  bank_account,
                                  checkout,
                                  type
                              }) => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: '/supplys',
            method: 'post',
            data: {
                name,
                window,
                type, // 不明分類
                phone,
                address,
                bank_code,
                bank_account,
                checkout
            }
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}

export const editCompany = (companyId, {
    name,
    window,
    type,
    phone,
    address,
    bank_code,
    bank_account,
    checkout
}) => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: `/supplys/${companyId}`,
            method: 'put',
            data: {
                name,
                window,
                type,
                phone,
                address,
                bank_code,
                bank_account,
                checkout
            }
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}


// company types

export const fetchCompanyTypes = ({ page = 1, perPage = 100, keyword = '' } = {}) => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: '/types/supplys',
            params: {
                page,
                perPage,
                keyword,
            }
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}

export const fetchCompanyTypeDetail = (companyId) => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: `/types/supplys/${companyId}`
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}

export const createCompanyType = (num, name, note) => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: '/types/supplys',
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

export const editCompanyType = (companyId, num, name, note) => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: `/types/supplys/${companyId}`,
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

export const deleteCompanyType = (companyId) => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: `/types/supplys/${companyId}`,
            method: 'delete'
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}

export const sortCompanyType = (ids) => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: '/types/supplys/sort',
            method: 'put',
            data: ids
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}