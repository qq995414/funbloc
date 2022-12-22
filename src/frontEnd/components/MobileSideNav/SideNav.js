import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  LogoutButtonWrapper,
  MenuUl,
  SidebarHeader,
  SidebarLink,
  SidebarList,
  SidebarMenu,
  SidebarOpenWrapper,
  SidebarWrapper,
} from "./SideNavStyle";
import { Link } from 'react-router-dom'
import { removeDataFromLocalStorage } from "../../../api/Api";
import { useNavigate } from "react-router-dom";
import { numberWithThousandCommas } from "../../../helper/Helper";
import { StyledFlexBox, StyledImage } from "../../../styles/Shared.styles";
import styled from "styled-components";

const indexIcon = "/images/front-end/sidebar_index.png";
const indexActiveIcon = "/images/front-end/sidebar_index_active.png";

const messageIcon = "/images/front-end/sidebar_message.png";
const messageActiveIcon = "/images/front-end/sidebar_message_active.png";

const openIcon = "/images/front-end/sidebar_start_team.png";
const openActiveIcon = "/images/front-end/sidebar_start_team_active.png";

const ingIcon = "/images/front-end/sidebar_starting_team.png";
const ingActiveIcon = "/images/front-end/sidebar_starting_team_active.png";

const endIcon = "/images/front-end/sidebar_already_team.png";
const endActiveIcon = "/images/front-end/sidebar_already_team_active.png";

const familiarHawkerIcon = "/images/front-end/sidebar_my_acquaintance.png";
const familiarHawkerActiveIcon =
  "/images/front-end/sidebar_my_acquaintance_active.png";

const LinkButton = styled(Link).attrs({
  className: 'btn rounded-pill px-3 text-white mx-1'
})`
  width: 100% !important;
  margin: 0 0 12px 0;
`

