import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { FormCheckbox, ProductTypeSelect, SelectLabel, SelectWrapper } from "./ProductStyle"
import Table from "../../component/table/Table"
import { changeProductStats, fetchProducts, fetchProductType, fetchProductTypes } from "../../api/Product"
import Pagination from "../components/pagination/Pagination"
import Loading from "../components/loading/Loading"
import Dialog from "../../component/dialog/Dialog"
import { DialogButton, DialogContentWrapper, DialogTitle } from "../../component/dialog/DialogStyle"
import { fetchCompanies } from "../../api/Company"
import {
    ChangeStatsButton,
    CheckButton,
    NavButton,
    NavRouteButton,
    PaginationWrapper,
    SearchIcon,
    SearchInput
} from "../../component/StyledComponent"
import { Tr } from "../../component/table/TableStyle"
import { numberWithThousandCommas } from "../../helper/Helper"
import { fetchHawkerTypes } from "../../api/hawker/ManagerHawker"


const productStatsMap = {
    1: {
        stats: 1,
        text: '正常販售',
        icon: <i className="bi bi-check-lg" />,
        color: '#26B7BC',
    },
    0: {
        stats: 0,
        text: '暫停販售',
        icon: <i className="bi bi-slash-circle" />,
        color: '#FE868E'
    }
}

