// todo when i have time to finish it
export const getAllData = (callback = () => {}) => {
    return new Promise((resolve, reject) => {
        const allData = []
        let page = 0
        let totalPage = 1

        callback()
            .then(res => {
                allData.push([...res.data])
                page = res.meta.page
                totalPage = res.meta.totalPage
                if (page <= totalPage) {
                    getAllData(callback)
                }
            })
            .catch(error => {

            })


    })


}

