import React from 'react'
import styled from "styled-components"

const Button = styled.button.attrs({
    className: 'btn btn-primary text-white position-relative'
})`
  width: 176px;
  border-radius: 8px;

  i {
    position: absolute;
    top: 50%;
    left: 26px;
    transform: translateY(-50%);
  }
`

const BackBtn = ({ onClickCallback = () => {}, text }) => {
    return (
        <Button onClick={onClickCallback}>
            <i className="bi bi-arrow-left" />
            {text}
        </Button>
    )
}

export default BackBtn