const Product = () => {
    const navigate = useNavigate()
    const [productTypes, setProductTypes] = useState([])
    const [productSubTypes, setProductSubTypes] = useState([])
    const [products, setProducts] = useState([])
    const [pageObject, setPageObject] = useState({})

    const [isLoading, setIsLoading] = useState(false)

    const [shouldOpenModal, setShouldOpenModal] = useState(false)

    const [currentStats, setCurrentStats] = useState(null)
    const [currentType, setCurrentType] = useState(undefined)
    const [currentSubType, setCurrentSubType] = useState(undefined)
    const [currentPage, setCurrentPage] = useState(1)
    const [inputKeyword, setInputKeyword] = useState('')
    const [keyword, setKeyword] = useState('')
    const [selectedProductIds, setSelectedProductIds] = useState([])
    const [companies, setCompanies] = useState([])
    const [selectedCompany, setSelectedCompany] = useState('-')

    const [hawkerNames, setHawkerNames] = useState([])

    const ths = useMemo(() => {
        return ['', '商品編號', '廠商名稱', '品名', '型號/口味', '狀態', '一般市售', '進價', ...hawkerNames, '溫層', '保固期限', '交期', '產地', '上架日期', '資訊']
    }, [hawkerNames])

    const showProducts = useMemo(() => {
        if (currentSubType) {
            if (currentSubType === 'all') {
                return products
            }
            return products.filter(product => product.subType === currentSubType)
        }
        return products
    }, [products, currentSubType])


    const getProducts = useCallback((currentPage, currentStats, currentType, keyword) => {
        setIsLoading(true)
        setProducts([])
        setProductSubTypes([])

        fetchProducts({
            page: currentPage,
            stats: currentStats,
            type: currentType === 'all' ? undefined : currentType,
            keyword: keyword === '' ? undefined : keyword
        })
            .then(res => {
                setProducts(res.data.map(data => ({ ...data, checked: false })))
                setPageObject(res.meta)
            })
            .catch(error => console.error(error))
            .finally(() => setIsLoading(false))

    }, [setProducts, setIsLoading, setPageObject])


    const closeModal = () => {
        setSelectedCompany('-')
        setShouldOpenModal(false)
    }

    const createNewProduct = () => {
        setShouldOpenModal(false)
        navigate('/manager/product/new', { state: selectedCompany })
    }

    const onStatsButtonClick = (stats) => {
        setCurrentStats(stats)
        setCurrentPage(1)
        setSelectedProductIds([])
    }

    const onCheckboxClick = (id, checked) => {
        setProducts(prevProducts => prevProducts.map(product => ({
            ...product,
            checked: product.id === id ? checked : product.checked
        })))

        if (checked) {
            setSelectedProductIds(prev => ([...prev, id]))
        } else {
            setSelectedProductIds(prev => prev.filter(productId => productId !== id))
        }
    }

    const onChangeProductStats = (stats) => {
        changeProductStats(selectedProductIds, stats)
            .then(() => {
                setSelectedProductIds([])
                getProducts(1, currentStats, currentType, keyword)
            })
            .catch(error => console.error(error))
    }

    useEffect(() => {
        getProducts(currentPage, currentStats, currentType, keyword)
    }, [getProducts, currentPage, currentStats, currentType, keyword])

    useEffect(() => {
        fetchProductTypes({})
            .then(res => setProductTypes(res.data))
            .catch(error => console.error(error))

        fetchCompanies({
            perPage: 1000,
            stats: 1
        })
            .then(res => setCompanies(res.data))
            .catch(error => console.error(error))

    }, [setProductTypes])

    useEffect(() => {
        if (currentType && currentType !== 'all') {
            fetchProductType(currentType)
                .then(res => {
                    setProductSubTypes(res.data.sub)
                    setCurrentSubType('all')
                })
                .catch(error => {
                    console.error(error)
                })
        }
    }, [currentType])

    useEffect(() => {
        fetchHawkerTypes({ page: 1, perPage: 100 })
            .then(res => {
                setHawkerNames(res.data.map(hawker => hawker.name))
            })
            .catch(error => {
                console.error(error)
            })
    }, [])


    return (
        <div className="container-fluid p-5">
            <div className="d-flex justify-content-between">
                <nav className="nav">
                    <NavButton className={`nav-link ${currentStats === null ? 'active' : ''}`}
                               onClick={() => onStatsButtonClick(null)}>所有商品</NavButton>
                    <NavButton
                        className={`nav-link ${currentStats === productStatsMap["1"].stats ? 'active' : ''}`}
                        onClick={() => onStatsButtonClick(productStatsMap["1"].stats)}>{productStatsMap["1"].text}</NavButton>
                    <NavButton
                        className={`nav-link ${currentStats === productStatsMap["0"].stats ? 'active' : ''}`}
                        onClick={() => onStatsButtonClick(productStatsMap["0"].stats)}>{productStatsMap["0"].text}</NavButton>
                </nav>

                <div className="d-flex">
                    <NavRouteButton
                        className="btn btn-primary rounded-pill d-flex ms-auto text-white align-items-center me-3"
                        onClick={() => navigate('/manager/product/classify')}>
                        <svg width="15" viewBox="0 0 15 15" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M13.5938 0.9375H1.40625C0.62959 0.9375 0 1.56709 0 2.34375V12.6562C0 13.4329 0.62959 14.0625 1.40625 14.0625H13.5938C14.3704 14.0625 15 13.4329 15 12.6562V2.34375C15 1.56709 14.3704 0.9375 13.5938 0.9375ZM13.418 12.6562H1.58203C1.53541 12.6562 1.4907 12.6377 1.45774 12.6048C1.42477 12.5718 1.40625 12.5271 1.40625 12.4805V2.51953C1.40625 2.47291 1.42477 2.4282 1.45774 2.39524C1.4907 2.36227 1.53541 2.34375 1.58203 2.34375H13.418C13.4646 2.34375 13.5093 2.36227 13.5423 2.39524C13.5752 2.4282 13.5938 2.47291 13.5938 2.51953V12.4805C13.5938 12.5271 13.5752 12.5718 13.5423 12.6048C13.5093 12.6377 13.4646 12.6562 13.418 12.6562ZM12.1875 9.96094V10.6641C12.1875 10.8582 12.0301 11.0156 11.8359 11.0156H5.97656C5.78241 11.0156 5.625 10.8582 5.625 10.6641V9.96094C5.625 9.76679 5.78241 9.60938 5.97656 9.60938H11.8359C12.0301 9.60938 12.1875 9.76679 12.1875 9.96094ZM12.1875 7.14844V7.85156C12.1875 8.04571 12.0301 8.20312 11.8359 8.20312H5.97656C5.78241 8.20312 5.625 8.04571 5.625 7.85156V7.14844C5.625 6.95429 5.78241 6.79688 5.97656 6.79688H11.8359C12.0301 6.79688 12.1875 6.95429 12.1875 7.14844ZM12.1875 4.33594V5.03906C12.1875 5.23321 12.0301 5.39062 11.8359 5.39062H5.97656C5.78241 5.39062 5.625 5.23321 5.625 5.03906V4.33594C5.625 4.14179 5.78241 3.98438 5.97656 3.98438H11.8359C12.0301 3.98438 12.1875 4.14179 12.1875 4.33594ZM4.80469 4.6875C4.80469 5.26998 4.33248 5.74219 3.75 5.74219C3.16752 5.74219 2.69531 5.26998 2.69531 4.6875C2.69531 4.10502 3.16752 3.63281 3.75 3.63281C4.33248 3.63281 4.80469 4.10502 4.80469 4.6875ZM4.80469 7.5C4.80469 8.08248 4.33248 8.55469 3.75 8.55469C3.16752 8.55469 2.69531 8.08248 2.69531 7.5C2.69531 6.91752 3.16752 6.44531 3.75 6.44531C4.33248 6.44531 4.80469 6.91752 4.80469 7.5ZM4.80469 10.3125C4.80469 10.895 4.33248 11.3672 3.75 11.3672C3.16752 11.3672 2.69531 10.895 2.69531 10.3125C2.69531 9.73002 3.16752 9.25781 3.75 9.25781C4.33248 9.25781 4.80469 9.73002 4.80469 10.3125Z"
                                fill="white" />
                        </svg>
                        <div className="ms-2">商品分類</div>
                    </NavRouteButton>
                    <NavRouteButton className="btn btn-primary rounded-pill d-flex text-white align-items-center"
                                    onClick={() => setShouldOpenModal(true)}>
                        <svg width="15" viewBox="0 0 16 16" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M10.875 7.5H8.5V5.125C8.5 5.05625 8.44375 5 8.375 5H7.625C7.55625 5 7.5 5.05625 7.5 5.125V7.5H5.125C5.05625 7.5 5 7.55625 5 7.625V8.375C5 8.44375 5.05625 8.5 5.125 8.5H7.5V10.875C7.5 10.9437 7.55625 11 7.625 11H8.375C8.44375 11 8.5 10.9437 8.5 10.875V8.5H10.875C10.9437 8.5 11 8.44375 11 8.375V7.625C11 7.55625 10.9437 7.5 10.875 7.5Z"
                                fill="white" />
                            <path
                                d="M8 1C4.13438 1 1 4.13438 1 8C1 11.8656 4.13438 15 8 15C11.8656 15 15 11.8656 15 8C15 4.13438 11.8656 1 8 1ZM8 13.8125C4.79063 13.8125 2.1875 11.2094 2.1875 8C2.1875 4.79063 4.79063 2.1875 8 2.1875C11.2094 2.1875 13.8125 4.79063 13.8125 8C13.8125 11.2094 11.2094 13.8125 8 13.8125Z"
                                fill="white" />
                        </svg>
                        <div className="ms-2">新增商品</div>
                    </NavRouteButton>
                </div>
            </div>

            <div className="row mt-5 mb-4">
                <div className="col ps-4">
                    {
                        selectedProductIds.length === 0
                            ? <div className="d-flex w-100">
                                <SelectWrapper>
                                    <SelectLabel className="">請選擇商品類別</SelectLabel>
                                    <ProductTypeSelect className="form-select border-primary"
                                                       value={currentType}
                                                       onChange={(e) => {
                                                           setCurrentType(e.target.value)
                                                           setCurrentSubType(undefined)
                                                       }}>
                                        <option value="all">All</option>
                                        {
                                            productTypes.map(type => <option key={type.id}
                                                                             value={type.id}>{type.name}</option>)
                                        }
                                    </ProductTypeSelect>
                                </SelectWrapper>
                                <SelectWrapper>
                                    <SelectLabel className="">請選擇次分類</SelectLabel>
                                    <ProductTypeSelect className="form-select border-primary"
                                                       value={currentSubType}
                                                       onChange={(e) => setCurrentSubType(e.target.value)}>
                                        {
                                            productSubTypes.length > 0
                                                ? <>
                                                    <option value="all">All</option>
                                                    {
                                                        productSubTypes.map(subType => <option key={subType.id}
                                                                                               value={subType.id}>{subType.name}</option>)
                                                    }
                                                </>
                                                : <option disabled>無資料</option>
                                        }
                                    </ProductTypeSelect>
                                </SelectWrapper>
                            </div>
                            : <div>
                                <ChangeStatsButton onClick={() => onChangeProductStats(1)}>正常販售</ChangeStatsButton>
                                <ChangeStatsButton onClick={() => onChangeProductStats(0)}>暫停販售</ChangeStatsButton>
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

            <Table ths={ths} wrapperStyle={{ overflow: 'auto' }}>
                {
                    showProducts.length > 0
                        ? showProducts.map(product => {
                            const { icon, text, color } = productStatsMap[product.stats]
                            const normalHawkerPrice = product.groups.find(group => group.hawkerGroupName === hawkerNames[0])?.price || 0
                            const srHawkerPrice = product.groups.find(group => group.hawkerGroupName === hawkerNames[1])?.price || 0
                            const shopHawkerPrice = product.groups.find(group => group.hawkerGroupName === hawkerNames[2])?.price || 0
                            const vipHawkerPrice = product.groups.find(group => group.hawkerGroupName === hawkerNames[3])?.price || 0

                            return <Tr key={product.id} color={color}>
                                <td>
                                    <FormCheckbox type="checkbox"
                                                  checked={product.checked}
                                                  onChange={(e) => onCheckboxClick(product.id, e.target.checked)} />
                                </td>
                                <td>{product.num}</td>
                                <td>{product.supply}</td>
                                <td>{product.name}</td>
                                <td>{product.model}</td>
                                <td className="icon">{icon} {text}</td>
                                <td>{product.price}</td>
                                <td>{product.quote}</td>
                                <td>{numberWithThousandCommas(normalHawkerPrice)}</td>
                                <td>{numberWithThousandCommas(srHawkerPrice)}</td>
                                <td>{numberWithThousandCommas(shopHawkerPrice)}</td>
                                <td>{numberWithThousandCommas(vipHawkerPrice)}</td>
                                <td>{product.chamber}</td>
                                <td>{product.expire}</td>
                                <td>{product.delivery}</td>
                                <td>{product.origin}</td>
                                <td>{product.created_at}</td>
                                <td>
                                    <CheckButton className="btn btn-success rounded-pill border-0 px-4"
                                                 to={`/manager/product/edit/${product.id}`}>查看</CheckButton>
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
                shouldOpenModal && <Dialog onClose={closeModal}>
                    <DialogContentWrapper className="px-5 py-4 justify-content-between">
                        <DialogTitle className="text-primary">新增商品</DialogTitle>
                        <div className="w-75 mb-5">
                            <select className="form-select border-primary"
                                    value={selectedCompany}
                                    onChange={(e) => setSelectedCompany(e.target.value)}>
                                <option value="-" disabled>請選擇廠商</option>
                                {
                                    companies.map(company => {
                                        return <option key={company.id} value={company.id}>{company.name}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className="mb-3">
                            <DialogButton className="btn-secondary cancel" onClick={closeModal}>取消</DialogButton>
                            <DialogButton className="btn-primary" disabled={selectedCompany === '-'}
                                          onClick={createNewProduct}>確認</DialogButton>
                        </div>

                    </DialogContentWrapper>
                </Dialog>
            }


        </div>
    )
}

export default Product