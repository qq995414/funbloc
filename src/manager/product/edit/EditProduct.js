import React, { useCallback, useEffect, useMemo, useState } from 'react'
import BackBtn from "../../components/general/BackBtn"
import { EditForm, EditTitle, HistoryLabelRow, PillBadge, SubTitle } from "./EditProductStyle"
import { useNavigate, useParams } from "react-router-dom"
import {
    changeProductStats,
    editProduct,
    editProductPrice,
    fetchProduct,
    fetchProductHistory,
    fetchProductPrice,
    fetchProductTypes
} from "../../../api/Product"
import Dialog, { CancelledDialog, DoneDialog } from "../../../component/dialog/Dialog"
import { DialogButton, DialogContentWrapper, DialogTitle } from "../../../component/dialog/DialogStyle"
import SetPriceDialog from "../../components/setPrice/SetPriceDialog"
import { ContentWrapper, OperateButton } from "../../../component/StyledComponent"
import {
    DialogSetPriceDollarSymbol,
    DialogSetPriceLabel,
    DialogSetPriceNote
} from "../../components/setPrice/SetPriceDialogStyle"
import _ from "lodash"
import { chamberList, imageMimeType } from "../new/NewProduct"
import GroupPrice from "../price/GroupPrice"


const historyBadgeMap = {
    1: {
        bgColor: 'bg-secondary',
        text: '商品上架'
    },
    2: {
        bgColor: 'bg-info',
        text: '商品暫停'
    },
    3: {
        bgColor: 'bg-warning',
        text: '進價異動'
    },
    4: {
        bgColor: 'bg-danger',
        text: '售價異動'
    }
}

const ActiveProductDialog = ({ onChangeProductStats, isLoading, closeModal }) => {
    return <Dialog onClose={closeModal}>
        <DialogContentWrapper>
            <DialogTitle className="mb-5"> 確定要上架此商品嗎？</DialogTitle>
            <div>
                <DialogButton className="btn-secondary cancel" onClick={closeModal}>取消</DialogButton>
                <DialogButton className="btn-primary"
                              disabled={isLoading}
                              onClick={() => onChangeProductStats(1)}>確認</DialogButton>
            </div>
        </DialogContentWrapper>
    </Dialog>
}

const InactiveProductDialog = ({ onChangeProductStats, isLoading, closeModal }) => {
    return <Dialog onClose={closeModal}>
        <DialogContentWrapper>
            <DialogTitle className="mb-5"> 確定下架此商品嗎？</DialogTitle>
            <div>
                <DialogButton className="btn-secondary cancel" onClick={closeModal}>取消</DialogButton>
                <DialogButton className="btn-primary"
                              disabled={isLoading}
                              onClick={() => onChangeProductStats(0)}>確認</DialogButton>
            </div>
        </DialogContentWrapper>
    </Dialog>
}

export const initGroupPrice = () => ({
    hawkerGroupId: '-',
    price: 0,
    hawkerGroupName: ''
})


