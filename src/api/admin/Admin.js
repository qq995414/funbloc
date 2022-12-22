import { ajax } from "../Api"


export const fetchMe = () => {
    return new Promise((resolve, reject) => {
        ajax({
            url: '/auth/me'
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))

    })
}

export const editDataAtFirstTime = (data) => {
    return new Promise((resolve, reject) => {
        ajax({
            url: '/auth/me',
            method: 'patch',
            data
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))

    })
}

export const editUserInfo = (data) => {
    return new Promise((resolve, reject) => {
        ajax({
            url: '/auth/me',
            method: 'post',
            data
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))

    })
}

export const editPassword = (data) => {
    return new Promise((resolve, reject) => {
        ajax({
            url: '/auth/password',
            method: 'put',
            data
        })
            .then(res => resolve(res.data))
            .catch(error => reject(error))

    })
}