const SideNav = ({ me, myPriceTotal }) => {
  const navigate = useNavigate();
  const { name, photo, pushNotifyCount } = me;
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);
  const logout = () => {
    removeDataFromLocalStorage();
    navigate("/");
  };

  const [showNav, setShowNav] = useState(false);

  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setShowNav(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  return (
    <>
      {showNav ? (
        <StyledFlexBox
          bg="rgba(0, 0, 0, 0.1)"
          width="100vw"
          height="100%"
          position="fixed"
          zIndex={4}
          top={0}
        >
          <StyledFlexBox display={["block", "block", "none"]} ref={wrapperRef}>
            <SidebarWrapper>
              <SidebarHeader className="sidebar-header">
                <div className="align-items-center">
                  <Avatar
                    className="d-block avatar avatar-xl mb-3 mx-auto"
                    style={{ width: "98px", height: "98px" }}
                  >
                    <img src={photo} alt="Face 1" className="w-100 h-100" />
                  </Avatar>
                  <div className="text-center">
                    <h6
                      className="name-id text-primary"
                      style={{ fontWeight: "400", letterSpacing: "0.14em" }}
                    >
                      {name}
                    </h6>
                    <h6 className="mb-0 mt-4 text-primary">
                      累積營業額：
                      <span className="text-danger">
                        {numberWithThousandCommas(myPriceTotal)}
                      </span>
                      元
                    </h6>
                  </div>
                </div>
              </SidebarHeader>

              <hr
                style={{
                  marginLeft: "40px",
                  marginRight: "40px",
                  border: "1px solid #26B7BC",
                }}
              />

              <SidebarMenu className="sidebar-menu pb-5">
                <MenuUl className="menu">
                  <SidebarList id="cate1" className="sidebar-item">
                    <SidebarLink
                      to="/home"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      {({ isActive }) => {
                        return (
                          <>
                            <div className="icon-wrapper">
                              <img
                                src={isActive ? indexActiveIcon : indexIcon}
                                alt=""
                              />
                            </div>
                            <span className="ms-4">總覽</span>
                          </>
                        );
                      }}
                    </SidebarLink>
                  </SidebarList>

                  <SidebarList id="cate2" className="sidebar-item">
                    <SidebarLink
                      to="/message"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      {({ isActive }) => {
                        return (
                          <>
                            <div className="icon-wrapper">
                              <img
                                src={isActive ? messageActiveIcon : messageIcon}
                                alt=""
                              />
                            </div>
                            <span className="ms-4">
                              訊息通知
                              <span
                                className={`count ms-2 rounded-circle px-2 ${
                                  isActive ? "active" : ""
                                }`}
                              >
                                {pushNotifyCount}
                              </span>
                            </span>
                          </>
                        );
                      }}
                    </SidebarLink>
                  </SidebarList>

                  <SidebarList id="cate3" className="sidebar-item">
                    <SidebarLink
                      to="/open"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      {({ isActive }) => {
                        return (
                          <>
                            <div className="icon-wrapper">
                              <img
                                src={isActive ? openActiveIcon : openIcon}
                                alt=""
                              />
                            </div>
                            <span className="ms-4">我要開團</span>
                          </>
                        );
                      }}
                    </SidebarLink>
                  </SidebarList>

                  <SidebarList id="cate4" className="sidebar-item">
                    <SidebarLink
                      to="/ing"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      {({ isActive }) => {
                        return (
                          <>
                            <div className="icon-wrapper">
                              <img
                                src={isActive ? ingActiveIcon : ingIcon}
                                alt=""
                              />
                            </div>
                            <span className="ms-4">開團中</span>
                          </>
                        );
                      }}
                    </SidebarLink>
                  </SidebarList>

                  <SidebarList id="cate5" className="sidebar-item">
                    <SidebarLink
                      to="/end"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      {({ isActive }) => {
                        return (
                          <>
                            <div className="icon-wrapper">
                              <img
                                src={isActive ? endActiveIcon : endIcon}
                                alt=""
                              />
                            </div>
                            <span className="ms-4">已結團</span>
                          </>
                        );
                      }}
                    </SidebarLink>
                  </SidebarList>

                  <SidebarList id="cate6" className="sidebar-item">
                    <SidebarLink
                      to="/familiar-hawker"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      {({ isActive }) => {
                        return (
                          <>
                            <div className="icon-wrapper">
                              <img
                                src={
                                  isActive
                                    ? familiarHawkerActiveIcon
                                    : familiarHawkerIcon
                                }
                                alt=""
                              />
                            </div>
                            <span className="ms-4">我的熟販友</span>
                          </>
                        );
                      }}
                    </SidebarLink>
                  </SidebarList>

                  <SidebarList id="cate7" className="sidebar-item">
                    <SidebarLink
                      to="/my"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      {({ isActive }) => {
                        return (
                          <>
                            <div
                              className={`icon-wrapper ${
                                isActive ? "active" : ""
                              }`}
                            >
                              {/*<img src={isActive ? myActiveIcon : myIcon} alt="" />*/}
                              <svg
                                width="17"
                                height="17"
                                viewBox="0 0 17 17"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M12.75 1.59375H4.25C3.96821 1.59375 3.69796 1.70569 3.4987 1.90495C3.29944 2.10421 3.1875 2.37446 3.1875 2.65625V14.3438C3.1875 14.6255 3.29944 14.8958 3.4987 15.0951C3.69796 15.2943 3.96821 15.4062 4.25 15.4062H12.75C13.0318 15.4062 13.302 15.2943 13.5013 15.0951C13.7006 14.8958 13.8125 14.6255 13.8125 14.3438V2.65625C13.8125 2.37446 13.7006 2.10421 13.5013 1.90495C13.302 1.70569 13.0318 1.59375 12.75 1.59375ZM12.75 2.65625V5.84375H4.25V2.65625H12.75ZM4.25 10.0938V6.90625H12.75V10.0938H4.25ZM4.25 14.3438V11.1562H12.75V14.3438H4.25Z"
                                  fill="black"
                                />
                                <path
                                  d="M5.84375 4.78125C6.13715 4.78125 6.375 4.5434 6.375 4.25C6.375 3.9566 6.13715 3.71875 5.84375 3.71875C5.55035 3.71875 5.3125 3.9566 5.3125 4.25C5.3125 4.5434 5.55035 4.78125 5.84375 4.78125Z"
                                  fill="black"
                                />
                                <path
                                  d="M5.84375 9.03125C6.13715 9.03125 6.375 8.7934 6.375 8.5C6.375 8.2066 6.13715 7.96875 5.84375 7.96875C5.55035 7.96875 5.3125 8.2066 5.3125 8.5C5.3125 8.7934 5.55035 9.03125 5.84375 9.03125Z"
                                  fill="black"
                                />
                                <path
                                  d="M5.84375 13.2812C6.13715 13.2812 6.375 13.0434 6.375 12.75C6.375 12.4566 6.13715 12.2188 5.84375 12.2188C5.55035 12.2188 5.3125 12.4566 5.3125 12.75C5.3125 13.0434 5.55035 13.2812 5.84375 13.2812Z"
                                  fill="black"
                                />
                              </svg>
                            </div>
                            <span className="ms-4">編輯我的資訊</span>
                          </>
                        );
                      }}
                    </SidebarLink>
                  </SidebarList>

                  <SidebarList id="cate8" className="sidebar-item">
                    <SidebarLink
                      to="/reset-password"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      {({ isActive }) => {
                        return (
                          <>
                            <div
                              className={`icon-wrapper ${
                                isActive ? "active" : ""
                              }`}
                            >
                              <svg
                                width="17"
                                height="17"
                                viewBox="0 0 17 17"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M12.75 1.59375H4.25C3.96821 1.59375 3.69796 1.70569 3.4987 1.90495C3.29944 2.10421 3.1875 2.37446 3.1875 2.65625V14.3438C3.1875 14.6255 3.29944 14.8958 3.4987 15.0951C3.69796 15.2943 3.96821 15.4062 4.25 15.4062H12.75C13.0318 15.4062 13.302 15.2943 13.5013 15.0951C13.7006 14.8958 13.8125 14.6255 13.8125 14.3438V2.65625C13.8125 2.37446 13.7006 2.10421 13.5013 1.90495C13.302 1.70569 13.0318 1.59375 12.75 1.59375ZM12.75 2.65625V5.84375H4.25V2.65625H12.75ZM4.25 10.0938V6.90625H12.75V10.0938H4.25ZM4.25 14.3438V11.1562H12.75V14.3438H4.25Z"
                                  fill="black"
                                />
                                <path
                                  d="M5.84375 4.78125C6.13715 4.78125 6.375 4.5434 6.375 4.25C6.375 3.9566 6.13715 3.71875 5.84375 3.71875C5.55035 3.71875 5.3125 3.9566 5.3125 4.25C5.3125 4.5434 5.55035 4.78125 5.84375 4.78125Z"
                                  fill="black"
                                />
                                <path
                                  d="M5.84375 9.03125C6.13715 9.03125 6.375 8.7934 6.375 8.5C6.375 8.2066 6.13715 7.96875 5.84375 7.96875C5.55035 7.96875 5.3125 8.2066 5.3125 8.5C5.3125 8.7934 5.55035 9.03125 5.84375 9.03125Z"
                                  fill="black"
                                />
                                <path
                                  d="M5.84375 13.2812C6.13715 13.2812 6.375 13.0434 6.375 12.75C6.375 12.4566 6.13715 12.2188 5.84375 12.2188C5.55035 12.2188 5.3125 12.4566 5.3125 12.75C5.3125 13.0434 5.55035 13.2812 5.84375 13.2812Z"
                                  fill="black"
                                />
                              </svg>
                            </div>
                            <span className="ms-4">修改密碼</span>
                          </>
                        );
                      }}
                    </SidebarLink>
                  </SidebarList>
                  <StyledFlexBox flexDirection='column' mt={23} alignItems='center' display={['flex', 'none']}>
                      <LinkButton className="btn-warning" to="wish" bgColor={'#FFBD3D'}>
                          商品許願
                      </LinkButton>
                      <LinkButton className="btn-info" to="advise" bgColor={'#66C9E8'} style={{ width: '150px' }}>
                          提供意見與回饋
                      </LinkButton>
                      <LinkButton className="btn-danger" to="qa" bgColor={'#FE868E'}>
                          常見問題
                      </LinkButton>
                  </StyledFlexBox>
                  <LogoutButtonWrapper className="sidebar-item mt-3">
                    <button
                      className="btn btn-outline-primary w-100"
                      onClick={logout}
                    >
                      登出
                    </button>
                  </LogoutButtonWrapper>
                </MenuUl>
              </SidebarMenu>
            </SidebarWrapper>
          </StyledFlexBox>
        </StyledFlexBox>
      ) : (
        <SidebarOpenWrapper
          display={["flex", "flex", "none"]}
          onClick={() => {
            setShowNav(true);
          }}
        >
          <StyledImage src="/images/front-end/ArrowCircleRight.svg" mb={12} />
          選<br />單
        </SidebarOpenWrapper>
      )}
    </>
  );
};

export default SideNav;
