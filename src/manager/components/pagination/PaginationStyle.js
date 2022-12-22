import styled from 'styled-components'

export const PageItem = styled.li.attrs({
    className: 'page-item'
})`

  &:first-child .page-link {

    border-top-left-radius: 50%;
    border-bottom-left-radius: 50%;
  }

  &:last-child .page-link {
    border-top-right-radius: 50%;
    border-bottom-right-radius: 50%;
  }

  &:not(.active) .page-link {
    border: none;
    background-color: transparent;
  }
`

export const PageLink = styled.button.attrs({
    className: 'page-link'
})`
  border-radius: 50%;

  &:hover, &:focus, &:focus-visible {
    border-radius: 50% !important;
  }
`