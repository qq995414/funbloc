import styled from "styled-components"

export const logo1 = '/images/manager/01.svg'
export const logo2 = '/images/manager/02.svg'

export const LoginWrapper = styled.div`
  box-sizing: border-box;
  font-family: Roboto;
  height: 100vh;
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