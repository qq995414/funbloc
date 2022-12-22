import React, { useEffect, useState } from 'react'
import { Outlet } from "react-router-dom"
import { fetchBankCode } from "../../api/Bank"

const CompanyRoute = () => {

    const [bankObject, setBankObject] = useState({})


    useEffect(() => {
        fetchBankCode()
            .then(res => {
                setBankObject({
                    banks: res.data,
                    map: res.data.reduce((prev, next) => {
                        prev[next.bank_code] = next.name
                        return prev
                    }, {})
                })
            })
            .catch(error => console.error(error))
    }, [])


    return (
        <Outlet context={bankObject} />
    )
}

export default CompanyRoute