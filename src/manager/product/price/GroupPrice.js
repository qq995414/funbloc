import React from 'react'
import { DialogSetPriceDollarSymbol, DialogSetPriceInputWrapper } from "../../components/setPrice/SetPriceDialogStyle"

const GroupPrice = ({ groupPriceList, setGroupPriceList, borderColor }) => {

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

    return (
        <>
            {
                groupPriceList.map((groupPrice, idx) => {
                    return <div className="col-6 d-flex mb-3" key={idx}>
                        <DialogSetPriceInputWrapper className="d-flex ms-2 align-items-center">
                            <input className="form-control border-primary"
                                   type="text"
                                   readOnly={true}
                                   value={groupPrice.hawkerGroupName} />
                        </DialogSetPriceInputWrapper>
                        <DialogSetPriceInputWrapper className="d-flex ms-2 align-items-center">
                            <input className={`form-control ${borderColor}`}
                                   type="number"
                                   value={groupPrice.price}
                                   onChange={(e) => setGroupPrice(e.target.value, idx, 'price')} />
                            <DialogSetPriceDollarSymbol>元</DialogSetPriceDollarSymbol>
                        </DialogSetPriceInputWrapper>
                    </div>
                })
            }

        </>
    )
}

export default GroupPrice