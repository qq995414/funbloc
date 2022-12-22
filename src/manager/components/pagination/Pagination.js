import React from 'react'
import _ from 'lodash'
import { PageItem, PageLink } from "./PaginationStyle"

const pageLeftIcon = '/images/manager/pagination_arrow_left.png'
const pageRightIcon = '/images/manager/pagination_arrow_right.png'

const Pagination = ({ pageObject, currentPage, setCurrentPage }) => {
    const { totalPage } = pageObject


    if (_.isEmpty(pageObject)) return null

    return (
        <nav aria-label="Page navigation example">
            <ul className="pagination pagination-primary justify-content-center">
                <PageItem className="page-item ">
                    <PageLink className="page-link border-0 bg-transparent arrow "
                              onClick={() => setCurrentPage(prev => prev - 1 <= 0 ? 1 : prev - 1)}>
                        <img src={pageLeftIcon} alt="previous" />
                    </PageLink>
                </PageItem>
                {
                    [...Array(totalPage)].map((_, idx) => {
                        return <PageItem
                            className={`page-item border-0 ${(idx + 1) === currentPage ? 'active' : ''}`}
                            key={idx}>
                            <PageLink className="page-link rounded-circle "
                                      onClick={() => setCurrentPage(idx + 1)}>{idx + 1}</PageLink>
                        </PageItem>
                    })
                }
                <PageItem className="page-item">
                    <PageLink className="page-link border-0 bg-transparent  arrow"
                              onClick={() => setCurrentPage(prev => prev + 1 > totalPage ? totalPage : prev + 1)}>
                        <img src={pageRightIcon} alt="next" />
                    </PageLink>
                </PageItem>
            </ul>
        </nav>
    )
}

export default Pagination