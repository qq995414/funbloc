import styled from "styled-components"

export const Title = styled.div.attrs({
  className: 'text-primary text-center mt-4 mb-3'
})`
  font-weight: 600;
  font-size: 19px;
  line-height: 38px;
`

export const ProductTab = styled(Title).attrs({
  className: 'mx-4'
})`
  font-weight: 500;
  cursor: pointer;

  &.active {
    font-weight: 600;
  }
`

export const CreateButton = styled.button.attrs({
  className: 'btn btn-primary text-white'
})`
  width: 172px;
  height: 47px;
`
export const ContentWrapperButton = styled.button.attrs({
  className: 'btn btn-primary text-white'
})`
padding:0px;
width: 24px;
height: 24px;
border-radius: 110px;
font-weight: 500;
font-size: 20px;
line-height: 0px;

`

export const Label = styled.div.attrs({
  className: 'me-3'
})`
  font-size: 12px;
  color: #000;
  font-weight: bold;
`
export const Value = styled.div`
  font-size: 12px;
  color: #747474;
`

export const DeleteButton = styled.button.attrs({
  className: 'btn btn-danger text-white d-block mt-5 mx-auto'
})`
  width: 166px;
  height: 47px;
`
export const EditButton = styled.button.attrs({
  className: "btn btn-outline-primary px-4"
})`
  font-size: 12px;
  border-radius: 4px;
`

export const Td = styled.td`
  color: #747474 !important;
  font-size: 12px;
`
export const CountTd = styled(Td)`
  width: 35%;
`


export const ClassifyLabel = styled.div.attrs({
  className: ''
})`
  font-size: 14px;
  font-weight: 600;
  color: #000;

  &.text-indent {
    text-indent: 28px;
  }
`

export const ClassifyInput = styled.input.attrs({
  className: "form-control border-primary"
})`

  color: rgba(174, 174, 174, 1);
`

export const ClassifyTextarea = styled.textarea.attrs({
  className: 'form-control border-primary'
})`
  color: rgba(174, 174, 174, 1);
  resize: none;
`

export const SubTypeTitle = styled.div.attrs({
  className: 'w-75 py-2 text-primary text-center mb-2'
})`
  font-size: 14px;
  background: #E6E6E6;
  border-radius: 4.52px 4.52px 0 0;
`

export const SubTypeItem = styled.div.attrs({
  className: 'py-2 d-flex align-items-center w-75'
})`
  &:nth-child(even) {
    background-color: rgba(38, 183, 188, 0.1);
  }
`

const addIcon = '/images/manager/add.png'
export const AddSubTypeButton = styled.button.attrs({
  className: 'mt-2 btn rounded-circle'
})`
  width: 15px;
  padding-bottom: 15px;
  background-position: center center;
  background-repeat: no-repeat;
  background-image: url(${addIcon});
  background-size: 100% 100%;
  border-radius: 50%;
  cursor: pointer;
`
export const ContentWrapperTitle = styled.div.attrs({
  className: 'row mb-3 px-3 py-2'
})`
  background-color: #F4F4F4;
  border-radius: 8px;
  font-weight: 500;
  font-size: 20px;
  display: flex;
  align-items: center;
  letter-spacing: 0.03em;
  color: #2E2E2E;
  font-style: normal;

`
