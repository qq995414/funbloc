import styled from "styled-components";
import { layout, space } from "styled-system";

export const CheckedIcon = styled.div.attrs({
  className: "text-center text-success-light",
})`
  font-size: 68px;
`;

export const CheckoutTitle = styled.div.attrs({
  className: "text-center",
})`
  margin-top: 10px;
  color: #000000;
  font-weight: 500;
  font-size: 30px;
  line-height: 76px;
`;
export const CheckoutText = styled.div.attrs({
  className: "",
})`
  color: #747474;
  font-weight: 400;
  font-size: 17px;
  line-height: 30px;
  ${layout}
  ${space}
`;

export const WarningText = styled.div.attrs({
  className: "text-center text-danger",
})`
  margin-top: 100px;
`;
export const BackButton = styled.button.attrs({
  className: "btn btn-danger text-white mx-3",
})`
  padding-left: 50px;
  padding-right: 50px;
  ${layout}
  ${space}
`;

export const CheckedButton = styled.button.attrs({
  className: "btn btn-primary text-white mx-3",
})`
  padding-left: 50px;
  padding-right: 50px;
`;

export const AccountLastFiveNumberWrapper = styled.div.attrs({})`
  padding: 50px 125px;
  @media (max-width: 40em) {
    padding: 50px 60px;
  }
  .title {
    font-weight: 700;
    font-size: 19px;
  }

  .title-lg {
    font-weight: 700;
    font-size: 30px;
    @media (max-width: 40em) {
      font-size: 24px;
    }
  }

  input.form-control {
    margin: 0 8px;
    width: 76px;
    padding: 6px 20px;
    color: #000000;
    font-weight: 500;
    font-size: 60px;
    background-color: #eeeeee;
    @media (max-width: 40em) {
      width: 40px;
      font-size: 36px;
    }
  }

  .label {
    color: #000000;
    font-weight: 500;
    font-size: 19px;
    @media (max-width: 40em) {
      font-size: 15px;
    }
  }

  .date-wrapper {
    input {
      border-radius: 5px;
      padding: 11px 26px;
      border: none;
      background-color: #eeeeee;
    }
  }

  .button-wrapper {
    margin-top: 80px;
  }
`;
