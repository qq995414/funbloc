import styled from "styled-components";
import { space, layout, display, flexbox, typography } from "styled-system";
import { StyledFlexBox } from "../../styles/Shared.styles";

export const OpenWrapper = styled.div.attrs({})`
  ${space}
`;

export const OpenItemWrapper = styled(StyledFlexBox)`
  ${space}
  :hover {
    background-color: #f5feff;
  }
`;
export const OpenImgWrapper = styled.div.attrs({})`
  border: 2px dotted #cceff0;
  display: flex;
  ${flexbox}
  ${layout}
  ${space}
`;

export const DefaultImgWrapper = styled(OpenImgWrapper)`
  padding: 40px 70px;
  background-color: #f5feff;
  ${layout}
`;
export const ItemContentWrapper = styled.div`
  color: #747474;
  font-size: 14px;
  line-height: 27px;
  ${flexbox}
`;

export const ItemContentTitle = styled.div.attrs({
  className: "text-primary",
})`
  margin-bottom: 21px;
  font-weight: 700;
  font-size: 17px;
  line-height: 19px;
`;
export const ItemButton = styled.button.attrs({
  className: "btn text-white",
})`
  font-weight: 500;
  font-size: 13px;
  line-height: 24px;
  width: 132px;
  border-radius: 379.602px;
  ${layout}
  ${display}
  ${space}
`;
export const ProductRow = styled(StyledFlexBox)`
  padding: 20px 0;
  color: #747474;
  border-bottom: 1px dashed #9b9b9b;
`;

export const ProductName = styled.div.attrs({
  className: "text-primary",
})`
  margin-bottom: 18px;
  font-weight: 600;
  font-size: 17px;
  line-height: 19px;
  ${layout}
  ${space}
  ${typography}
`;
export const ProductInfo = styled.div`
  font-weight: 500;
  font-size: 13px;
  line-height: 25px;
`;
export const ProductIntroduce = styled.div.attrs({})`
  font-weight: 500;
  font-size: 13px;
  color: #747474;
  line-height: 27px;
  ${layout}
`;

export const ProductPrice = styled(StyledFlexBox).attrs({
  className: "text-center",
})`
  background: rgba(196, 196, 196, 0.12);
  border-radius: 14px;
  font-weight: 500;
  font-size: 14px;
  color: #747474;
  ${layout}
  ${space}
`;
export const Button = styled.button.attrs({
  className: "btn text-white mx-3",
})`
  width: 168px;
  border-radius: 7px;
`;

export const StyledSelectWrapper = styled.div.attrs({
  className: "d-flex flex-grow-1 mx-2 align-items-center",
})``;

export const StyledLabel = styled.label.attrs({})`
  width: 150px;
  color: #747474;
  font-size: 15px;
  white-space: nowrap;
  ${space}
  ${layout}
`;
export const StyledSelect = styled.select.attrs({
  className: "form-select border-primary",
})``;
