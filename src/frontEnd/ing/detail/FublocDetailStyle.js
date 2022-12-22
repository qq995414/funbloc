import styled from "styled-components";
import { color, flexbox, layout, space } from "styled-system";
import { StyledButton, StyledFlexBox } from "../../../styles/Shared.styles";

export const DetailWrapper = styled.div.attrs({})`
  padding: 32px 0;
`;

export const DetailTitleWrapper = styled.div.attrs({
  className: "d-flex align-items-center",
})`
  ${space}
  .num {
    font-weight: 600;
    font-size: 16px;
  }

  .name {
    color: #747474;
    font-weight: 500;
    font-size: 14px;
    margin-left: 8px;
  }
`;
export const StatsWrapper = styled.div.attrs({
  className: "d-flex border border-primary",
})`
  border-radius: 10px;
  align-items: center;
  ${space}
  ${layout}
  ${flexbox}
  .stats {
    text-align: center;
    padding: 0 20px;
    @media (max-width: 40em) {
      padding: 0;
    }
    .label {
      font-size: 12px;
    }
    &:nth-child(2) {
      border-left: 1px solid #aeaeae;
      border-right: 1px solid #aeaeae;
      @media (max-width: 40em) {
       border-left: none;
       border-right: none;
       border-top: 1px solid #aeaeae;
       border-bottom: 1px solid #aeaeae;
      }
}
    }

    .value {
      color: #747474;
      font-weight: 700;
      font-size: 24px;
    }

    .value-sm {
      color: #747474;
      font-weight: 700;
      font-size: 16px;
    }
  }
`;

export const InfoWrapper = styled(StyledFlexBox).attrs({
  className: "text-center",
})`
  .time {
    margin-bottom: 8px;
    font-size: 12px;
    color: #747474;
  }

  .btn {
    margin-bottom: 14px;
  }

  .goal {
    font-weight: 600;
    font-size: 15px;
  }
`;

export const EndFunblocButton = styled.button.attrs({
  className: "w-100 btn",
})`
  background-color: #ff9447;
  ${color}
  :hover,
  :focus {
    background-color: #ff9447;
    filter: contrast(120%);
    color: #fff;
  }
`;
export const DetailButton = styled.button.attrs({
  className: "w-100 btn btn-primary",
})`
  color: #ff9447;
  border: 1px solid #ff9447;
  background: #fff;
  :hover,
  :focus {
    background-color: #fff;
    filter: contrast(120%);
    color: #ff9447;
    border: 1px solid #ff9447;
  }
`;

export const CancelButton = styled.button.attrs({
  className: "w-100 btn btn-danger text-white",
})`
  background-color: #fe868e;
`;
export const CancelledButton = styled.button.attrs({
  className: "w-100 btn btn-danger text-white ",
})``;

export const Divider = styled.div.attrs({
  className: "w-100",
})`
  background-color: #26b7bc;
  height: 1px;
`;

export const OrderWrapper = styled.div.attrs({})`
  padding: 56px 0;
  ${space}
`;

export const AddNewOrderButton = styled.button.attrs({
  className: "btn text-primary d-flex align-items-center",
})`
  font-size: 1.5rem;
  border: 0;
  span {
    font-size: 13px;
  }
`;

export const Order = styled(StyledFlexBox).attrs({
  className: "mb-4",
})`
  padding: 20px 5px;
  width: 100%;
  background: #f5feff;
  border: 1px solid #26b7bc;
  border-radius: 9px;
  ${space}
  .col {
    text-align: center;
  }

  .btn {
    font-size: 12px;
  }

  .name {
    color: #747474;
    font-weight: 700;
    font-size: 14px;
  }

  .label {
    font-size: 13px;
  }

  .value {
    font-size: 13px;
    color: #747474;
  }
`;

export const ArrowButton = styled(StyledButton).attrs({
  className: "btn",
})`
  i {
    font-size: 2rem;
  }
`;
export const OrderDetailWrapper = styled.div.attrs({})`
  font-size: 13px;
  width: 100%;
  .header {
    background-color: #e6e6e6;
  }

  .body {
    :hover {
      background-color: rgba(38, 183, 188, 0.1);
    }
  }
`;

export const DeliveryWrapper = styled.div.attrs({})`
  padding: 32px 0 20px;

  .label {
    font-size: 13px;
  }

  .value-wrapper {
    border-left: 1px solid #26b7bc;
    @media (max-width: 40em) {
      border: 0;
    }
  }
`;

export const NewBuyerWrapper = styled.div.attrs({})`
  font-size: 13px;

  .title {
    font-weight: 600;
    font-size: 18px;
  }

  .save-btn {
    top: 0;
    right: 0;
    font-size: 13px;
    width: 130px;
  }

  .new-order {
    padding: 20px 18px;
    background-color: #f5feff;
    border-radius: 9px;
  }
`;

export const StyledInput = styled.input.attrs({
  className: "form-control border-primary",
})`
  margin-left: 15px;
  width: 80%;
  font-weight: 600;
  color: #747474;
  font-size: inherit;
  ${space}
  ${layout}
`;

export const ReceiveInput = styled(StyledInput)`
  margin-left: 0;
`;

export const DashedButton = styled.button.attrs({
  className: "btn w-100",
})`
  border: 1px dashed #bcbcbc;
  border-radius: 5px;
`;
export const StyledTextarea = styled.textarea.attrs({
  className: "form-control border-primary my-4",
})`
  width: 100%;
  resize: none;
  font-size: 12px;
  color: #747474;
`;