import { useState } from "react";
import { ContentWrapper } from "../../../../component/StyledComponent";
import { numberWithThousandCommas } from "../../../../helper/Helper";
import { StyledButton } from "../../../../styles/Shared.styles";
import {
  BuyerDetailHead,
  BuyerTable,
  BuyerTd,
  BuyerTh,
  BuyerThead,
} from "../OrderDetailStyle";

const Overview = ({ orders = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <ContentWrapper>
      <BuyerDetailHead>
        <div className="title">訂購總覽</div>
        <div className="d-flex align-items-center">
          {isOpen ? (
            <StyledButton className="btn" onClick={() => setIsOpen(false)}>
              <i className="bi bi-arrow-up-circle-fill text-primary" />
            </StyledButton>
          ) : (
            <StyledButton className="btn" onClick={() => setIsOpen(true)}>
              <i className="bi bi-arrow-down-circle-fill text-primary" />
            </StyledButton>
          )}
        </div>
      </BuyerDetailHead>
      {isOpen && (
        <>
          <BuyerTable>
            <BuyerThead>
              <tr>
                <BuyerTh>商品名稱</BuyerTh>
                <BuyerTh>進價</BuyerTh>
                <BuyerTh>團購主成本</BuyerTh>
                <BuyerTh>團購主售價</BuyerTh>
                <BuyerTh>定價</BuyerTh>
                <BuyerTh>數量</BuyerTh>
                <BuyerTh>進價小計</BuyerTh>
                <BuyerTh>成本小計</BuyerTh>
                <BuyerTh>售價小計</BuyerTh>
              </tr>
            </BuyerThead>
            <tbody>
              {Object.entries(orders).map(([key, product]) => {
                return (
                  <tr key={key}>
                    <BuyerTd>{product.productName}</BuyerTd>
                    <BuyerTd>
                      {numberWithThousandCommas(product.quoteReal)}
                    </BuyerTd>
                    <BuyerTd>{numberWithThousandCommas(product.quote)}</BuyerTd>
                    <BuyerTd>
                      {numberWithThousandCommas(product.myPrice)}
                    </BuyerTd>
                    <BuyerTd>{numberWithThousandCommas(product.price)}</BuyerTd>
                    <BuyerTd>
                      {numberWithThousandCommas(product.amount)}
                    </BuyerTd>
                    <BuyerTd>
                      {numberWithThousandCommas(product.totalQuoteReal)}
                    </BuyerTd>
                    <BuyerTd>
                      {numberWithThousandCommas(product.totalQuote)}
                    </BuyerTd>
                    <BuyerTd>
                      {numberWithThousandCommas(product.totalMyPrice)}
                    </BuyerTd>
                  </tr>
                );
              })}
            </tbody>
          </BuyerTable>
        </>
      )}
    </ContentWrapper>
  );
};

export default Overview;