const EditProduct = () => {
    const { productId } = useParams()
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false)

    const [productDetail, setProductDetail] = useState({})
    const [name, setName] = useState('')
    const [model, setModel] = useState('')
    const [expire, setExpire] = useState('')
    const [origin, setOrigin] = useState('')
    const [typeId, setTypeId] = useState('-')
    const [subTypeId, setSubTypeId] = useState('-')
    const [chamber, setChamber] = useState('-')
    const [introduce, setIntroduce] = useState('')

    const [previewImg, setPreviewImg] = useState(null)
    const [previewImgUrl, setPreviewImgUrl] = useState(null)

    const [productTypes, setProductTypes] = useState([])

    const [shouldOpenModal, setShouldOpenModal] = useState(false)
    const [modal, setModal] = useState(null)

    const [productHistory, setProductHistory] = useState([])
    const [productPrice, setProductPrice] = useState({})


    const [quote, setQuote] = useState(productPrice.quote || '0')
    const [price, setPrice] = useState(productPrice.price || '0')
    const [pageShow, setShowPage] = useState(0)
    const [groupPriceList, setGroupPriceList] = useState([])
    const [inputFileKey, setInputFileKey] = useState(_.uniqueId())


    const getProductDetail = useCallback(() => {
        fetchProduct(productId)
            .then(res => {
                setProductDetail(res.data)
                setName(res.data.name)
                setModel(res.data.model)
                setExpire(res.data.expire)
                setOrigin(res.data.origin)
                setTypeId(res.data.type)
                setChamber(res.data.chamber)
                setIntroduce(res.data.introduce)
                setPreviewImgUrl(res.data.photo)
                setSubTypeId(res.data.subType || '-')
            })
            .catch(error => {
                console.error(error)
            })
    }, [])

    const getProductEditHistory = useCallback((productId) => {
        fetchProductHistory(productId)
            .then(_productHistory => {
                setProductHistory(_productHistory.data)
            })
            .catch(error => {
                console.error(error)
            })
    }, [])

    const onChangeProductStats = (stats) => {
        setIsLoading(true)
        changeProductStats([productId], stats)
            .then(() => {
                getProductDetail()

                if (stats === 1) {
                    setModal('confirmActive')
                } else {
                    setModal('confirmInactive')
                }
            })
            .catch(error => {
                console.error(error)
            })
            .finally(() => setIsLoading(false))
    }

    const closeModal = () => {
        setShouldOpenModal(false)
    }

    const edit = async () => {
        setIsLoading(true)

        const _groupPriceList = groupPriceList.filter(priceList => priceList.hawkerGroupId !== '-')
        try {
            await editProductPrice(productId, quote, price, pageShow, _groupPriceList)

            const data = new FormData()
            const img = document.querySelector('input[type="file"]').files[0] || ''

            data.append("_method", 'put')
            if (img) {
                data.append("photo", img)
            }
            data.append("supply", productDetail.supply)
            data.append("type", typeId)
            if (subTypeId !== '-') {
                data.append("subType", subTypeId)
            }
            data.append("name", name)
            data.append("model", model)
            data.append("expire", expire)
            data.append("chamber", chamber)
            data.append("origin", origin)
            data.append("introduce", introduce)

            await editProduct(productId, data)

            getProductDetail()
            getProductEditHistory(productId)
            setModal('edited')
            setShouldOpenModal(true)
            setIsLoading(false)
            setInputFileKey(_.uniqueId())

        } catch (error) {
            console.error(error)
            setIsLoading(false)
        }
    }

    const showSubTypes = useMemo(() => {
        if (typeId !== '-') {
            const filter = productTypes.filter(type => type.id === typeId * 1)
            return filter.length > 0 ? filter[0].sub : []
        }

        return []
    }, [typeId, productTypes])


    useEffect(() => {
        setIsLoading(true)
        Promise.all([
            getProductDetail(),
            getProductEditHistory(productId, productId),
            fetchProductTypes({}),
            fetchProductPrice(productId),
        ])
            .then(([
                       _,
                       _productHistory,
                       _productTypes,
                       _productPrice,
                   ]) => {
                setProductTypes(_productTypes.data)
                setProductPrice(_productPrice.data)
                setGroupPriceList(_productPrice.data.groups)
                setShowPage(_productPrice.data.pageShow)
                setPrice(_productPrice.data.price)
                setQuote(_productPrice.data.quote)

            })
            .catch(error => console.error(error))
            .finally(() => setIsLoading(false))
    }, [getProductDetail])

    useEffect(() => {
        let fileReader, isCancel = false
        if (previewImg) {
            fileReader = new FileReader()
            fileReader.onload = (e) => {
                const { result } = e.target
                if (result && !isCancel) {
                    setPreviewImgUrl(result)
                }
            }
            fileReader.readAsDataURL(previewImg)
        }

        return () => {
            isCancel = true
            if (fileReader && fileReader.readyState === 1) {
                fileReader.abort()
            }
        }

    }, [previewImg])

    console.log(subTypeId)

    return (
        <div className="container-fluid p-5">
            <div className="d-flex justify-content-between align-items-center">
                <BackBtn text={'回列表'} onClickCallback={() => navigate('/manager/product')} />
                <div>
                    {
                        productDetail.stats === 0 &&
                        <OperateButton className="btn-primary text-white"
                                       onClick={() => {
                                           setModal('activeProduct')
                                           setShouldOpenModal(true)
                                       }}>上架</OperateButton>
                    }

                    {
                        productDetail.stats === 1 &&
                        <OperateButton className="btn-secondary"
                                       onClick={() => {
                                           setModal('inactiveProduct')
                                           setShouldOpenModal(true)
                                       }}>下架</OperateButton>
                    }
                </div>
            </div>

            <EditTitle>編輯商品</EditTitle>
            <ContentWrapper>
                <EditForm>
                    <div className="row align-items-center mb-4">
                        <div className="col-1 label">廠商名稱</div>
                        <div className="col">
                            <div className="name">{productDetail.supply}</div>
                        </div>
                        <div className="col-1 label">類別</div>
                        <div className="col">
                            <select className="form-select border-primary text-secondary"
                                    value={typeId}
                                    onChange={(e) => setTypeId(e.target.value)}>
                                <option value="-" disabled={true}>請選擇</option>
                                {
                                    productTypes.map(type => <option key={type.id} value={type.id}>{type.name}</option>)
                                }
                            </select>
                        </div>
                    </div>
                    <div className="row align-items-center mb-4">
                        <div className="col-1 label">品名</div>
                        <div className="col">
                            <input type="text" className="form-control border-primary"
                                   value={name}
                                   onChange={e => setName(e.target.value)} />
                        </div>
                        <div className="col-1 label">次分類</div>
                        <div className="col">
                            <select
                                className="form-control border-primary"
                                value={subTypeId}
                                onChange={(e) => setSubTypeId(e.target.value)}>
                                <option value="-" disabled={true}>請選擇</option>
                                {
                                    showSubTypes.map(type => <option key={type.id} value={type.id}>{type.name}</option>)
                                }
                            </select>
                        </div>
                    </div>
                    <div className="row align-items-center mb-4">
                        <div className="col-1 label">型號口味</div>
                        <div className="col">
                            <input type="text" className="form-control border-primary"
                                   value={model}
                                   onChange={e => setModel(e.target.value)} />
                        </div>
                        <div className="col-1 label">溫層</div>
                        <div className="col">
                            <select className="form-select border-primary text-secondary" value={chamber}
                                    onChange={e => setChamber(e.target.value)}>
                                <option value="-" disabled={true}>請選擇</option>
                                {
                                    chamberList.map(chamer => <option key={chamer} value={chamer}>{chamer}</option>)
                                }
                            </select>
                        </div>
                    </div>
                    <div className="row align-items-center mb-5">
                        <div className="col-1 label">產地</div>
                        <div className="col">
                            <input type="text" className="form-control border-primary"
                                   value={origin}
                                   onChange={e => setOrigin(e.target.value)} />
                        </div>
                        <div className="col-1 label">保存期限</div>
                        <div className="col">
                            <input type="text" className="form-control border-primary"
                                   value={expire}
                                   onChange={e => setExpire(e.target.value)} />
                        </div>
                    </div>
                    <div className="row align-items-center mb-5">
                        <div className="col-1 label">圖片上傳</div>
                        <div className="col">
                            <input key={inputFileKey}
                                   type="file"
                                   className="form-control border-primary new-product-file"
                                   accept=".png, .jpg, .jpeg"
                                   defaultValue={''}
                                   onChange={e => {
                                       const file = e.target.files[0]
                                       if (!file.type.match(imageMimeType)) {
                                           alert("圖片格式錯誤")
                                           return
                                       }
                                       setPreviewImg(file)
                                   }} />
                            {
                                previewImgUrl &&
                                <div className="w-50">
                                    <img src={previewImgUrl} alt="" className="w-100 h-100" />
                                </div>
                            }
                        </div>
                    </div>
                    <div className="row mb-5">
                        <div className="col-1 label">商品介紹</div>
                        <div className="col d-flex">
                            <textarea className="form-control border-primary" rows={10} value={introduce}
                                      onChange={(e) => setIntroduce(e.target.value)} />
                        </div>
                    </div>

                    <EditTitle>價格設定</EditTitle>
                    <div className="row">
                        <div className="col d-flex">
                            <DialogSetPriceLabel>成本進價</DialogSetPriceLabel>
                            <div className="d-flex flex-wrap mx-2 w-75">
                                <input className="form-control border-primary mb-auto"
                                       type="number"
                                       value={quote}
                                       style={{ width: 'calc(100% - 20px)' }}
                                       onChange={(e) => setQuote(e.target.value)} />
                                <DialogSetPriceDollarSymbol className="mt-2">元</DialogSetPriceDollarSymbol>
                            </div>
                        </div>
                        <div className="col">
                            <div className="col d-flex">
                                <DialogSetPriceLabel>一般售價</DialogSetPriceLabel>
                                <div className="d-flex flex-wrap align-items-center mx-2 w-75">
                                    <input className="form-control border-primary"
                                           type="number"
                                           value={price}
                                           style={{ width: 'calc(100% - 20px)' }}
                                           onChange={(e) => setPrice(e.target.value)} />
                                    <DialogSetPriceDollarSymbol>元</DialogSetPriceDollarSymbol>
                                    <DialogSetPriceNote>
                                        <div>此資訊是否在小販頁面顯示:</div>
                                        <div className="form-check form-check-inline ms-2">
                                            <input className="form-check-input" type="radio" name="inlineRadioOptions"
                                                   id="inlineRadio1"
                                                   checked={pageShow === 1}
                                                   value={pageShow}
                                                   onChange={() => setShowPage(1)} />
                                            <label className="form-check-label" htmlFor="inlineRadio1">是</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="inlineRadioOptions"
                                                   id="inlineRadio2"
                                                   checked={pageShow === 0}
                                                   value={pageShow}
                                                   onChange={() => setShowPage(0)} />
                                            <label className="form-check-label" htmlFor="inlineRadio2">否</label>
                                        </div>
                                    </DialogSetPriceNote>
                                </div>
                            </div>
                        </div>
                    </div>
                    <EditTitle>群組價格設定</EditTitle>
                    <div className="row">
                        <GroupPrice groupPriceList={groupPriceList} setGroupPriceList={setGroupPriceList} />
                    </div>


                    <div className="text-center mt-5">
                        <button className="btn btn-primary text-white" disabled={isLoading} onClick={edit}>儲存</button>
                    </div>
                </EditForm>
            </ContentWrapper>

            <SubTitle>商品資訊歷史紀錄</SubTitle>
            <ContentWrapper>
                <div className="container-fluid px-5 py-3">

                    {
                        productHistory.map(history => {
                            const { bgColor, text } = historyBadgeMap[history.type]
                            return <HistoryLabelRow key={history.id} className="d-flex align-items-center">
                                <PillBadge className={`badge rounded-pill ${bgColor}`}>{text}</PillBadge>
                                <span>{history.created_at} {history.msg} - 由{history.created_name}執行</span>
                            </HistoryLabelRow>
                        })

                    }
                </div>
            </ContentWrapper>

            {
                modal === 'activeProduct' && shouldOpenModal &&
                <ActiveProductDialog onChangeProductStats={onChangeProductStats}
                                     isLoading={isLoading}
                                     closeModal={closeModal} />
            }
            {
                modal === 'inactiveProduct' && shouldOpenModal &&
                <InactiveProductDialog onChangeProductStats={onChangeProductStats}
                                       isLoading={isLoading}
                                       closeModal={closeModal} />
            }

            {
                modal === 'confirmInactive' && shouldOpenModal &&
                <CancelledDialog closeModal={closeModal} text={'商品已下架'} />
            }

            {
                modal === 'confirmActive' && shouldOpenModal && <DoneDialog closeModal={closeModal} text={'已重新上架'} />
            }

            {
                modal === 'setPrice' && shouldOpenModal &&
                <SetPriceDialog closeModal={closeModal} productId={productId} productPrice={[productPrice]} />
            }

            {
                modal === 'edited' && shouldOpenModal && <DoneDialog closeModal={closeModal} text={'已儲存'} />
            }

        </div>
    )
}

export default EditProduct