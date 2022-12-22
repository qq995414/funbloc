import React, { useEffect, useMemo, useState } from 'react'
import _ from 'lodash'
import BackBtn from "../../components/general/BackBtn"
import { useLocation, useNavigate } from "react-router-dom"
import { EditForm, EditTitle } from "../edit/EditProductStyle"

import { createProduct, editProductPrice, fetchProductTypes } from "../../../api/Product"
import { fetchCompany } from "../../../api/Company"
import { NewProductButton } from "./NewProductStyle"
import Dialog from "../../../component/dialog/Dialog"
import {
    DialogButton,
    DialogConfirmContentWrapper,
    DialogContentWrapper,
    DialogTitle
} from "../../../component/dialog/DialogStyle"
import { ContentWrapper } from "../../../component/StyledComponent"
import {
    DialogSetPriceDollarSymbol,
    DialogSetPriceLabel,
    DialogSetPriceNote
} from "../../components/setPrice/SetPriceDialogStyle"
import { fetchHawkerTypes } from "../../../api/hawker/ManagerHawker"
import GroupPrice from "../price/GroupPrice"


const doneIcon = '/images/manager/done.png'

const CreateProductDialog = ({ closeModal, create }) => <Dialog onClose={closeModal}>
    <DialogContentWrapper className="px-5 py-4" width={488} height={248}>
        <DialogTitle className="mb-5">是否新增此商品</DialogTitle>
        <div>
            <DialogButton className="btn-secondary cancel" onClick={closeModal}>取消</DialogButton>
            <DialogButton className="btn-primary"
                          onClick={create}>確認</DialogButton>
        </div>
    </DialogContentWrapper>
</Dialog>


const ConfirmActiveDialog = ({ closeModal }) => <Dialog onClose={closeModal}>
    <DialogConfirmContentWrapper>
        <div>
            <img src={doneIcon} className="w-100 h-100" alt="" />
        </div>
        <DialogTitle>已完成新增</DialogTitle>
    </DialogConfirmContentWrapper>
</Dialog>


export const imageMimeType = /image\/(png|jpg|jpeg)/i

const initErrorMessage = () => ({
    type: '',
    name: '',
    model: '',
    expire: '',
    chamber: '',
    origin: '',
    introduce: '',
    quote: '',
    price: '',
    delivery: '',
    groupPriceList: ''
})

export const chamberList = ["常溫", "冷藏", "冷凍", "冷凍及冷藏"]


