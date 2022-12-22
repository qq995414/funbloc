import React, { useEffect, useState } from "react";
import Dialog from "../../../component/dialog/Dialog";
import {
  DialogButton,
  DialogContentWrapper,
} from "../../../component/dialog/DialogStyle";
import { fetchOpen, setOpen } from "../../../api/Open";
import {
  ConfirmOpenWrapper,
  ConfirmText,
  StyledInput,
  Title,
} from "./ConfirmOpenStyle";
import {
  DefaultImgWrapper,
  OpenImgWrapper,
  ProductName,
  ProductPrice,
} from "../OpenStyle";
import { useNavigate } from "react-router-dom";
import { StyledFlexBox, StyledText } from "../../../styles/Shared.styles";
import {
  ConditionItem,
  DeliveryDetail,
  Time,
  TimeTitle,
  TimeWrapper,
} from "../detail/OpenDetailStyle";
import { numberWithThousandCommas } from "../../../helper/Helper";
import { funblocConditionType } from "../../../manager/funbloc/Funbloc";
import { ContentWrapper } from "../../../component/StyledComponent";

const defaultImg = "/images/front-end/upload_file.png";

const ConfirmOpenModal = ({ close, openId }) => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [info, setInfo] = useState({});

  const setPrice = (id, price) => {
    setProducts((prev) =>
      prev.map((product) => {
        if (product.id === id) {
          return { ...product, myPrice: price };
        }
        return product;
      })
    );
  };

  const submit = () => {
    setIsLoading(true);

    const _product = products.map((product) => ({
      id: product.id,
      price: product.myPrice,
    }));
    setOpen(openId, _product)
      .then(() => {
        close();
        navigate("/ing");
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchOpen(openId)
      .then((res) => {
        setInfo(res.data);
        setProducts(
          res.data.products.map((product) => ({ ...product, myPrice: 0 }))
        );
      })
      .catch((error) => console.error(error));
  }, [openId]);

  return (
    <Dialog onClose={close}>
      <DialogContentWrapper width={1112}>
        <ConfirmOpenWrapper
          p={["40px 20px", "48px 26px", "80px 115px"]}
          maxHeight="100vh"
          overflowY="auto"
        >
          <StyledFlexBox
            mb={[20, 40]}
            color="#26b7bc"
            fontSize={25}
            fontWeight={600}
            justifyContent="center"
          >
            {info.name}
          </StyledFlexBox>
          <ContentWrapper mx="auto" width={["100%", "100%", 632]}>
            <DeliveryDetail p={["31px 24px", "40px 30px 20px"]}>
              <TimeWrapper justifyContent={["center", "space-evenly"]}>
                <StyledFlexBox
                  flexDirection={["column", "row", "row"]}
                  alignItems="center"
                >
                  <TimeTitle
                    display={["flex", "block"]}
                    justifyContent={["center", "initial"]}
                    mr={[0, 12]}
                  >
                    <div>開始</div>
                    <div>時間</div>
                  </TimeTitle>
                  <Time mt={["8px", 0]} fontSize={["12px", "16px"]}>
                    {info.start_date}
                  </Time>
                </StyledFlexBox>
                <StyledFlexBox
                  flexDirection={["column", "row", "row"]}
                  alignItems="center"
                >
                  <TimeTitle
                    display={["flex", "block"]}
                    justifyContent={["center", "initial"]}
                    mr={[0, 12]}
                  >
                    <div>結束</div>
                    <div>時間</div>
                  </TimeTitle>
                  <Time mt={["8px", 0]} fontSize={["12px", "16px"]}>
                    {info.end_date}
                  </Time>
                </StyledFlexBox>
              </TimeWrapper>
              <div className="d-flex justify-content-center align-items-center mb-5">
                <ConditionItem>
                  <StyledText className="label">成團條件</StyledText>
                  <StyledText className="condition" fontSize={12}>
                    {funblocConditionType[info.condition_type]}
                    {numberWithThousandCommas(info.condition_number)}
                    {info.condition_unit}
                  </StyledText>
                </ConditionItem>
                <ConditionItem>
                  <div className="label">運送方式</div>
                  <StyledText className="condition" fontSize={12}>
                    {info.delivery}
                  </StyledText>
                </ConditionItem>
                <ConditionItem>
                  <div className="label">出貨時間</div>
                  <StyledText className="condition" fontSize={12}>
                    {info.delivery_time}
                  </StyledText>
                </ConditionItem>
              </div>
              <StyledFlexBox
                border="0.5px dashed #26b7bc"
                borderRadius="6px"
                bg="#eef4f3"
                height={42}
                width="100%"
                pl={29}
                alignItems="center"
                mb={12}
              >
                <StyledFlexBox width={80} color="#26b7bc" fonSize={12}>
                  配送資訊
                </StyledFlexBox>
                <StyledFlexBox color="#747474" fonSize={12}>
                  {info.delivery_info}
                </StyledFlexBox>
              </StyledFlexBox>
              <StyledFlexBox
                border="0.5px dashed #26b7bc"
                borderRadius="6px"
                bg="#eef4f3"
                height={42}
                width="100%"
                pl={29}
                alignItems="center"
              >
                <StyledFlexBox width={80} color="#26b7bc" fonSize={12}>
                  備註
                </StyledFlexBox>
                <StyledFlexBox color="#747474" fonSize={12}>
                  {info.note}
                </StyledFlexBox>
              </StyledFlexBox>
            </DeliveryDetail>
          </ContentWrapper>
          <StyledFlexBox height={330} overflowY="auto" flexDirection="column">
            {products.map((product) => {
              return (
                <StyledFlexBox>
                  <StyledFlexBox
                    alignItems={["initial", "center"]}
                    display={["flex", "none"]}
                    mr={[12, 0]}
                  >
                    {product.photo ? (
                      <OpenImgWrapper
                        width={[95, 120, 178]}
                        height={80}
                        alignItems="center"
                      >
                        <img
                          src={product.photo}
                          className="w-100 d-block mx-auto"
                          alt=""
                        />
                      </OpenImgWrapper>
                    ) : (
                      <DefaultImgWrapper width={[95, 120, 178]} height={80}>
                        <img
                          src={defaultImg}
                          className="w-100 d-block mx-auto"
                          alt=""
                        />
                      </DefaultImgWrapper>
                    )}
                  </StyledFlexBox>
                  <StyledFlexBox
                    className="mb-3"
                    key={"modal-" + product.id}
                    alignItems={["initial", "center"]}
                    justifyContent="space-between"
                    flexDirection={["column", "row"]}
                    width="100%"
                  >
                    {/* image */}
                    <StyledFlexBox
                      alignItems="center"
                      display={["none", "flex"]}
                    >
                      {product.photo ? (
                        <OpenImgWrapper width={[95, 120, 178]}>
                          <img
                            src={product.photo}
                            className="w-50 d-block mx-auto"
                            alt=""
                          />
                        </OpenImgWrapper>
                      ) : (
                        <DefaultImgWrapper width={[95, 120, 178]}>
                          <img
                            src={defaultImg}
                            className="w-100 d-block mx-auto"
                            alt=""
                          />
                        </DefaultImgWrapper>
                      )}
                    </StyledFlexBox>
                    <StyledFlexBox
                      width={["unset", "45%"]}
                      flexDirection={["column", "row"]}
                      alignItems={["baseline", "center"]}
                      justifyContent={["space-between"]}
                    >
                      <ProductName
                        className="text-center"
                        width={["unset", 68, 145]}
                        mr={[0, 24]}
                        mb={[12, 0]}
                        textAlign={["unset", "center"]}
                      >
                        {product.name}
                      </ProductName>
                      {/* 進價及售價 */}
                      <StyledFlexBox alignItems="center" mb={[12, 0]}>
                        <div>
                          <ProductPrice
                            flexDirection="column"
                            py={14}
                            mr={[12, 20, 26]}
                            px={[12, 14, 20]}
                          >
                            <div>商品進價</div>
                            <div className="text-danger mt-3">
                              {product.quote}
                            </div>
                          </ProductPrice>
                        </div>
                        <div>
                          <ProductPrice
                            flexDirection="column"
                            py={14}
                            px={[12, 14, 20]}
                          >
                            <div>官方售價</div>
                            <div className="text-danger mt-3">
                              {product.price}
                            </div>
                          </ProductPrice>
                        </div>
                      </StyledFlexBox>
                    </StyledFlexBox>
                    <div>
                      <StyledFlexBox width={120} flexDirection="column">
                        <div className="mb-3">我的售價</div>
                        <div className="d-flex">
                          <StyledInput
                            type="text"
                            value={product.myPrice}
                            onChange={(e) =>
                              setPrice(
                                product.id,
                                e.target.value.replace(/\D+/g, "")
                              )
                            }
                          />
                          <div className="align-self-end ms-2">元</div>
                        </div>
                      </StyledFlexBox>
                    </div>
                  </StyledFlexBox>
                </StyledFlexBox>
              );
            })}
          </StyledFlexBox>
          <ConfirmText> 確定是否立即開團？</ConfirmText>
          <StyledFlexBox color="#ff5a79" fontSize={14} justifyContent="center">
            開立販團時僅會帶入「我的售價>0」的商品，開團後如需增加該團中「未設定售價」的商品，請先取消原成立飯糰後再重新開立新的販團
          </StyledFlexBox>
          <StyledFlexBox className="mt-3 text-center" justifyContent="center">
            <DialogButton className="btn-secondary cancel" onClick={close}>
              取消
            </DialogButton>
            <DialogButton
              className="btn-primary"
              disabled={isLoading}
              onClick={submit}
            >
              確認
            </DialogButton>
          </StyledFlexBox>
        </ConfirmOpenWrapper>
      </DialogContentWrapper>
    </Dialog>
  );
};

export default ConfirmOpenModal;
