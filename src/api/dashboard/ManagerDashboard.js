import { ajaxManager } from "../Api"


export const fetchDashboard = (startDate = '', endDate = '', hawkerIdsStr = '') => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: `/dashboard?${hawkerIdsStr}`,
            params: {
                startDate,
                endDate
            }
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}

export const fetchDashboardCompanyCount = (startDate = '', endDate = '') => {
    return new Promise((resolve, reject) => {
        ajaxManager({
            url: `/dashboard/companyCount`,
            params: {
                startDate,
                endDate
            }
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))
    })
}