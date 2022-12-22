import React, { useEffect, useState } from 'react'
import {
    CheckButton,
    NavButton,
    NavRouteButton,
    PaginationWrapper,
    SearchIcon,
    SearchInput
} from "../../component/StyledComponent"
import { useNavigate } from "react-router-dom"
import Table from "../../component/table/Table"
import { Tr } from "../../component/table/TableStyle"
import Loading from "../components/loading/Loading"
import { fetchHawkers, resetHawkerPassword } from "../../api/hawker/ManagerHawker"
import Pagination from "../components/pagination/Pagination"
import Dialog from "../../component/dialog/Dialog"
import { DialogButton, DialogContentWrapper } from "../../component/dialog/DialogStyle"
import { CopyToClipboard } from "react-copy-to-clipboard/src"

const hawkerStatsMap = {
    0: {
        stats: 0,
        text: '黑名單',
        icon: <i className="bi bi-slash-circle" />,
        color: '#FE868E'
    },
    1: {
        stats: 1,
        text: '使用中',
        icon: <i className="bi bi-check-lg" />,
        color: '#26B7BC'
    },
    2: {
        stats: 1,
        text: '使用中',
        icon: <i className="bi bi-check-lg" />,
        color: '#26B7BC'
    }
}

const modalResetPassword = 'modal-reset-password'
const modalResetPasswordDone = 'modal-reset-password-done'


