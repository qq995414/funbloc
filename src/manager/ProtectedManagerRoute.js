import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import SideNav from "./components/sidenav/SideNav";
import Home from "./home/Home";
import { fetchMe } from "../api/login/ManagerLogin";
import ProductRoute from "./product/ProdcutRoute";
import Product from "./product/Product";
import EditProduct from "./product/edit/EditProduct";
import NewProduct from "./product/new/NewProduct";
import ClassifyProduct from "./product/classify/ClassifyProduct";
import CompanyRoute from "./company/CompanyRoute";
import Company from "./company/Company";
import EditCompany from "./company/edit/EditCompany";
import NewCompany from "./company/new/NewCompany";
import ClassifyCompany from "./company/classify/ClassifyCompany";
import HawkerRoute from "./hawker/HawkerRoute";
import Hawker from "./hawker/Hawker";
import NewHawker from "./hawker/new/NewHawker";
import EditHawker from "./hawker/edit/EditHawker";
import ClassifyHawker from "./hawker/classify/ClassifyHawker";
import FunblocRoute from "./funbloc/FunblocRoute";
import Funbloc from "./funbloc/Funbloc";
import EditFunbloc from "./funbloc/edit/EditFunbloc";
import ClassifyFunbloc from "./funbloc/classify/ClassifyFunbloc";
import NewFunbloc from "./funbloc/new/NewFunbloc";
import Order from "./order/Order";
import OrderRoute from "./order/OrderRoute";
import Admin from "./admin/Admin";
import AdminRoute from "./admin/AdminRoute";
import NewAdmin from "./admin/new/NewAdmin";
import EditAdmin from "./admin/edit/EditAdmin";
import OrderDetail from "./order/detail/OrderDetail";
import MessageRoute from "./message/MessageRoute";
import Message from "./message/Message";
import CommentDetail from "./message/CommentDetail";
import WishDetail from "./message/WishDetail";

const Main = styled.div`
  margin-left: auto;
  width: calc(100vw - 300px);
  min-height: 100vh;
`;

const ProtectedManagerRoute = () => {
  const navigate = useNavigate();
  const [me, setMe] = useState({});

  useEffect(() => {
    fetchMe()
      .then((res) => {
        setMe(res);
      })
      .catch((error) => {
        console.error(error);
        navigate("/manager", { replace: true });
      });
  }, []);

  return me.id ? (
    <>
      <SideNav me={me} />
      <Main>
        <Routes>
          <Route path="home" element={<Home />} />
          <Route path="message" element={<MessageRoute />}>
            <Route index element={<Message />} />
            <Route path="comment/:commentId" element={<CommentDetail />} />
            <Route path="wish/:wishId" element={<WishDetail />} />
          </Route>
          <Route path="order" element={<OrderRoute />}>
            <Route index element={<Order />} />
            <Route path="detail/:orderId" element={<OrderDetail />} />
          </Route>
          <Route path="hawker" element={<HawkerRoute />}>
            <Route index element={<Hawker />} />
            <Route path="new" element={<NewHawker />} />
            <Route path="edit/:hawkerId" element={<EditHawker />} />
            <Route path="classify" element={<ClassifyHawker />} />
          </Route>
          <Route path="product" element={<ProductRoute />}>
            <Route index element={<Product />} />
            <Route path="edit/:productId" element={<EditProduct />} />
            <Route path="new" exact={true} element={<NewProduct />} />
            <Route path="classify" exact={true} element={<ClassifyProduct />} />
          </Route>
          <Route path="company" element={<CompanyRoute />}>
            <Route index element={<Company />} />
            <Route path="edit/:companyId" element={<EditCompany />} />
            <Route path="new" exact={true} element={<NewCompany />} />
            <Route path="classify" exact={true} element={<ClassifyCompany />} />
          </Route>
          <Route path="funbloc" element={<FunblocRoute />}>
            <Route index element={<Funbloc />} />
            <Route path="edit/:funblocId" element={<EditFunbloc />} />
            <Route path="new" exact={true} element={<NewFunbloc />} />
            <Route path="classify" exact={true} element={<ClassifyFunbloc />} />
          </Route>
          <Route path="admin" element={<AdminRoute />}>
            <Route index element={<Admin />} />
            <Route path="edit/:id" exact={true} element={<EditAdmin />} />
            <Route path="new" exact={true} element={<NewAdmin />} />
          </Route>
          <Route path="*" element={<Navigate to="/manager" replace />} />
        </Routes>
      </Main>
    </>
  ) : null;
};

export default ProtectedManagerRoute;
