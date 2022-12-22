import styled from "styled-components";
import { display, flexbox, space, typography } from "styled-system";

export const Title = styled.div.attrs({
  className: "text-primary text-center",
})`
  font-size: 25px;
  font-weight: 700;
  ${space}
`;

export const DeliveryDetail = styled.div.attrs({})`
  padding: 40px 30px 20px;
  ${space}
`;

export const TimeWrapper = styled.div.attrs({
  className: "d-flex mb-5",
})`
  padding: 20px 0;
  background-color: #c4c4c41f;
  border-radius: 14px;
  ${flexbox}
`;

export const TimeTitle = styled.div.attrs({
  className: "text-primary",
})`
  font-weight: 700;
  font-size: 15px;
  line-height: 1.2;
  ${display}
  ${flexbox}
  ${space}
`;
export const Time = styled.div.attrs({})`
  font-weight: 700;
  font-size: 17px;
  line-height: 20px;
  color: #747474;
  text-align: center;
  ${space}
  ${typography}
`;
export const ConditionItem = styled.div.attrs({})`
  width: 33.33333%;
  text-align: center;

  :nth-child(2) {
    border-left: 1px dashed #747474;
    border-right: 1px dashed #747474;
  }

  .label {
    font-size: 14px;
    color: #000;
  }

  .condition {
    margin-top: 10px;
    color: #747474;

    span {
      font-size: 22px;
    }
  }
`;

export const NoteWrapper = styled.div.attrs({
  className: "text-center",
})`
  background: #eef4f3;
  border: 1px dashed #26b7bc;
  border-radius: 6px;
  padding: 13px 0;
  color: #747474;
`;
