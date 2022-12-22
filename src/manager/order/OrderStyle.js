import styled from "styled-components"

export const StyledDate = styled.div.attrs({
    className: "form-control border-primary d-flex align-items-center"
})`
  min-width: 230px;

  i {
    margin-right: 1rem;
  }

  input {
    border: none;
    width: 100%;
    color: #747474;

    &:focus-visible, &:focus {
      outline: none;
      border: none;
    }
  }
`

export const FastOrderContainer = styled.div.attrs({
    className: 'container position-relative'
})`
  color: #747474;
`

export const FastOrderLabel = styled.div.attrs({
    className: 'col-3 text-end'
})`
  font-size: 18px;
  font-weight: bold;
  color: #000;
`
export const ActionConfirmLabel = styled.div.attrs({
    className: 'text-center'
})`
  font-size: 18px;
  font-weight: bold;
  color: #000;
  margin-bottom: 10px;
`
export const ActionButton = styled.button.attrs({
    className: 'btn text-white'
})`
  width: 150px;
  background-color: ${({ confirmed }) => confirmed ? '#C0C0C0' : '#26B7BC'};

  :hover, :focus {
    background-color: ${({ confirmed }) => confirmed ? '#C0C0C0' : '#26B7BC'};
    filter: contrast(120%);
  }
`
export const FastOrderModalCloseButton = styled.div.attrs({
    className: 'position-absolute'
})`
  top: -10%;
  right: 0;
  width: 20px;
  font-size: 20px;
  cursor: pointer;

  i {
    font-size: inherit;
  }
`