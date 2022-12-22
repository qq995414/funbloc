import styled from 'styled-components'

export const NavButton = styled.a.attrs({})`
  color: #26B7BC;
  cursor: pointer;

  &.active {
    font-weight: bolder;
    border-bottom: 3px solid #26B7BC;
  }

`

export const ContentRow = styled.div.attrs({
    className: 'row'
})`
  padding: 110px 18px;
`

export const Label = styled.div.attrs({
    className: 'text-primary text-end'
})`
  font-weight: 600;
  font-size: 15px;
`

export const Time = styled.div.attrs({
    className: ''
})`
  color: #747474;
  font-weight: 600;
  font-size: 14px;
`

export const Text = styled(Time)`
  font-weight: 500;
`

export const BackWrapper = styled.div.attrs({
    className: 'text-center'
})`
  margin-top: 50px;
`