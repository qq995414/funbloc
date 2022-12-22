import styled from "styled-components";
import { layout } from "styled-system";

export const HomeTitle = styled.div.attrs({
  className: "text-primary",
})`
  font-size: 21px;
  font-weight: 600;
`;

export const StyledDate = styled.div.attrs({
  className: "form-control border-primary d-flex align-items-center",
})`
  width: 140px;
  ${layout}
  i {
    margin-right: 1rem;
  }

  input {
    border: none;
    width: 100%;
    color: #747474;
    font-size: 12px;
    &:focus-visible,
    &:focus {
      outline: none;
      border: none;
    }
  }
`;

export const AllFunblocButton = styled.div.attrs({
  className: "border rounded-2 border-primary bg-white py-2 px-3 ms-3",
})`
  color: #747474;
  font-size: 15px;
  cursor: pointer;
`;

export const ConfirmationStatsWrapper = styled.div.attrs({
  className: "d-flex justify-content-center",
})`
  padding: 40px 55px;
`;
export const ConfirmationStats = styled.div`
  padding: 0 60px;

  :not(:first-child) {
    border-left: 1px solid #26b7bc;
  }
`;
export const StatsLabel = styled.div.attrs({})`
  color: #747474;
  font-size: 19px;
  margin-bottom: 10px;
`;
export const StatsNumber = styled.div.attrs({
  className: "text-black",
})`
  font-size: 26px;
  font-weight: bold;
  line-height: 33px;
`;
export const OffsetCanvasCard = styled.div.attrs({})`
  margin-left: 1rem;
  width: calc(100% - 1rem);
  padding: 11px 30px;
  background: #f5f5f5;
  border: 1px solid #bcbcbc;
  border-radius: 5px;
  cursor: pointer;
  position: relative;
  .name {
    display: flex;
    color: #000;
    font-size: 16px;

    span {
      margin-left: 8px;
      color: #747474;
    }
  }

  .phone,
  .address {
    font-size: 15px;
    color: #c0c0c0;
  }
`;

export const OffsetCanvasCreateCard = styled.div.attrs({
  className: "container",
})`
  width: 100%;
  padding: 11px 30px;
  background: #f5feff;
  border: 1px solid #26b7bc;
  border-radius: 5px;
  cursor: pointer;

  .name {
    display: flex;
    color: #000;
    font-size: 16px;

    span {
      margin-left: 8px;
      color: #747474;
    }
  }

  .phone,
  .address {
    font-size: 15px;
    color: #c0c0c0;
  }
`;
