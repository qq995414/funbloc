import React from 'react'
import { TableWrapper, Th, TheadTr } from "./TableStyle"

const Table = ({ ths, children, isStriped, theadTrBgColor = '', wrapperStyle}) => {
    return (
        <TableWrapper {...wrapperStyle}>
            <table className={`table text-center ${isStriped ? 'table-striped' : 'table-hover'}`}>
                <thead>
                <TheadTr bgColor={theadTrBgColor}>
                    {ths.map((th, idx) => <Th key={'th-' + idx}>{th}</Th>)}
                </TheadTr>
                </thead>
                <tbody>
                {children}
                </tbody>
            </table>
        </TableWrapper>
    )
}

export default Table
