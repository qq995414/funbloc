import styled from "styled-components";
import { Link } from "react-router-dom";
import { layout, space } from "styled-system";

export const NavButton = styled.a.attrs({})`
  color: #747474;
  cursor: pointer;

  &.active {
    color: #26b7bc;
    font-weight: bolder;
  }
`;

export const NavRouteButton = styled.button`
  text-align: center;
  width: 126px;
`;

export const PaginationWrapper = styled.div`
  margin-top: 50px;
`;

export const CheckButton = styled(Link)`
  background-color: #48c97b;
  color: #fff;
  line-height: 1;
  font-size: 12px;
  font-family: "Noto Sans", sans-serif;
`;
export const TdButton = styled.button`
  background-color: #fe868e;
  color: #fff;
  line-height: 1;
  font-size: 12px;
  font-family: "Noto Sans", sans-serif;
`;

export const ChangeStatsButton = styled.button.attrs({
  className: "btn btn-secondary rounded-pill border-0 px-4",
})`
  background-color: #c0c0c0;

  + .btn {
    margin-left: 10px;
  }
`;

export const SearchIcon = styled.div.attrs({
  className: "position-absolute text-primary",
})`
  top: 50%;
  right: 1.5rem;
  transform: translateY(-50%);
  cursor: pointer;
`;
export const SearchInput = styled.input.attrs({
  className: "form-control border-primary pe-5",
})`
  font-size: 12px;
  &::placeholder {
    font-size: 12px;
  }
`;

export const ContentWrapper = styled.div`
  border: 1px solid #26b7bc;
//  width:50%;  
  border-radius: 10px;
  background-color: #fff;
  margin-bottom: 27px;
  overflow: hidden;
  ${layout}
  ${space}
`;
export const ContentWrapperClass = styled.div`
  border: 1px solid #26b7bc;
  width:50%;  
  border-radius: 10px;
  background-color: #fff;
  margin-bottom: 27px;
  overflow: hidden;
  ${layout}
  ${space}
`;
export const OperateButton = styled.button.attrs({
  className: "btn border-0",
})`
  width: 130px;
  border-radius: 8px;
`;
