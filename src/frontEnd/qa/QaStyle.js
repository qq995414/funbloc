import styled from "styled-components"
import { Accordion } from "react-bootstrap"

export const QaContentWrapper = styled.div.attrs({
    className: ''
})`
  padding: 54px 47px;
`
export const Title = styled.div.attrs({
    className: 'text-primary text-center'
})`
  margin-bottom: 20px;
  font-size: 17px;
`

export const AccordionHeader = styled(Accordion.Header).attrs({})`
  button {
    border: none;
    border-radius: 11px;
    background-color: #ECFEFF;
  }
`
export const AccordionBody = styled(Accordion.Body)`
  line-height: 42px;
`