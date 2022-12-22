import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useOutletContext } from "react-router-dom"
import _ from 'lodash'
import {
    ChangeStatsButton,
    CheckButton,
    NavButton,
    NavRouteButton,
    PaginationWrapper,
    SearchIcon,
    SearchInput
} from "../../component/StyledComponent"
import Table from "../../component/table/Table"
import Loading from "../components/loading/Loading"
import Pagination from "../components/pagination/Pagination"
import { Tr } from "../../component/table/TableStyle"
import { changeCompanyStats, fetchCompanies, fetchCompanyTypes } from "../../api/Company"
import { FormCheckbox } from "../product/ProductStyle"


const companyStatsMap = {
    0: {
        stats: 0,
        text: '取消合作',
        icon: <i className="bi bi-slash-circle" />,
        color: '#FE868E'
    },
    1: {
        stats: 1,
        text: '合作中',
        icon: <i className="bi bi-check-lg" />,
        color: '#26B7BC'
    }
}

const Company = ({ bankCodes }) => {
    const navigate = useNavigate()
    const bankObject = useOutletContext()
    const [isLoading, setIsLoading] = useState(false)

    const [inputKeyword, setInputKeyword] = useState('')
    const [keyword, setKeyword] = useState('')
    const [companies, setCompanies] = useState([])
    const [selectedCompanyIds, setSelectedCompanyIds] = useState([])

    const [pageObject, setPageObject] = useState({})

    const [currentStats, setCurrentStats] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [allCompaniesSelected, setAllCompaniesSelected] = useState(false)

    const [companyIdToTypeName, setCompanyIdToTypeName] = useState([])


    const getCompanies = useCallback((currentPage, currentStats, keyword) => {
        setIsLoading(true)
        setCompanies([])

        fetchCompanies({
            page: currentPage,
            stats: currentStats,
            keyword: keyword === '' ? null : keyword
        })
            .then(res => {
                setCompanies(res.data.map(data => ({ ...data, checked: false })))
                setPageObject(res.meta)
            })
            .catch(error => console.error(error))
            .finally(() => setIsLoading(false))

    }, [setCompanies, setPageObject, setIsLoading])

    const onStatsButtonClick = (stats) => {
        setCurrentStats(stats)
        setCurrentPage(1)
        setSelectedCompanyIds([])
    }

    const onCheckboxClick = (id, checked) => {
        setCompanies(prevCompanies => prevCompanies.map(company => ({
            ...company,
            checked: company.id === id ? checked : company.checked
        })))
    }

    const handleCompanyStats = (stats) => {
        changeCompanyStats(stats, selectedCompanyIds)
            .then(() => {
                getCompanies(1, currentStats, keyword)
                setSelectedCompanyIds([])
            })
            .catch(error => console.error(error))
            .finally(() => {

            })
    }

    const ths = useMemo(() => [
            <FormCheckbox type="checkbox"
                          checked={allCompaniesSelected}
                          onChange={(e) => {
                              setCompanies(prevCompanies => prevCompanies.map(company => ({
                                  ...company,
                                  checked: e.target.checked
                              })))
                          }} />,
            '廠商編號',
            '廠商名稱',
            '分類',
            '狀態 ',
            '窗口',
            '連絡電話',
            '地址',
            '銀行帳戶資訊',
            '查看'
        ],
        [allCompaniesSelected, setCompanies])

    useEffect(() => {
        const _selectedCompanyIds = companies.filter(company => company.checked === true).map(company => company.id)

        setSelectedCompanyIds(_selectedCompanyIds)
        setAllCompaniesSelected(_selectedCompanyIds.length === companies.length && companies.length > 0)
    }, [companies])

    useEffect(() => {
        getCompanies(currentPage, currentStats, keyword)
    }, [getCompanies, currentPage, currentStats, keyword])

    useEffect(() => {
        fetchCompanyTypes()
            .then(res => {
                setCompanyIdToTypeName(res.data.reduce((prev, current) => ({
                    ...prev,
                    [current.id]: current.name
                }), {}))
            })
            .catch(error => {
                console.error(error)
            })
    }, [])

    if (_.isEmpty(bankObject)) return null

    return (
        <div className="container-fluid p-5">
            <div className="d-flex justify-content-between">
                <nav className="nav">
                    <NavButton className={`nav-link ${currentStats === null ? 'active' : ''}`}
                               onClick={() => onStatsButtonClick(null)}>所有廠商</NavButton>
                    <NavButton className={`nav-link ${currentStats === companyStatsMap["1"].stats ? 'active' : ''}`}
                               onClick={() => onStatsButtonClick(companyStatsMap["1"].stats)}>{companyStatsMap["1"].text}</NavButton>
                    <NavButton className={`nav-link ${currentStats === companyStatsMap["0"].stats ? 'active' : ''}`}
                               onClick={() => onStatsButtonClick(companyStatsMap["0"].stats)}>已無合作廠商</NavButton>
                </nav>

                <div className="d-flex">
                    <NavRouteButton
                        className="btn btn-primary rounded-pill d-flex ms-auto text-white align-items-center me-3"
                        onClick={() => navigate('/manager/company/classify')}>
                        <svg width="15" viewBox="0 0 15 15" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M13.5938 0.9375H1.40625C0.62959 0.9375 0 1.56709 0 2.34375V12.6562C0 13.4329 0.62959 14.0625 1.40625 14.0625H13.5938C14.3704 14.0625 15 13.4329 15 12.6562V2.34375C15 1.56709 14.3704 0.9375 13.5938 0.9375ZM13.418 12.6562H1.58203C1.53541 12.6562 1.4907 12.6377 1.45774 12.6048C1.42477 12.5718 1.40625 12.5271 1.40625 12.4805V2.51953C1.40625 2.47291 1.42477 2.4282 1.45774 2.39524C1.4907 2.36227 1.53541 2.34375 1.58203 2.34375H13.418C13.4646 2.34375 13.5093 2.36227 13.5423 2.39524C13.5752 2.4282 13.5938 2.47291 13.5938 2.51953V12.4805C13.5938 12.5271 13.5752 12.5718 13.5423 12.6048C13.5093 12.6377 13.4646 12.6562 13.418 12.6562ZM12.1875 9.96094V10.6641C12.1875 10.8582 12.0301 11.0156 11.8359 11.0156H5.97656C5.78241 11.0156 5.625 10.8582 5.625 10.6641V9.96094C5.625 9.76679 5.78241 9.60938 5.97656 9.60938H11.8359C12.0301 9.60938 12.1875 9.76679 12.1875 9.96094ZM12.1875 7.14844V7.85156C12.1875 8.04571 12.0301 8.20312 11.8359 8.20312H5.97656C5.78241 8.20312 5.625 8.04571 5.625 7.85156V7.14844C5.625 6.95429 5.78241 6.79688 5.97656 6.79688H11.8359C12.0301 6.79688 12.1875 6.95429 12.1875 7.14844ZM12.1875 4.33594V5.03906C12.1875 5.23321 12.0301 5.39062 11.8359 5.39062H5.97656C5.78241 5.39062 5.625 5.23321 5.625 5.03906V4.33594C5.625 4.14179 5.78241 3.98438 5.97656 3.98438H11.8359C12.0301 3.98438 12.1875 4.14179 12.1875 4.33594ZM4.80469 4.6875C4.80469 5.26998 4.33248 5.74219 3.75 5.74219C3.16752 5.74219 2.69531 5.26998 2.69531 4.6875C2.69531 4.10502 3.16752 3.63281 3.75 3.63281C4.33248 3.63281 4.80469 4.10502 4.80469 4.6875ZM4.80469 7.5C4.80469 8.08248 4.33248 8.55469 3.75 8.55469C3.16752 8.55469 2.69531 8.08248 2.69531 7.5C2.69531 6.91752 3.16752 6.44531 3.75 6.44531C4.33248 6.44531 4.80469 6.91752 4.80469 7.5ZM4.80469 10.3125C4.80469 10.895 4.33248 11.3672 3.75 11.3672C3.16752 11.3672 2.69531 10.895 2.69531 10.3125C2.69531 9.73002 3.16752 9.25781 3.75 9.25781C4.33248 9.25781 4.80469 9.73002 4.80469 10.3125Z"
                                fill="white" />
                        </svg>
                        <div className="ms-2">廠商分類</div>
                    </NavRouteButton>
                    <NavRouteButton className="btn btn-primary rounded-pill d-flex text-white align-items-center"
                                    onClick={() => navigate('/manager/company/new')}>
                        <svg width="15" viewBox="0 0 16 16" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M10.875 7.5H8.5V5.125C8.5 5.05625 8.44375 5 8.375 5H7.625C7.55625 5 7.5 5.05625 7.5 5.125V7.5H5.125C5.05625 7.5 5 7.55625 5 7.625V8.375C5 8.44375 5.05625 8.5 5.125 8.5H7.5V10.875C7.5 10.9437 7.55625 11 7.625 11H8.375C8.44375 11 8.5 10.9437 8.5 10.875V8.5H10.875C10.9437 8.5 11 8.44375 11 8.375V7.625C11 7.55625 10.9437 7.5 10.875 7.5Z"
                                fill="white" />
                            <path
                                d="M8 1C4.13438 1 1 4.13438 1 8C1 11.8656 4.13438 15 8 15C11.8656 15 15 11.8656 15 8C15 4.13438 11.8656 1 8 1ZM8 13.8125C4.79063 13.8125 2.1875 11.2094 2.1875 8C2.1875 4.79063 4.79063 2.1875 8 2.1875C11.2094 2.1875 13.8125 4.79063 13.8125 8C13.8125 11.2094 11.2094 13.8125 8 13.8125Z"
                                fill="white" />
                        </svg>
                        <div className="ms-2">新增廠商</div>
                    </NavRouteButton>
                </div>
            </div>

            <div className="row mt-5 mb-4">

                <div className="col-3 ps-4">
                    {
                        selectedCompanyIds.length > 0 && <div>
                            <ChangeStatsButton onClick={() => handleCompanyStats(1)}>合作中</ChangeStatsButton>
                            <ChangeStatsButton onClick={() => handleCompanyStats(0)}>取消合作</ChangeStatsButton>
                        </div>
                    }
                </div>
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
                    companies.length > 0
                        ? companies.map(company => {
                            const { icon, text, color } = companyStatsMap[company.stats]

                            return <Tr key={company.id} color={color}>
                                <td>
                                    <FormCheckbox
                                        type="checkbox"
                                        checked={company.checked}
                                        onChange={(e) => onCheckboxClick(company.id, e.target.checked)} />
                                </td>
                                <td>{company.num}</td>
                                <td>{company.name}</td>
                                <td>{companyIdToTypeName[company.type]}</td>
                                <td className="icon">{icon} {text}</td>
                                <td>{company.window}</td>
                                <td>{company.phone}</td>
                                <td>{company.address}</td>
                                <td>
                                    <div>
                                        {company.bank_code}{bankObject.map[company.bank_code]}
                                    </div>
                                    <div>
                                        {company.bank_account}
                                    </div>
                                </td>
                                <td>
                                    <CheckButton className="btn btn-success rounded-pill border-0 px-4"
                                                 to={`/manager/company/edit/${company.id}`}>查看</CheckButton>
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


        </div>
    )
}

export default Company