import React, { useEffect, useState } from 'react'
import Dialog from "../../../component/dialog/Dialog"
import { DialogButton, DialogContentWrapper, DialogTitle } from "../../../component/dialog/DialogStyle"
import {
    DialogSetPriceDivider,
    DialogSetPriceDollarSymbol,
    DialogSetPriceInputWrapper,
    DialogSetPriceLabel,
    DialogSetPriceNote,
    DialogSetPriceSelect,
    DialogSetPriceWrapper
} from "./SetPriceDialogStyle"
import { fetchHawkerTypes } from "../../../api/hawker/ManagerHawker"
import { editProductPrice } from "../../../api/Product"

const initGroupPrice = () => ({
    hawkerGroupId: '-',
    price: 0,
    hawkerName: ''
})

const SetPriceDialog = ({ closeModal, productId, productPrice }) => {

    const [isLoading, setIsLoading] = useState(false)

    const [quote, setQuote] = useState(productPrice.quote || '0')
    const [price, setPrice] = useState(productPrice.price || '0')
    const [pageShow, setShowPage] = useState(0)
    const [groupPriceList, setGroupPriceList] = useState([initGroupPrice(), initGroupPrice(), initGroupPrice(), initGroupPrice()])

    const [hawkers, setHawkers] = useState([])
    const [availableHawkers, setAvailableHawkers] = useState([])

    const setGroupPrice = (value, idx, key) => {
        setGroupPriceList(prev => {
            return prev.map((_groupPrice, i) => {
                if (i === idx) {
                    _groupPrice[key] = value
                }
                return _groupPrice
            })
        })
    }

    const submit = () => {
        setIsLoading(true)

        const _groupPriceList = groupPriceList.filter(priceList => priceList.hawkerGroupId !== '-')

        editProductPrice(productId, quote, price, pageShow, _groupPriceList)
            .then(() => closeModal())
            .catch(error => {
                console.error(error)
            })
            .finally(() => setIsLoading(false))
    }

    useEffect(() => {
        setIsLoading(true)
        fetchHawkerTypes({ page: 1, perPage: 1000 })
            .then(res => setHawkers(res.data))
            .catch(error => {
                console.error(error)
            })
            .finally(() => setIsLoading(false))
    }, [])

    useEffect(() => {
        const hawkerIds = hawkers.map(hawker => hawker.id)
        const selectedHawkerIds = groupPriceList.reduce((prev, current) => {
            if (current.hawkerGroupId !== '-') {
                prev.push(current.hawkerGroupId)
            }
            return prev
        }, [])

        setAvailableHawkers(() => {
            const unSelectedIds = hawkerIds.filter(hawkerId => !selectedHawkerIds.includes(hawkerId))
            return hawkers.filter(hawker => unSelectedIds.includes(hawker.id))
        })
    }, [hawkers, groupPriceList])

    return (
        <Dialog onClose={closeModal}>
            <DialogContentWrapper width={700} height={735}>
                <DialogSetPriceWrapper>
                    <DialogTitle className="text-primary text-center">價格設定</DialogTitle>
                    <div className="d-flex justify-content-center align-items-center mb-3">
                        <DialogSetPriceLabel>成本進價</DialogSetPriceLabel>
                        <div className="d-flex mx-2 align-items-center w-75">
                            <input className="form-control border-primary"
                                   type="number"
                                   value={quote}
                                   onChange={(e) => setQuote(e.target.value)} />
                            <DialogSetPriceDollarSymbol>元</DialogSetPriceDollarSymbol>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center align-items-center mb-3">
                        <DialogSetPriceLabel>官方售價</DialogSetPriceLabel>
                        <div className="d-flex mx-2 align-items-center w-75">
                            <input className="form-control border-primary"
                                   type="number"
                                   value={price}
                                   onChange={(e) => setPrice(e.target.value)} />
                            <DialogSetPriceDollarSymbol>元</DialogSetPriceDollarSymbol>
                        </div>
                    </div>
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

                    <DialogSetPriceDivider />

                    <DialogTitle className="text-primary text-center mb-3">群組價格設定</DialogTitle>
                    <div className="mx-auto">
                        {
                            groupPriceList.map((groupPrice, idx) => {
                                return <div className="d-flex justify-content-center mb-3" key={idx}>
                                    <DialogSetPriceSelect disabled={isLoading} value={groupPrice.hawkerGroupId}
                                                          onChange={(e) => {
                                                              setGroupPrice(+e.target.value, idx, 'hawkerGroupId')
                                                              setGroupPrice(hawkers.filter(hawker => hawker.id === +e.target.value)[0].name, idx, 'hawkerName')
                                                          }}>
                                        {
                                            groupPrice.hawkerGroupId !== '-'
                                                ? <>
                                                    <option value="-" disabled>請選擇</option>
                                                    <option
                                                        value={groupPrice.hawkerGroupId}>{groupPrice.hawkerName}</option>
                                                </>
                                                : availableHawkers.length > 0
                                                    ? <>
                                                        <option value="-" disabled>請選擇</option>
                                                        {
                                                            availableHawkers.map(hawker => {
                                                                return <option key={hawker.id}
                                                                               value={hawker.id}>{hawker.name}</option>
                                                            })
                                                        }
                                                    </>
                                                    : <option value="-">-</option>
                                        }
                                    </DialogSetPriceSelect>
                                    <DialogSetPriceInputWrapper className="d-flex ms-2 align-items-center">
                                        <input className="form-control border-primary"
                                               type="number"
                                               disabled={isLoading}
                                               value={groupPrice.price}
                                               onChange={(e) => setGroupPrice(e.target.value, idx, 'price')} />
                                        <DialogSetPriceDollarSymbol>元</DialogSetPriceDollarSymbol>
                                    </DialogSetPriceInputWrapper>
                                </div>
                            })
                        }
                    </div>
                    <div className="text-center mt-5">
                        <DialogButton className="btn-secondary cancel" onClick={closeModal}>取消</DialogButton>
                        <DialogButton className="btn-primary"
                                      disabled={isLoading}
                                      onClick={submit}>確認</DialogButton>
                    </div>


                </DialogSetPriceWrapper>
            </DialogContentWrapper>
        </Dialog>
    )
}

export default SetPriceDialog