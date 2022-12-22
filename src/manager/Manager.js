import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

const Manager = () => {

    useEffect(() => {
        document.title = '總後台管理系統'
    }, [])

    return (
        <>
            <Outlet />
        </>
    )
}

export default Manager