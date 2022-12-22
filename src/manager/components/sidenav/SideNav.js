import React from "react";
import {
  Avatar,
  LogoutButtonWrapper,
  MenuUl,
  SidebarHeader,
  SidebarLink,
  SidebarList,
  SidebarMenu,
  SidebarWrapper,
} from "./SideNavStyle";
import { removeDataFromLocalStorage } from "../../../api/Api";
import { useNavigate } from "react-router-dom";

const indexIcon = "/images/manager/cate1.png";
const indexActiveIcon = "/images/manager/cate1_active.png";

const messageIcon = "/images/manager/cate2.png";
const messageActiveIcon = "/images/manager/cate2_active.png";

const orderIcon = "/images/manager/cate3.png";
const orderActiveIcon = "/images/manager/cate3_active.png";

const hawkerIcon = "/images/manager/cate4.png";
const hawkerActiveIcon = "/images/manager/cate4_active.png";

const productIcon = "/images/manager/cate5.png";
const productActiveIcon = "/images/manager/cate5_active.png";

const companyIcon = "/images/manager/cate6.png";
const companyActiveIcon = "/images/manager/cate6_active.png";

const storeIcon = "/images/manager/cate7.png";
const storeActiveIcon = "/images/manager/cate7_active.png";

const adminIcon = "/images/manager/cate8.png";
const adminActiveIcon = "/images/manager/cate8_active.png";

const sidebarBottomImg = "/images/manager/07.png";

const SideNav = ({ me }) => {
  const navigate = useNavigate();
  const { name, note, photo, notifyCount, orderCount } = me;

  const logout = () => {
    removeDataFromLocalStorage();
    navigate("/manager");
  };

  return (
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
              {name} {note}
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

      <SidebarMenu className="sidebar-menu">
        <MenuUl className="menu">
          <SidebarList id="cate1" className="sidebar-item">
            <SidebarLink
              to="/manager/home"
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
              to="/manager/message"
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
                        {notifyCount}
                      </span>
                    </span>
                  </>
                );
              }}
            </SidebarLink>
          </SidebarList>

          <SidebarList id="cate3" className="sidebar-item">
            <SidebarLink
              to="/manager/order"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {({ isActive }) => {
                return (
                  <>
                    <div className="icon-wrapper">
                      <img
                        src={isActive ? orderActiveIcon : orderIcon}
                        alt=""
                      />
                    </div>
                    <span className="ms-4">
                      訂單資訊
                      <span
                        className={`count ms-2 rounded-circle px-2 ${
                          isActive ? "active" : ""
                        }`}
                      >
                        {orderCount}
                      </span>
                    </span>
                  </>
                );
              }}
            </SidebarLink>
          </SidebarList>

          <SidebarList id="cate4" className="sidebar-item">
            <SidebarLink
              to="/manager/hawker"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {({ isActive }) => {
                return (
                  <>
                    <div className="icon-wrapper">
                      <img
                        src={isActive ? hawkerActiveIcon : hawkerIcon}
                        alt=""
                      />
                    </div>
                    <span className="ms-4">小販資訊</span>
                  </>
                );
              }}
            </SidebarLink>
          </SidebarList>

          <SidebarList id="cate5" className="sidebar-item">
            <SidebarLink
              to="/manager/product"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {({ isActive }) => {
                return (
                  <>
                    <div className="icon-wrapper">
                      <img
                        src={isActive ? productActiveIcon : productIcon}
                        alt=""
                      />
                    </div>
                    <span className="ms-4">商品資訊</span>
                  </>
                );
              }}
            </SidebarLink>
          </SidebarList>

          <SidebarList id="cate6" className="sidebar-item">
            <SidebarLink
              to="/manager/company"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {({ isActive }) => {
                return (
                  <>
                    <div className="icon-wrapper">
                      <img
                        src={isActive ? companyActiveIcon : companyIcon}
                        alt=""
                      />
                    </div>
                    <span className="ms-4">廠商資訊</span>
                  </>
                );
              }}
            </SidebarLink>
          </SidebarList>

          <SidebarList id="cate7" className="sidebar-item">
            <SidebarLink
              to="/manager/funbloc"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {({ isActive }) => {
                return (
                  <>
                    <div className="icon-wrapper">
                      <img
                        src={isActive ? storeActiveIcon : storeIcon}
                        alt=""
                      />
                    </div>
                    <span className="ms-4">販團資訊</span>
                  </>
                );
              }}
            </SidebarLink>
          </SidebarList>

          <SidebarList id="cate8" className="sidebar-item">
            <SidebarLink
              to="/manager/admin"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {({ isActive }) => {
                return (
                  <>
                    <div className="icon-wrapper">
                      <img
                        src={isActive ? adminActiveIcon : adminIcon}
                        alt=""
                      />
                    </div>
                    <span className="ms-4">控制台</span>
                  </>
                );
              }}
            </SidebarLink>
          </SidebarList>

          <LogoutButtonWrapper className="sidebar-item">
            <button className="btn btn-outline-primary w-100" onClick={logout}>
              登出
            </button>
          </LogoutButtonWrapper>
        </MenuUl>
      </SidebarMenu>

      <div
        style={{
          position: "absolute",
          left: "0%",
          right: "0%",
          top: "83.61%",
          bottom: "0%",
          background: "#40BEC2",
          borderRadius: "0px 20px 50px 0px",
          pointerEvents: "none",
        }}
      ></div>

      <div
        style={{
          position: "absolute",
          left: "0%",
          right: "0%",
          bottom: "0%",
          pointerEvents: "none",
        }}
      >
        <img
          src={sidebarBottomImg}
          className="w-75"
          style={{
            position: "absolute",
            right: "0%",
            bottom: "0%",
            zIndex: "40",
          }}
        />
      </div>
    </SidebarWrapper>
  );
};

export default SideNav;