const NewProduct = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { state: companyId } = location

    const [isLoading, setIsLoading] = useState(false)

    const [shouldOpenModal, setShouldOpenModal] = useState(false)
    const [modal, setModal] = useState(null)

    const [productTypes, setProductTypes] = useState([])

    const [supply, setSupply] = useState({})
    const [name, setName] = useState('')
    const [model, setModel] = useState('')
    const [expire, setExpire] = useState('')
    const [origin, setOrigin] = useState('')
    const [typeId, setTypeId] = useState('-')
    const [subTypeId, setSubTypeId] = useState('-')
    const [chamber, setChamber] = useState('-')
    const [introduce, setIntroduce] = useState('')
    const [delivery, setDelivery] = useState('')
    const [inputFileKey, setInputFileKey] = useState(_.uniqueId())

    const [previewImg, setPreviewImg] = useState(null)
    const [previewImgUrl, setPreviewImgUrl] = useState(null)

    const [quote, setQuote] = useState(0)
    const [price, setPrice] = useState(0)
    const [pageShow, setShowPage] = useState(1)
    const [groupPriceList, setGroupPriceList] = useState([])

    const [errorMessages, setErrorMessages] = useState(initErrorMessage())

    const closeModal = () => setShouldOpenModal(false)

    const reset = () => {
        setName('')
        setModel('')
        setExpire('')
        setOrigin('')
        setTypeId('-')
        setChamber('-')
        setIntroduce('')
        setInputFileKey(_.uniqueId())

    }

    const canCreateProduct = () => {
        let flag = true
        const _errorMessage = initErrorMessage()
        const text = '此欄位必填'

        if (!supply.name) return false

        if (typeId === '-') {
            _errorMessage.type = text
            flag = false
        }
        if (!name) {
            _errorMessage.name = text
            flag = false
        }
        if (!model) {
            _errorMessage.model = text
            flag = false
        }
        if (!expire) {
            _errorMessage.expire = text
            flag = false
        }
        if (chamber === '-') {
            _errorMessage.chamber = text
            flag = false
        }
        if (!origin) {
            _errorMessage.origin = text
            flag = false
        }
        if (!delivery) {
            _errorMessage.delivery = text
            flag = false
        }
        if (quote === 0) {
            _errorMessage.quote = text
            flag = false
        }
        if (price === 0) {
            _errorMessage.price = text
            flag = false
        }
        if (groupPriceList.filter(groupPrice => groupPrice.price <= 0).length > 0) {
            _errorMessage.groupPriceList = text
            flag = false
        }

        if (isLoading) {
            flag = false
        }

        setErrorMessages(_errorMessage)

        return flag
    }

    const create = async () => {
        setIsLoading(true)

        const data = new FormData()
        const img = document.querySelector('input[type="file"]').files[0] || ''

        data.append("photo", img)
        data.append("supply", supply.name)
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
        data.append("delivery", delivery)

        try {
            const { data: { id } } = await createProduct(data)

            await editProductPrice(id, quote, price, pageShow, groupPriceList)

            setModal('done')
            reset()
            setIsLoading(false)

        } catch (error) {

            console.error(error)
        }
    }

    const showSubTypes = useMemo(() => {
        if (typeId !== '-') {
            return productTypes.filter(type => type.id === typeId * 1)[0].sub
        }

        return []
    }, [typeId, productTypes])

    useEffect(() => {
        Promise.all([
            fetchCompany(companyId),
            fetchProductTypes({}),
            fetchHawkerTypes({ page: 1, perPage: 1000 })
        ])
            .then(([_supply, _productTypes, _hawkerTypes]) => {
                setSupply(_supply.data)
                setProductTypes(_productTypes.data)
                setGroupPriceList(() => {
                    return _hawkerTypes.data.map((hawkerType, idx) => ({
                        hawkerGroupId: hawkerType.id,
                        price: 0,
                        hawkerGroupName: hawkerType.name
                    }))
                })
            })
            .catch(error => {
                console.error(error)
            })
            .finally(() => setIsLoading(false))
    }, [])

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

    return (
        <div className="container-fluid p-5">
            <div className="d-flex justify-content-between align-items-center">
                <BackBtn text={'回列表'} onClickCallback={() => navigate('/manager/product')} />
            </div>

            <EditTitle>新增商品</EditTitle>

            <ContentWrapper>
                <EditForm>
                    <div className="row align-items-center mb-4">
                        <div className="col-1 label">廠商名稱</div>
                        <div className="col">
                            <div className="name">{supply.name}</div>
                        </div>
                        <div className="col-1 label">類別</div>
                        <div className="col">
                            <select
                                className={`form-select text-secondary ${errorMessages.type ? "border-danger" : "border-primary"}`}
                                value={typeId}
                                onChange={(e) => {
                                    setErrorMessages(initErrorMessage())
                                    setTypeId(e.target.value)
                                }}>
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
                            <input type="text"
                                   className={`form-control ${errorMessages.name ? "border-danger" : "border-primary"}`}
                                   value={name}
                                   onChange={e => {
                                       setErrorMessages(initErrorMessage())
                                       setName(e.target.value)
                                   }} />
                        </div>
                        <div className="col-1 label">次分類</div>
                        <div className="col">
                            <select
                                className={`form-select text-secondary`}
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
                            <input type="text"
                                   className={`form-control ${errorMessages.model ? "border-danger" : "border-primary"}`}
                                   value={model}
                                   onChange={e => {
                                       setErrorMessages(initErrorMessage())
                                       setModel(e.target.value)
                                   }} />
                        </div>
                        <div className="col-1 label">溫層</div>
                        <div className="col">
                            <select
                                className={`form-select text-secondary ${errorMessages.chamber ? "border-danger" : "border-primary"}`}
                                value={chamber}
                                onChange={e => {
                                    setErrorMessages(initErrorMessage())
                                    setChamber(e.target.value)
                                }}>
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
                            <input type="text"
                                   className={`form-control ${errorMessages.origin ? "border-danger" : "border-primary"}`}
                                   value={origin}
                                   onChange={e => {
                                       setErrorMessages(initErrorMessage())
                                       setOrigin(e.target.value)
                                   }} />
                        </div>
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
                                       setPreviewImg(e.target.files[0])
                                   }} />
                            {
                                previewImgUrl
                                    ? <div className="w-50">
                                        <img src={previewImgUrl} alt="preview" className="w-100" />
                                    </div>
                                    : null
                            }
                        </div>
                    </div>
                    <div className="row align-items-center mb-5">
                        <div className="col-1 label">保存期限</div>
                        <div className="col">
                            <input type="text"
                                   className={`form-control ${errorMessages.expire ? "border-danger" : "border-primary"}`}
                                   value={expire}
                                   onChange={e => {
                                       setErrorMessages(initErrorMessage())
                                       setExpire(e.target.value)
                                   }} />
                        </div>
                        <div className="col-1 label">交期</div>
                        <div className="col-5">
                            <input type="text"
                                   className={`form-control ${errorMessages.delivery ? "border-danger" : "border-primary"}`}
                                   value={delivery}
                                   onChange={e => setDelivery(e.target.value)} />
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
                                <input
                                    className={`form-control mb-auto ${errorMessages.quote ? "border-danger" : "border-primary"}`}
                                    type="number"
                                    value={quote}
                                    style={{ width: 'calc(100% - 20px)' }}
                                    onChange={(e) => {
                                        setErrorMessages(initErrorMessage())
                                        setQuote(e.target.value)
                                    }} />
                                <DialogSetPriceDollarSymbol className="mt-2">元</DialogSetPriceDollarSymbol>
                            </div>
                        </div>
                        <div className="col">
                            <div className="col d-flex">
                                <DialogSetPriceLabel>一般售價</DialogSetPriceLabel>
                                <div className="d-flex flex-wrap align-items-center mx-2 w-75">
                                    <input
                                        className={`form-control ${errorMessages.price ? "border-danger" : "border-primary"}`}
                                        type="number"
                                        value={price}
                                        style={{ width: 'calc(100% - 20px)' }}
                                        onChange={(e) => {
                                            setErrorMessages(initErrorMessage())
                                            setPrice(e.target.value)
                                        }} />
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
                        <GroupPrice groupPriceList={groupPriceList} setGroupPriceList={setGroupPriceList}
                                    borderColor={errorMessages.groupPriceList ? 'border-danger' : 'border-primary'} />
                    </div>

                </EditForm>
            </ContentWrapper>

            <div className="text-center">
                <NewProductButton className="btn-primary"
                                  onClick={() => {
                                      if (!canCreateProduct()) {
                                          alert("請填寫欄位")
                                          return
                                      }

                                      setModal('create')
                                      setShouldOpenModal(true)
                                  }}>確認新增</NewProductButton>
            </div>


            {
                modal === 'create' && shouldOpenModal && <CreateProductDialog closeModal={closeModal} create={create} />
            }

            {
                modal === 'done' && shouldOpenModal && <ConfirmActiveDialog closeModal={() => {
                    closeModal()
                    navigate('/manager/product')
                }} />
            }

        </div>
    )
}

export default NewProduct