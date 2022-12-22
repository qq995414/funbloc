import React, { useCallback, useEffect, useState } from 'react'
import moment from "moment"
import {
    AllFunblocButton,
    ConfirmationStats,
    ConfirmationStatsWrapper,
    HomeTitle,
    OffsetCanvasCard,
    StatsLabel,
    StatsNumber,
    StyledDate
} from "./HomeStyle"
import { MonthRangePicker, SingleDatePicker } from "../../component/datepicker/DatePicker"
import { Offcanvas } from "react-bootstrap"
import { ContentWrapper, SearchIcon, SearchInput } from "../../component/StyledComponent"
import Table from "../../component/table/Table"
import { Tr } from "../../component/table/TableStyle"
import { fetchHawkers } from "../../api/hawker/ManagerHawker"
import { fetchDashboard, fetchDashboardCompanyCount } from "../../api/dashboard/ManagerDashboard"
import { numberWithThousandCommas } from "../../helper/Helper"
import Dialog from "../../component/dialog/Dialog"
import { DialogContentWrapper } from "../../component/dialog/DialogStyle"


const Home = () => {
    const [startDate, setStartDate] = useState(moment().subtract(11, 'month').valueOf());
    const [endDate, setEndDate] = useState(moment().add(1, "month").startOf("month").valueOf());


    const [showOffsetCanvas, setShowOffsetCanvas] = useState(false)

    const closeOffsetCanvas = () => setShowOffsetCanvas(false)
    const openOffsetCanvas = () => setShowOffsetCanvas(true)

    const [dashboard, setDashboard] = useState({
        count: {
            countMyPrice: 0,
            countCost: 0,
            countProfit: 0,
            countCancel: 0
        },
        topList: []
    })
    const [inputKeyword, setInputKeyword] = useState('')
    const [keyword, setKeyword] = useState('')
    const [hawkers, setHawkers] = useState([])

    const [selectedHawkers, setSelectedHawkers] = useState([])
    const [modalIsLoading, setModalIsloading] = useState(false)
    const [companyCount, setCompanyCount] = useState({
        countCost: 0,
        countMyPrice: 0,
        countProfit: 0
    })
    const [modalDateRange, setModalDateRange] = useState([
        moment().startOf('month').valueOf(),
        moment().add(1, 'month').startOf('month').valueOf()
    ])
    const [modalStartDate, setModalStartDate] = useState(moment().subtract(11, 'month').valueOf());
    const [modalEndDate, setModalEndDate] = useState(moment().add(1, "month").startOf("month").valueOf());

    const [shouldModalOpen, setShouldModalOpen] = useState(false)

    const ths = ['本月銷售排名', '廠商名稱', '商品', '成本', '出售金額', '銷售數量', '毛利總額']

    const selectHawker = (id, checked) => {
        if (checked) {
            setSelectedHawkers(prev => [...prev, id])
        } else {
            setSelectedHawkers(prev => prev.filter(_id => id !== _id))
        }
    }

    const closeModal = () => {
        setShouldModalOpen(false)
    }

    const getDashboard = useCallback((formattedStartDate, formattedEndDate, hawkerIdsStr = '') => {
        return new Promise((resolve, reject) => {
            fetchDashboard(formattedStartDate, formattedEndDate, hawkerIdsStr)
                .then(res => {
                    resolve(res.data)
                })
                .catch(error => {
                    reject(error)
                })
        })

    }, [])


    useEffect(() => {
        fetchHawkers({ page: 1, perPage: 1000, keyword })
            .then((res) => {
                setHawkers(res.data)
            })
            .catch(error => {
                console.log(error)
            })
            .finally()
    }, [keyword])

    useEffect(() => {
        const formattedStartDate = moment(startDate).format('YYYY/MM/DD')
        const formattedEndDate = moment(endDate).format('YYYY/MM/DD')

        if (formattedStartDate === 'Invalid date' || formattedEndDate === 'Invalid date') return

        const hawkerIdsStr = selectedHawkers.map(id => "hawkerIds[]=" + id).join('&')


        getDashboard(formattedStartDate, formattedEndDate, hawkerIdsStr)
            .then(res => {
                setDashboard(res)
            })
            .catch(error => {
                console.error(error)
            })
    }, [startDate, getDashboard, selectedHawkers, endDate])

    useEffect(() => {

        setModalIsloading(true)
        const formattedStartDate = moment(modalStartDate).format('YYYY/MM/DD')
        const formattedEndDate = moment(modalEndDate).format('YYYY/MM/DD')

        if (formattedStartDate === 'Invalid date' || formattedEndDate === 'Invalid date') return

        fetchDashboardCompanyCount(formattedStartDate, formattedEndDate)
            .then(res => {
                setCompanyCount(res.data)
            })
            .catch(error => {
                console.error(error)
            })
            .finally(() => {
                setModalIsloading(false)
            })
    }, [modalStartDate, modalEndDate])

    return (
        <div className="container-fluid p-5">
            <div className="d-flex justify-content-between align-items-center">
                <HomeTitle>一起揪團賺外快</HomeTitle>
                <button className="btn btn-primary text-white px-4 rounded-pill" onClick={() => {
                    setShouldModalOpen(true)
                }}>官方資訊
                </button>
            </div>

            <div className="my-4 d-flex">
                <StyledDate>
                    <i className="bi bi-calendar text-primary" />
                    <SingleDatePicker startDate={startDate} setStartDate={setStartDate} />
                </StyledDate>
                <StyledDate>
                    <i className="bi bi-calendar text-primary" />
                    <SingleDatePicker startDate={endDate} setStartDate={setEndDate} />
                </StyledDate>
                <AllFunblocButton onClick={openOffsetCanvas}>所有販團 <i
                    className="bi bi-caret-down-fill text-primary" /></AllFunblocButton>
            </div>

            <ContentWrapper>
                <ConfirmationStatsWrapper>
                    <ConfirmationStats>
                        <StatsLabel>總收入</StatsLabel>
                        <StatsNumber>${numberWithThousandCommas(dashboard.count.countMyPrice)}</StatsNumber>
                    </ConfirmationStats>
                    <ConfirmationStats>
                        <StatsLabel>總支出</StatsLabel>
                        <StatsNumber>${numberWithThousandCommas(dashboard.count.countCost)}</StatsNumber>
                    </ConfirmationStats>
                    <ConfirmationStats>
                        <StatsLabel>總利潤</StatsLabel>
                        <StatsNumber>${numberWithThousandCommas(dashboard.count.countProfit)}</StatsNumber>
                    </ConfirmationStats>
                    <ConfirmationStats>
                        <StatsLabel>退訂金額</StatsLabel>
                        <StatsNumber>${numberWithThousandCommas(dashboard.count.countCancel)}</StatsNumber>
                    </ConfirmationStats>
                </ConfirmationStatsWrapper>
            </ContentWrapper>

            <HomeTitle className="mb-4">商品銷售總排名</HomeTitle>
            <Table ths={ths}>
                {
                    dashboard.topList.map((list, idx) => {
                        const profit = (list.price - list.quote) * (list.amount * 1)
                        return <Tr key={list.id}>
                            <td>{idx + 1}</td>
                            <td>{list.supply}</td>
                            <td>{list.name}</td>
                            <td className="fw-bold">{numberWithThousandCommas(list.quote)}</td>
                            <td className="fw-bold">{numberWithThousandCommas(list.price)}</td>
                            <td className="fw-bold">{numberWithThousandCommas(list.amount * 1)}</td>
                            <td>{numberWithThousandCommas(profit)}</td>
                        </Tr>
                    })
                }
            </Table>

            <Offcanvas show={showOffsetCanvas} onHide={closeOffsetCanvas} placement="end">
                <Offcanvas.Body className="py-5 px-4">
                    <div className="position-relative mb-3">
                        <SearchInput type="text"
                            value={inputKeyword}
                            onChange={(e) => setInputKeyword(e.target.value)}
                            placeholder="關鍵字搜尋..." />
                        <SearchIcon onClick={() => setKeyword(inputKeyword)}>
                            <i className="bi bi-search" />
                        </SearchIcon>
                    </div>
                    <div>
                        {
                            hawkers.map((hawker) => {
                                return <div className="d-flex align-items-center mb-3" key={hawker.id}>
                                    <input type="checkbox" className="form-check-input"
                                        disabled={modalIsLoading || (selectedHawkers.length >= 1 && !selectedHawkers.includes(hawker.id))}
                                        checked={selectedHawkers.includes(hawker.id)}
                                        onChange={(e) => selectHawker(hawker.id, e.target.checked)} />
                                    <OffsetCanvasCard>
                                        <div className="name">
                                            {hawker.name}
                                            <span>{hawker.num}</span>
                                        </div>
                                        <div className="phone">{hawker.phone}</div>
                                    </OffsetCanvasCard>
                                </div>
                            })
                        }
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

            {
                shouldModalOpen && <Dialog onClose={closeModal}>
                    <DialogContentWrapper className="py-5">
                        <div className="my-4 d-flex">
                            <StyledDate>
                                <i className="bi bi-calendar text-primary" />
                                <SingleDatePicker startDate={modalStartDate} setStartDate={setModalStartDate} />
                            </StyledDate>
                            <StyledDate>
                                <i className="bi bi-calendar text-primary" />
                                <SingleDatePicker startDate={modalEndDate} setStartDate={setModalEndDate} />
                            </StyledDate>
                        </div>
                        <div className="container py-3 mb-4">
                            <div className="row w-75 mt-4 mb-3 mx-auto">
                                <div className="col text-end">營業額</div>
                                <div
                                    className="col fw-bolder">${numberWithThousandCommas(companyCount.countMyPrice)}</div>
                            </div>
                            <div className="row w-75 mb-3  mx-auto">
                                <div className="col text-end">總支出</div>
                                <div
                                    className="col  fw-bolder">${numberWithThousandCommas(companyCount.countCost)}</div>
                            </div>
                            <div className="row w-75  mx-auto">
                                <div className="col text-end">總利潤</div>
                                <div className="col  fw-bolder">
                                    ${numberWithThousandCommas(companyCount.countProfit)}
                                </div>
                            </div>
                        </div>
                        <button className="btn btn-primary text-white px-5" onClick={closeModal}>確定</button>
                    </DialogContentWrapper>
                </Dialog>
            }

        </div>
    )
}

export default Home