import React from 'react'
import { createPortal } from "react-dom"

const portal = document.querySelector('#portal')

const Portal = ({ children }) => {
    return createPortal(children, portal)
}

export default Portal