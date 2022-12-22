import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { display } from "styled-system";

export const SidebarWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 225px;
  height: 100vh;
  overflow-y: auto;
  background-color: #fff;
  transition: left 0.5s ease-out;
  box-shadow: 7px 6px 0px rgba(233, 233, 233, 0.25);
  border-radius: 0 50px 50px 0;
  z-index: 10;

  &.active {
    left: -300px;
  }

  & ~ .main {
    margin-left: 0;
  }
`;

export const SidebarOpenWrapper = styled.div`
  position: fixed;
  top: 40px;
  left: 0;
  bottom: 0;
  width: 40px;
  height: 120px;
  overflow-y: auto;
  background-color: #26b7bc;
  transition: left 0.5s ease-out;
  box-shadow: 7px 6px 0px rgba(233, 233, 233, 0.25);
  border-radius: 0 50px 50px 0;
  z-index: 10;
  border-radius: 0px 10px 10px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  flex-direction: column;
  ${display}
  &.active {
    left: -300px;
  }

  & ~ .main {
    margin-left: 0;
  }
`;

export const SidebarHeader = styled.div`
  font-size: 2rem;
  font-weight: 700;
  padding: 2rem 2rem 20px;
`;

export const Avatar = styled.div`
  border-radius: 50%;
  overflow: hidden;
`;

export const SidebarMenu = styled.div`
  overflow: auto;
`;

export const MenuUl = styled.ul`
  font-weight: 600;
  margin-top: 2rem;
  padding: 0 2rem;
`;
export const SidebarList = styled.li`
  list-style: none;
  margin-top: 0.5rem;
  position: relative;
`;

export const SidebarLink = styled(NavLink)`
  display: flex;
  padding: 0.7rem 1rem;
  align-items: center;
  color: #25396f;
  font-size: 1rem;
  border-radius: 3rem;
  text-decoration: none;
  transition: all 0.5s;

  &.active {
    background-color: #40bec2;
    color: #fff;
  }

  &:not(.active):hover {
    background-color: #f0f1f5;
  }

  img {
    width: 14px;
  }

  span.count {
    color: #fff;
    background-color: #40bec2;
    padding: 3px 0px;
    font-size: 14px;

    &.active {
      color: #40bec2;
      background-color: #fff;
    }
  }
`;

export const LogoutButtonWrapper = styled.li`
  margin-top: 60px;
  list-style: none;

  @media (max-height: 800px) {
    margin-bottom: 100px;
  }
`;

const sidebarBottomImg = "/images/front-end/sidebar_img.png";
export const SideNavBottomImgWrapper = styled.div`
  position: fixed;
  bottom: -30px;
  left: -17px;
  width: 225px;
  padding-bottom: calc(350px / 479 * 395);
  background-repeat: no-repeat;
  background-image: url(${sidebarBottomImg});
  background-size: 100% 100%;
  background-position: center center;
  pointer-events: none;
  z-index: 11;
`;
