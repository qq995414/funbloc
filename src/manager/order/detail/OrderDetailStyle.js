import styled, { css } from "styled-components";
import { layout, position } from "styled-system";

const confirmIcon = "/images/manager/confirm_icon.png";
const confirmActiveIcon = "/images/manager/confirm_icon_active.png";

export const OrderDetailLabel = styled.div.attrs({
  className: "text-primary",
})`
  font-size: 14px;
`;
export const OrderDetailValue = styled.div.attrs({})`
  font-size: 15px;
  color: #747474;
`;

export const OrderDetailImgWrapper = styled.div.attrs({
  className: "rounded-1",
})`
  width: 100%;
  min-height: 194px;
  background-color: #f5feff;
  border: 2px dashed #cceff0;
`;
export const OrderConfirmationBody = styled.div.attrs({
  className: "d-flex",
})`
  padding: 33px 64px 49px;
`;

export const Dot = styled.div.attrs({
  className: "position-relative",
})`
  width: 25px;
  padding-bottom: 25px;
  background-repeat: no-repeat;
  background-image: url(${({ active }) =>
    active ? confirmActiveIcon : confirmIcon});
  background-size: 100% 100%;
  background-position: center center;
  z-index: 2;
`;

export const Line = styled.div.attrs({
  className: "rounded-2 position-absolute",
})`
  top: 50%;
  left: calc(3rem + 12.5px);
  width: calc(100% - 6rem - 25px);
  height: 15px;
  z-index: 0;
  transform: translateY(-50%);
  ${layout}
  ${position}
  ${({ active }) => {
    if (active) {
      return css`
        background-color: #44c3c7;
      `;
    }
    return css`
      background: linear-gradient(220.39deg, #c4c4c4 -82.61%, #eeeeee 116.08%);
    `;
  }}
`;
export const ConfirmationButton = styled.button.attrs(() => ({
  className: `btn btn-primary text-white`,
}))`
  width: 150px;
`;

export const ConfirmedButton = styled.button.attrs(() => ({
  className: `btn btn-secondary border-0 text-white disabled`,
}))`
  width: 150px;
  background-color: #c0c0c0 !important;
  opacity: 1 !important;
`;

export const DetailTitle = styled.div.attrs({
  className: "text-primary ps-4",
})`
  font-size: 16px;
  line-height: 38px;
  font-weight: bold;
`;

export const ConfirmationStatsWrapper = styled.div.attrs({
  className: "d-flex justify-content-center",
})`
  padding: 40px 55px;
`;
export const ConfirmationStats = styled.div`
  padding: 0 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  :nth-child(2) {
    border-left: 1px solid #747474;
    border-right: 1px solid #747474;
  }
`;

export const StatsNumber = styled.div.attrs({})`
  font-size: 24px;
  font-weight: bold;
  line-height: 33px;
  color: #747474;
`;
export const StatsLabel = styled.div.attrs({
  className: "text-primary",
})`
  font-size: 13px;
  white-space: nowrap;
`;
export const BuyerDetailHead = styled.div.attrs({
  className: "d-flex justify-content-between align-items-center",
})`
  padding: 20px 40px;
  background-color: #e9f8f8;

  .title {
    color: #747474;
    font-weight: bold;
  }

  .label {
    font-size: 15px;
  }

  .value {
    font-weight: 600;
    font-size: 15px;
    color: #747474;
  }
`;

export const BuyerTable = styled.table.attrs({
  className: "table table-borderless mb-0 text-center",
})``;

export const BuyerThead = styled.thead`
  background-color: #f4f4f4;
`;
export const BuyerTh = styled.th.attrs({
  className: "text-primary",
})`
  font-size: 13px;
`;
export const BuyerTd = styled.td.attrs({
  className: "py-4",
})`
  font-size: 12px;
  color: #747474;
`;

export const DeliveryWrapper = styled.div.attrs({
  className: "py-4 mx-auto",
})`
  width: 93%;
  border-top: 1px solid #747474;
  color: #747474;
  font-weight: 600;
  font-size: 13px;
`;
export const DeliveryTitle = styled.div.attrs({
  className: "text-primary",
})`
  font-size: 19px;
  line-height: 38px;
`;

export const DownloadButton = styled.button.attrs({
  className: "btn btn-danger text-white d-block mx-auto py-2",
})`
  margin-top: 55px;
  width: 170px;
`;

export const StyledTextarea = styled.textarea.attrs({
  className: "form-control border-primary my-4",
})`
  width: 100%;
  resize: none;
  font-size: 12px;
  color: #747474;
`;
