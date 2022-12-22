import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import MobileSideNav from "./components/MobileSideNav/SideNav";
import SideNav from "./components/sidenav/SideNav";
import Home from "./home/Home";
import FirstLogin from "./login/FirstLogin";
import { fetchMe } from "../api/admin/Admin";
import My from "./my/My";
import Wish from "./wish/Wish";
import Advise from "./advise/Advise";
import Qa from "./qa/Qa";
import Message from "./message/Message";
import Open from "./open/Open";
import OpenDetail from "./open/detail/OpenDetail";
import OpenRoute from "./open/OpenRoute";
import IngRoute from "./ing/IngRoute";
import Ing from "./ing/Ing";
import EndRoute from "./end/EndRoute";
import End from "./end/End";
import IngFublocDetail from "./ing/detail/IngFublocDetail";
import FunblocSummary from "./ing/summary/FunblocSummary";
import Checkout from "./ing/checkout/Checkout";
import EndDetail from "./end/detail/EndDetail";
import FamiliarHawker from "./familiar/FamiliarHawker";
import ResetPasswordPage from "./my/ResetPasswordPage";
import { layout, space } from "styled-system";
import { StyledFlexBox } from "../styles/Shared.styles";

const Main = styled.div`
  margin-left: auto;
  width: calc(100vw - 300px);
  ${layout}
  ${space}
`;
const LinkButton = styled(Link).attrs({
  className: "btn rounded-pill px-3 text-white mx-1",
})`
  background-color: ${({ bgColor }) => bgColor};
  font-size: 13px;
`;

const ProtectedFrontEndRoute = () => {
  const navigate = useNavigate();
  const [me, setMe] = useState({});
  const [myPriceTotal, setMyPriceTotal] = useState(0);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  const firstLoginEditDone = useCallback(() => {
    setIsFirstLogin(false);
  }, []);

  const getMe = useCallback(() => {
    (async () => {
      try {
        const res = await fetchMe();
        setMe(res.data);
        setMyPriceTotal(res.data.myPriceTotal);

        if (res.data.stats === 2) {
          setIsFirstLogin(true);
        }
      } catch (error) {
        console.error(error);
        navigate("/", { replace: true });
      }
    })();
  }, [navigate]);

  useEffect(() => {
    getMe();
  }, []);

  return me.id ? (
    isFirstLogin ? (
      <FirstLogin firstLoginEditDone={firstLoginEditDone} />
    ) : (
      <>
        <MobileSideNav me={me} myPriceTotal={myPriceTotal} />
        <SideNav me={me} myPriceTotal={myPriceTotal} />
        <Main
          mx={[32, "auto", "auto"]}
          mr={["auto", "auto", 0]}
          width={[
            "calc(100% - 64px)",
            "calc(100% - 64px)",
            "calc(100vw - 300px)",
          ]}
        >
          <StyledFlexBox
            mt={50}
            justifyContent="flex-end"
            pr={[32, 0, 60]}
            width="100%"
            ml={["48px", 0, 36]}
            display={["none", "flex"]}
          >
            <LinkButton className="btn-warning" to="wish" bgColor={"#FFBD3D"}>
              <i className="bi bi-star me-2" />
              商品許願
            </LinkButton>
            <LinkButton
              className="btn-info"
              to="advise"
              bgColor={"#66C9E8"}
              style={{ width: "150px" }}
            >
              <i className="bi bi-chat-square-dots me-2" />
              提供意見與回饋
            </LinkButton>
            <LinkButton className="btn-danger" to="qa" bgColor={"#FE868E"}>
              <i className="bi bi-question-square me-2" />
              常見問題
            </LinkButton>
          </StyledFlexBox>
          <Routes>
            <Route path="home" element={<Home />} />
            <Route path="message" element={<Message />} />
            <Route path="open" element={<OpenRoute />}>
              <Route index element={<Open />} />
              <Route path=":openId" element={<OpenDetail />} />
            </Route>
            <Route path="ing" element={<IngRoute />}>
              <Route index element={<Ing />} />
              <Route path=":funblocId" element={<IngFublocDetail />} />
              <Route path="summary/:funblocId" element={<FunblocSummary />} />
              <Route path="checkout" element={<Checkout />} />
            </Route>
            <Route path="end" element={<EndRoute />}>
              <Route index element={<End />} />
              <Route path=":funblocId" element={<EndDetail />} />
              <Route path="summary/:funblocId" element={<FunblocSummary />} />
              <Route path="checkout" element={<Checkout />} />
            </Route>
            <Route path="familiar-hawker" element={<FamiliarHawker />} />
            <Route path="my" element={<My getMe={getMe} />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
            <Route path="wish" element={<Wish />} />
            <Route path="advise" element={<Advise />} />
            <Route path="qa" element={<Qa />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Main>
      </>
    )
  ) : null;
};

export default ProtectedFrontEndRoute;
