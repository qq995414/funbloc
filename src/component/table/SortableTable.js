import React from 'react'
import { arrayMove, List } from "react-movable"
import { HeadCol, HeadRow, SortableTableWrapper, SortedItemRow, StyledLi, StyledUl } from "./SortableTableStyle"

const SortableTable = ({
                           heads,
                           data,
                           handleSort,
                           selectedTypeId,
                           onRowClicked,
                           isLoading,
                           setShouldSort
                       }) => {

    return (
        <SortableTableWrapper>
            <div>
                <HeadRow>
                    {
                        heads.map((head, idx) => {

                            if (idx === 0) return <HeadCol key={head} className="col-3">{head}</HeadCol>
                            if (idx === 2) return <HeadCol key={head} className="col-4">{head}</HeadCol>
                            if (idx === 3) return <HeadCol key={head} className="col-2">{head}</HeadCol>

                            return <HeadCol key={head} className="col">{head}</HeadCol>
                        })
                    }
                </HeadRow>
            </div>
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
                        <SortedItemRow className={selectedTypeId === value.id ? 'active' : ''}
                                       onClick={() => onRowClicked(value.id)}>
                            <div className="col-3">
                                <button
                                    className="border-0 bg-transparent me-3"
                                    data-movable-handle
                                    style={{
                                        cursor: isDragged ? 'grabbing' : 'grab',
                                    }}
                                    tabIndex={-1}
                                >
                                    <i className="bi bi-grip-horizontal" />
                                </button>
                                {value.button}
                            </div>
                            <div className="col">{value.num}</div>
                            <div className="col-4">{value.name}</div>
                            {
                                value?.setSubTypeButton && <div className="col-2">
                                    {value?.setSubTypeButton}
                                </div>
                            }

                        </SortedItemRow>
                    </StyledLi>
                }}
            />
        </SortableTableWrapper>
    )
}

export default SortableTable