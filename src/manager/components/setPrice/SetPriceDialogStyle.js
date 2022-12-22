import styled from "styled-components"

export const DialogSetPriceWrapper = styled.div.attrs({
    className: ""
})`
  width: 100%;
  padding: 35px 125px;
  height: 735px;
  overflow-y: auto;
`

export const DialogSetPriceDivider = styled.div.attrs({
    className: 'my-5 mx-auto'
})`
  width: 88%;
  height: 1px;
  background-color: #26B7BC;
`

export const DialogSetPriceSelect = styled.select.attrs({
    className: 'form-select  border-primary'
})`
  width: 35%;
`
export const DialogSetPriceInputWrapper = styled.div.attrs({
    className: ''
})`
  width: 50%;
`
export const DialogSetPriceLabel = styled.div.attrs({
    className: " pe-3 mt-2"
})`
  font-size: 15px;
  font-weight: bold;
  font-family: 'Century Gothic';
`

export const DialogSetPriceDollarSymbol = styled.div.attrs({
    className: 'px-2'
})`
  width: 20px;
  font-size: 15px;
  font-weight: bold;
  font-family: 'Century Gothic';
`
export const DialogSetPriceDeleteButton = styled.button.attrs({
    className: 'btn btn-danger text-white'
})`
  width: 15%;
`


export const DialogSetPriceNote = styled.div.attrs({
    className: "d-flex justify-content-start"
})`
  width: 100%;
  font-size: 15px;
  font-weight: bold;
  font-family: 'Century Gothic';
`

export const DialogSetPriceAddBGroupButton = styled.div.attrs({
    className: 'mx-auto text-center py-1'
})`
  border-radius: 4px;
  border: 1px dotted #26B7BC;
  cursor: pointer;
  margin-bottom: 60px;
`