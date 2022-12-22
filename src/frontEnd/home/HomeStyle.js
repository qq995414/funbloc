import styled from "styled-components";
import { Link } from "react-router-dom";
import { layout, space, typography } from "styled-system";
import { TdButton } from "../../component/StyledComponent";

export const HomeTitle = styled.div.attrs({
  className: "text-primary",
})`
  font-weight: 600;
  font-size: 21px;
  line-height: 38px;
`;

export const QuickSummaryWrapper = styled.div.attrs({
  className: "d-flex align-items-center justify-content-evenly",
})`
  height: 200px;
  ${layout}
`;
export const QuickSummaryTitle = styled.div.attrs({
  className: "text-primary me-3",
})`
  font-size: 17px;
  font-weight: 700;
  ${typography}
`;
export const QuickSummaryValue = styled.div.attrs({})`
  font-weight: 600;
  font-size: 34px;
  color: #000;
  ${typography}
`;

export const MessageWrapper = styled.div.attrs({
  className: "pt-5",
})`
  background-color: #f5feff;
`;

export const Message = styled.div.attrs({
  className: "mx-auto pb-4",
})`
  width: 85%;

  :not(:last-child) {
    border-bottom: 1px dotted #26b7bc;
  }
`;

export const MessageTitle = styled.div.attrs({})`
  font-size: 16px;
  line-height: 38px;
  font-weight: 600;
`;
export const MessageTime = styled.div.attrs({
  className: "text-danger",
})`
  font-size: 12px;
  font-weight: 600;
`;
export const MessageContent = styled.div.attrs({
  className: "",
})`
  font-size: 13px;
  line-height: 21px;
  font-weight: 600;
  color: #747474;
`;
export const MoreButton = styled(Link).attrs({
  className: "text-primary",
})`
  text-decoration: none;
`;

export const MessageButtonWrapper = styled.div.attrs({
  className: "py-3 text-center",
})`
  border-top: 1px dotted #26b7bc;
`;

export const LinkButton = styled(Link)`
  text-decoration: none;
`;

export const OpenButton = styled.button.attrs({
  className: "btn rounded-circle",
})`
  position: relative;
  width: 38px;
  height: 38px;
  border-color: #26b7bc;

  i {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #26b7bc;
  }

  :hover {
    background-color: #26b7bc;

    i {
      color: #fff;
    }
  }
`;

export const CheckDetailButton = styled(TdButton).attrs({
  className: "btn btn-warning rounded-pill border-0 px-4 text-white",
})`
  background-color: #ff9a3d;
`;

export const CheckoutButton = styled(OpenButton).attrs({
  className: "btn rounded-circle",
})`
  border-color: #fe868e;

  i {
    color: #fe868e;
  }

  :hover {
    background-color: #fe868e;
  }
`;

export const StyledTd = styled.td`
  white-space: nowrap;
  ${layout}
  ${space}
`;
