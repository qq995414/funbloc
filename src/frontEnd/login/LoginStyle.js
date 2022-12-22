import styled from "styled-components";
import {
  display,
  flexbox,
  layout,
  space,
  typography,
} from "styled-system";

export const logo1 = '/images/manager/01.svg'
export const logo2 = '/images/manager/02.svg'

export const LoginWrapper = styled.div`
  box-sizing: border-box;
  font-family: Roboto;
  width: 100vw;
  height: 100vh;
  ${layout}
`

export const AuthLogo = styled.div.attrs({})`
  margin-bottom: 25px;
`
export const Title = styled.div.attrs({})`
  font-size: 23px;
  font-weight: bold;
  margin-bottom: 0;
  margin-top: 58px;
`

export const LoginForm = styled.form`
  width: 30%;
  ${layout}
`
export const FormInput = styled.input`
  border: 1px solid #A8D9DC;
  border-radius: 9px;
  padding-left: calc(40px + 35px);

  &::placeholder {
    color: #26B7BC;
  }
`
export const IconPerson = styled.div`
  padding: 0;
  top: 50%;
  left: 40px;
  transform: translateY(-50%);
`

export const IconLock = styled.div`
  padding: 0;
  top: 50%;
  left: 43px;
  transform: translateY(-50%);
`
export const FirstLoginImgWrapper = styled.div.attrs({
    className: 'mx-auto'
})`
  width: 11vw;
  margin-bottom: 66px;
  ${layout}
  ${space}
  img {
    width: 100%;
  }
`

export const FirstLoginTitle = styled.div.attrs({})`
  font-size: 26px;
  ${typography}
`
export const FirstLoginText = styled.div.attrs({})`
  font-size: 16px;
  ${typography}
`
export const FirstLoginFormContainer = styled.div.attrs({
    className: 'container bg-white'
})`
  /* padding-left: 15%;
  padding-right: 10%; */
  margin-top: 19px;
  border: 1px solid #26B7BC;
  border-radius: 26px;
  color: #747474;
  font-size: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  ${layout}
  ${space}
`

export const StyledRow = styled.div.attrs({
    className: 'row'
})`
  margin-bottom: 15px;
  ${display}
  ${flexbox}
`
export const StyledInput = styled.input.attrs({
    className: 'form-control borer-primary'
})`
  ${space}
`

export const StyledSelect = styled.select.attrs({
    className: 'form-select borer-primary'
})``

export const StyledDate = styled.div.attrs({
    className: "form-control border-primary d-flex align-items-center"
})`
  i {
    margin-right: 1rem;
  }

  input {
    border: none;
    width: 100%;
    color: #747474;
    font-size: 15px;

    &:focus-visible, &:focus {
      outline: none;
      border: none;
    }
  }
`


export const FirstLoginButton = styled.button.attrs({
    className: "btn btn-primary text-white"
})`
  width: 123px;
`

export const ForgotPasswordLink = styled.div.attrs({
    className: "d-block text-primary mb-2 ms-auto"
})`
  width: fit-content;
  cursor: pointer;
`

export const ModalInput = styled.input.attrs(({ error }) => ({
    className: `form-control ${error ? 'border-danger' : 'border-primary'}`
}))`

  ::placeholder {
    color: #26B7BC;
  }
`

export const ModalForgotWrapper = styled.div.attrs({
    className: "text-center"
})`
  .title {
    font-size: 20px;
    font-weight: bold;
  }

  .warning {
    font-size: 14px;
    line-height: 1.75em;
  }
`

export const ModalSendRequirementWrapper = styled.div.attrs({
    className: "text-center"
})`
  .title {
    font-size: 20px;
    font-weight: bold;
  }

  .img-wrapper {
    width: 72px;
    height: 72px;
  }

`
