import React from 'react'
import { arrayMove, List } from "react-movable"
import {
    HeadCol,
    HeadRow,
    SortableTableWrapper,
    SortedItemRow,
    StyledLi,
    StyledUl
} from "../../../component/table/SortableTableStyle"

const SortableTable = ({
    heads,
    data,
    handleSort,
    selectedTypeId,
    selectedSubTypeId,
    onRowClicked,
    isLoading,
    setShouldSort,
    openCreateSubTypeModal,
    openDeleteSubTypeModal,
}) => {

    return (
        <SortableTableWrapper>

            <List
                values={data}
                onChange={({ oldIndex, newIndex }) => {
                    if (isLoading) return
                    handleSort((prev) => arrayMove(prev, oldIndex, newIndex))
                    setShouldSort(true)
                }}
                renderList={({ children, props }) => <StyledUl {...props}>{children}</StyledUl>}
                renderItem={({ value, props, isDragged }) => {
                    return <StyledLi  {...props}>

                        <SortedItemRow
                            className={selectedTypeId === value.id ? 'active' : ''}
                            style={{ borderBottom: "1px solid #E1E1E1" }}
                            onClick={() => onRowClicked(value.id, value.subTypeId)}>
                            <div className="col">{ }<button
                                className="border-0 bg-transparent me-3 col-12"
                                data-movable-handle
                                style={{
                                    cursor: isDragged ? 'grabbing' : 'grab',
                                }}
                                tabIndex={-1}
                            >{value.num}</button></div>
                            <div className="col">{value.name}</div>
                            <div className="col">
                                {value.editSubTypeButton}
                                {
                                    value?.editSubTypeButton &&
                                    <button className="btn  text-white" disabled={isLoading}
                                        onClick={() => openDeleteSubTypeModal(value)}>
                                        <img src="/images/front-end/product_remove.svg" alt="" />
                                    </button>
                                }
                            </div>
                        </SortedItemRow>

                    </StyledLi>
                }}
            />
            < div className="text-center py-2" style={{
                backgroundColor: "#FFFFFF"
            }}>
                
            </div >
        </SortableTableWrapper >
    )
}

export default SortableTable