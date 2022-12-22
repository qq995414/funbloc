import styled from "styled-components"

export const SelectWrapper = styled.div.attrs({
    className: 'd-flex align-items-center mx-2'
})``
export const SelectLabel = styled.div`
  width: 180px;
  color: #747474;
  line-height: 20px;
  font-family: 'Noto Sans';
`

export const ProductTypeSelect = styled.select.attrs({})`
  flex-grow: 1;
`


export const FormCheckbox = styled.input.attrs({
    className: "form-check-input mx-auto"
})`
  width: 1.25rem;
  height: 1.25rem;
`