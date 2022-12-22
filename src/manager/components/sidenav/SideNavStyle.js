import styled from "styled-components"
import { NavLink } from "react-router-dom"

export const SidebarWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 300px;
  height: 100vh;
  overflow-y: auto;
  background-color: #fff;
  transition: left .5s ease-out;
  box-shadow: 7px 6px 0px rgba(233, 233, 233, 0.25);
  border-radius: 0 50px 50px 0;
  z-index: 10;

  &.active {
    left: -300px;
  }

  & ~ .main {
    margin-left: 0
  }
`

export const SidebarHeader = styled.div`
  font-size: 2rem;
  font-weight: 700;
  padding: 2rem 2rem 20px;
`

export const Avatar = styled.div`
  border-radius: 50%;
  overflow: hidden;
`

export const SidebarMenu = styled.div`
  height: 50%;
  overflow: auto;
`

export const MenuUl = styled.ul`
  font-weight: 600;
  margin-top: 2rem;
  padding: 0 2rem;
`
export const SidebarList = styled.li`
  list-style: none;
  margin-top: .5rem;
  position: relative
`

export const SidebarLink = styled(NavLink)`
  display: flex;
  padding: .7rem 1rem;
  align-items: center;
  color: #25396f;
  font-size: 1rem;
  border-radius: 3rem;
  text-decoration: none;
  transition: all .5s;

  &.active {
    background-color: #40BEC2;
    color: #fff;
  }

  &:not(.active):hover {
    background-color: #f0f1f5
  }

  .icon-wrapper {
    width: 14px;
  }

  span.count {
    color: #fff;
    background-color: #40BEC2;
    padding: 3px 0;
    font-size: 14px;

    &.active {
      color: #40BEC2;
      background-color: #fff;
    }
  }
`


export const LogoutButtonWrapper = styled.li`
  margin-top: 60px;
  list-style: none;

  @media (max-height: 800px) {
    margin-bottom: 100px;
  }
`

