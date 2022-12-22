import styled from "styled-components"
import { StyledTextarea } from "../wish/WishStyle"
import { StyledInput } from "../ing/detail/FublocDetailStyle"
import { space } from "styled-system"

export const DeleteButton = styled.button.attrs({
    className: 'btn'
})`
  font-size: 1.2rem;

  i {
    color: #FF5A79;
  }
`

export const AddNewFamiliarHawker = styled.button.attrs({
    className: 'btn'
})`
  font-size: 2rem;
`

export const EditButton = styled.button.attrs({
    className: 'btn'
})`
  font-size: 1.2rem;

  i {
    color: #747474;
  }
`


export const FHEditWrapper = styled.div`
  width: 100%;
  padding: 60px 70px;
  ${space}
  select {
    width: 42%;
  }
`

export const EditTitle = styled.div.attrs({
    className: 'text-primary text-center'
})`
  margin-bottom: 44px;
  font-weight: 700;
  font-size: 16px;
`
export const FHStyledInput = styled(StyledInput)`
  width: 100%;
  margin-left: 0;
`
export const FHStyledTextarea = styled(StyledTextarea)`
  width: 100%;
  margin-left: 0;
`