const Hawker = () => {
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false)
    const [modal, setModal] = useState(null)
    const [shouldShowModal, setShouldShowModal] = useState(false)

    const [hawkers, setHawkers] = useState([])

    const [inputKeyword, setInputKeyword] = useState('')
    const [keyword, setKeyword] = useState('')
    const [currentStats, setCurrentStats] = useState(null)
    const [pageObject, setPageObject] = useState({})
    const [currentPage, setCurrentPage] = useState(1)

    const [selectedHawker, setSelectedHawker] = useState({})
    const [newPassword, setNewPassword] = useState('')

    const ths = ['加入日期', '小販名稱', '帳號', '連絡電話', '狀態', '最近成團日期', '分類', '查看', '重設密碼']

    const onStatsButtonClick = (stats) => {
        setSelectedHawker({})
        setNewPassword('')
        setCurrentStats(stats)
        setCurrentPage(1)
    }

    const closeModal = () => {
        setModal(null)
        setShouldShowModal(false)
    }


    const resetPassword = () => {
        resetHawkerPassword(selectedHawker.id)
            .then(res => {
                setNewPassword(res.data.newPassword)
                setModal(modalResetPasswordDone)
            })
            .catch(error => {
                console.error(error)
            })
    }

    useEffect(() => {
        setIsLoading(true)
        setHawkers([])
        fetchHawkers({ page: currentPage, stats: currentStats, keyword: keyword })
            .then(res => {
                setHawkers(res.data)
                setPageObject(res.meta)
            })
            .catch(error => console.error(error))
            .finally(() => setIsLoading(false))
    }, [currentPage, currentStats, keyword])


    return (
        <div className="container-fluid p-5">
            <div className="d-flex justify-content-between">
                <nav className="nav">
                    <NavButton className={`nav-link ${currentStats === null ? 'active' : ''}`}
                               onClick={() => onStatsButtonClick(null)}>所有小販</NavButton>
                    <NavButton className={`nav-link ${currentStats === hawkerStatsMap["0"].stats ? 'active' : ''}`}
                               onClick={() => onStatsButtonClick(hawkerStatsMap["0"].stats)}>黑名單小販</NavButton>
                </nav>

                <div className="d-flex">
                    <NavRouteButton className="btn btn-primary rounded-pill d-flex text-white align-items-center me-3"
                                    onClick={() => navigate('/manager/hawker/new')}>
                        <svg width="15" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12.675 4.0625H11.375V2.8125C11.375 2.64062 11.2287 2.5 11.05 2.5H10.4C10.2212 2.5 10.075 2.64062 10.075 2.8125V4.0625H8.775C8.59625 4.0625 8.45 4.20312 8.45 4.375V5C8.45 5.17188 8.59625 5.3125 8.775 5.3125H10.075V6.5625C10.075 6.73438 10.2212 6.875 10.4 6.875H11.05C11.2287 6.875 11.375 6.73438 11.375 6.5625V5.3125H12.675C12.8537 5.3125 13 5.17188 13 5V4.375C13 4.20312 12.8537 4.0625 12.675 4.0625ZM4.55 5C5.98609 5 7.15 3.88086 7.15 2.5C7.15 1.11914 5.98609 0 4.55 0C3.11391 0 1.95 1.11914 1.95 2.5C1.95 3.88086 3.11391 5 4.55 5ZM6.37 5.625H6.03078C5.57984 5.82422 5.07812 5.9375 4.55 5.9375C4.02187 5.9375 3.52219 5.82422 3.06922 5.625H2.73C1.22281 5.625 0 6.80078 0 8.25V9.0625C0 9.58008 0.436719 10 0.975 10H8.125C8.66328 10 9.1 9.58008 9.1 9.0625V8.25C9.1 6.80078 7.87719 5.625 6.37 5.625Z"
                                fill="white" />
                        </svg>

                        <div className="ms-2">新增小販</div>
                    </NavRouteButton>
                    <NavRouteButton className="btn btn-primary rounded-pill d-flex text-white align-items-center"
                                    onClick={() => navigate('/manager/hawker/classify')}>
                        <svg width="15" height="15" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd"
                                  d="M0.25 2.75C0.25 2.25272 0.447544 1.77581 0.799175 1.42417C1.15081 1.07254 1.62772 0.875 2.125 0.875H10.875C11.3723 0.875 11.8492 1.07254 12.2008 1.42417C12.5525 1.77581 12.75 2.25272 12.75 2.75V10.25C12.75 10.7473 12.5525 11.2242 12.2008 11.5758C11.8492 11.9275 11.3723 12.125 10.875 12.125H2.125C1.62772 12.125 1.15081 11.9275 0.799175 11.5758C0.447544 11.2242 0.25 10.7473 0.25 10.25V2.75ZM3.375 3.375C3.20924 3.375 3.05027 3.44085 2.93306 3.55806C2.81585 3.67527 2.75 3.83424 2.75 4V6.5C2.75 6.66576 2.81585 6.82473 2.93306 6.94194C3.05027 7.05915 3.20924 7.125 3.375 7.125H5.875C6.04076 7.125 6.19973 7.05915 6.31694 6.94194C6.43415 6.82473 6.5 6.66576 6.5 6.5V4C6.5 3.83424 6.43415 3.67527 6.31694 3.55806C6.19973 3.44085 6.04076 3.375 5.875 3.375H3.375ZM4 5.875V4.625H5.25V5.875H4ZM8.375 3.375C8.20924 3.375 8.05027 3.44085 7.93306 3.55806C7.81585 3.67527 7.75 3.83424 7.75 4C7.75 4.16576 7.81585 4.32473 7.93306 4.44194C8.05027 4.55915 8.20924 4.625 8.375 4.625H9.625C9.79076 4.625 9.94973 4.55915 10.0669 4.44194C10.1842 4.32473 10.25 4.16576 10.25 4C10.25 3.83424 10.1842 3.67527 10.0669 3.55806C9.94973 3.44085 9.79076 3.375 9.625 3.375H8.375ZM8.375 5.875C8.20924 5.875 8.05027 5.94085 7.93306 6.05806C7.81585 6.17527 7.75 6.33424 7.75 6.5C7.75 6.66576 7.81585 6.82473 7.93306 6.94194C8.05027 7.05915 8.20924 7.125 8.375 7.125H9.625C9.79076 7.125 9.94973 7.05915 10.0669 6.94194C10.1842 6.82473 10.25 6.66576 10.25 6.5C10.25 6.33424 10.1842 6.17527 10.0669 6.05806C9.94973 5.94085 9.79076 5.875 9.625 5.875H8.375ZM3.375 8.375C3.20924 8.375 3.05027 8.44085 2.93306 8.55806C2.81585 8.67527 2.75 8.83424 2.75 9C2.75 9.16576 2.81585 9.32473 2.93306 9.44194C3.05027 9.55915 3.20924 9.625 3.375 9.625H9.625C9.79076 9.625 9.94973 9.55915 10.0669 9.44194C10.1842 9.32473 10.25 9.16576 10.25 9C10.25 8.83424 10.1842 8.67527 10.0669 8.55806C9.94973 8.44085 9.79076 8.375 9.625 8.375H3.375Z"
                                  fill="white" />
                        </svg>
                        <div className="ms-2">小販分類</div>
                    </NavRouteButton>
                </div>
            </div>
            <div className="row mt-5 mb-4">
                <div className="ms-auto col-2 position-relative">
                    <SearchInput type="text"
                                 value={inputKeyword}
                                 onChange={(e) => setInputKeyword(e.target.value)}
                                 placeholder="關鍵字搜尋..." />
                    <SearchIcon onClick={() => setKeyword(inputKeyword)}>
                        <i className="bi bi-search" />
                    </SearchIcon>
                </div>
            </div>
            <Table ths={ths}>
                {
                    hawkers.length > 0
                        ? hawkers.map(hawker => {
                            const { icon, text, color } = hawkerStatsMap[hawker.stats]

                            return <Tr key={hawker.id} color={color}>
                                <td>{hawker.join_at}</td>
                                <td>{hawker.name}</td>
                                <td>{hawker.account}</td>
                                <td>{hawker.phone}</td>
                                <td className="icon">{icon} {text}</td>
                                <td>{hawker.last_open}</td>
                                <td>{hawker.typeName}</td>
                                <td>
                                    <CheckButton className="btn btn-success rounded-pill border-0 px-4"
                                                 to={`/manager/hawker/edit/${hawker.id}`}>查看</CheckButton>
                                </td>
                                <td>
                                    <button className="btn btn-danger text-white rounded-pill border-0"
                                            style={{ fontSize: '12px', lineHeight: 1 }}
                                            onClick={() => {
                                                setSelectedHawker(hawker)
                                                setModal(modalResetPassword)
                                                setShouldShowModal(true)
                                            }}>重設密碼
                                    </button>
                                </td>
                            </Tr>
                        })
                        : <Tr>
                            <td colSpan={ths.length}>
                                {
                                    isLoading
                                        ? <Loading />
                                        : '無資料'
                                }
                            </td>
                        </Tr>
                }
            </Table>

            <PaginationWrapper>
                <Pagination pageObject={pageObject} currentPage={currentPage} setCurrentPage={setCurrentPage} />
            </PaginationWrapper>

            {
                modal === modalResetPassword && shouldShowModal && <Dialog onClose={closeModal}>
                    <DialogContentWrapper width={378} height={213}>
                        <div>
                            【{selectedHawker.name}】的密碼即將被重設
                        </div>
                        <div className="text-center mt-5">
                            <DialogButton className="btn-secondary cancel" onClick={closeModal}>取消</DialogButton>
                            <DialogButton className="btn-primary"
                                          disabled={isLoading}
                                          onClick={resetPassword}>確認</DialogButton>
                        </div>
                    </DialogContentWrapper>
                </Dialog>
            }

            {
                modal === modalResetPasswordDone && shouldShowModal && <Dialog onClose={closeModal}>
                    <DialogContentWrapper className="py-4" width={378} height={213}>
                        <div className="mb-4 fw-bolder">密碼已重設</div>
                        <div>
                            <input type="text" className="form-control border-primary text-primary"
                                   defaultValue={newPassword}
                                   readOnly={true} />
                        </div>
                        <div className="text-center mt-4">
                            <CopyToClipboard text={newPassword} onCopy={closeModal}>
                                <DialogButton className="btn-primary"
                                              disabled={isLoading}>複製</DialogButton>
                            </CopyToClipboard>
                        </div>
                    </DialogContentWrapper>
                </Dialog>
            }
        </div>
    )
}

export default Hawker