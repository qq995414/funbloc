import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchOpen } from "../../../api/Open";
import {
  ConditionItem,
  DeliveryDetail,
  NoteWrapper,
  Time,
  TimeTitle,
  TimeWrapper,
  Title,
} from "./OpenDetailStyle";
import { ContentWrapper } from "../../../component/StyledComponent";
import { funblocConditionType } from "../../../manager/funbloc/Funbloc";
import { numberWithThousandCommas } from "../../../helper/Helper";
import {
  Button,
  DefaultImgWrapper,
  OpenImgWrapper,
  ProductInfo,
  ProductIntroduce,
  ProductName,
  ProductPrice,
  ProductRow,
} from "../OpenStyle";
import ConfirmOpenModal from "../confirm/ConfirmOpen";
import {
  StyledFlexBox,
  StyledImage,
  StyledText,
} from "../../../styles/Shared.styles";
import { EndFunblocButton } from "../../ing/detail/FublocDetailStyle";

const defaultImg = "/images/front-end/upload_file.png";

const OpenDetail = () => {
  const navigate = useNavigate();
  const { openId } = useParams();

  const [openDetail, setOpenDetail] = useState(null);

  const [modal, setModal] = useState(false);

  useEffect(() => {
    fetchOpen(openId)
      .then((res) => {
        setOpenDetail(res.data);
      })
      .catch((error) => console.error(error));
  }, []);

  if (!openDetail) return null;

  return (
    <StyledFlexBox
      className="container-fluid pb-5"
      flexDirection="column"
      mt={[64, 40]}
      mx="auto"
    >
      <StyledFlexBox
        width={[44, 64]}
        height={[32, 44]}
        borderRadius="7.8px"
        justifyContent="center"
        alignItems="center"
        bg="#26b7bc"
        mr="20px"
        position={["absolute"]}
        left={[20, 45]}
        onClick={() => navigate(-1)}
        cursor="pointer"
        zIndex={2}
      >
        <StyledImage src="/images/front-end/arrow-back.svg" />
      </StyledFlexBox>
      <StyledFlexBox
        mt={[40, 0]}
        mb={[20, 0]}
        justifyContent={["space-between", "center"]}
        flexDirection={["row-reverse", "row"]}
        alignItems={["center", "unset"]}
      >
        <StyledFlexBox
          justifyContent="center"
          alignItems="center"
          position={["relative", "absolute"]}
          right={["unset", 45]}
          width={[96, 168]}
        >
          <EndFunblocButton onClick={() => setModal(true)} color="#fff">
            立即開團
          </EndFunblocButton>
        </StyledFlexBox>
        <Title mb={[0, 40]}>{openDetail.name}</Title>
      </StyledFlexBox>
      <ContentWrapper mx="auto" width={["100%", "100%", "50%"]}>
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
                {openDetail.start_date}
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
                {openDetail.end_date}
              </Time>
            </StyledFlexBox>
          </TimeWrapper>
          <div className="d-flex justify-content-center align-items-center mb-5">
            <ConditionItem>
              <StyledText className="label">成團條件</StyledText>
              <StyledText className="condition" fontSize={12}>
                {funblocConditionType[openDetail.condition_type]}
                {numberWithThousandCommas(openDetail.condition_number)}
                {openDetail.condition_unit}
              </StyledText>
            </ConditionItem>
            <ConditionItem>
              <div className="label">運送方式</div>
              <StyledText className="condition" fontSize={12}>
                {openDetail.delivery}
              </StyledText>
            </ConditionItem>
            <ConditionItem>
              <div className="label">出貨時間</div>
              <StyledText className="condition" fontSize={12}>
                {openDetail.delivery_time}
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
              {openDetail.delivery_info}
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
              {openDetail.note}
            </StyledFlexBox>
          </StyledFlexBox>
        </DeliveryDetail>
      </ContentWrapper>

      <Title className="mt-5 mb-3">商品資訊</Title>
      <ContentWrapper>
        <div className="container-fluid">
          {openDetail &&
            openDetail.products.map((product) => {
              return (
                <ProductRow
                  key={product.id}
                  py={[22, 24, 36]}
                  justifyContent="space-between"
                  flexDirection={["column", "row"]}
                >
                  <StyledFlexBox>
                    <div>
                      {product.photo ? (
                        <OpenImgWrapper width={[164, 178]} mr={[20, 20, 43]}>
                          <img
                            src={product.photo}
                            className="w-100 d-block mx-auto"
                            alt=""
                          />
                        </OpenImgWrapper>
                      ) : (
                        <DefaultImgWrapper width={[164, 178]} mr={[20, 20, 43]}>
                          <img
                            src={defaultImg}
                            className="w-100 d-block mx-auto"
                            alt=""
                          />
                        </DefaultImgWrapper>
                      )}
                    </div>
                    <StyledFlexBox flexDirection="column" width={[90, 90, 132]}>
                      <ProductName>{product.name}</ProductName>
                      <div className="row align-items-center">
                        <div>
                          <ProductInfo>
                            類別：
                            <span className="text-danger">
                              {product.typeName}({product.subTypeName})
                            </span>
                          </ProductInfo>
                          <ProductInfo>
                            型號/口味：
                            <span className="text-danger">{product.model}</span>
                          </ProductInfo>
                          <ProductInfo>
                            產地：
                            <span className="text-danger">
                              {product.origin}
                            </span>
                          </ProductInfo>
                          <ProductInfo>
                            保存期限：
                            <span className="text-danger">
                              {product.expire}
                            </span>
                          </ProductInfo>
                        </div>
                      </div>
                    </StyledFlexBox>
                  </StyledFlexBox>
                  <StyledFlexBox mt={[10, 0, 0]}>
                    <div>
                      <ProductIntroduce width={[182, 217, 360]}>
                        {product.introduce}
                      </ProductIntroduce>
                    </div>
                    <StyledFlexBox
                      flexDirection={["column", "column", "row"]}
                      ml={20}
                    >
                      <StyledFlexBox
                        flexDirection="column"
                        mb={[24, 24, 0]}
                        mr={[0, 20, 20]}
                      >
                        <ProductPrice
                          flexDirection="column"
                          py={["7px", "7px", "14px"]}
                          width={[64, 64, 108]}
                        >
                          <div>商品進價</div>
                          <div className="text-danger">{product.quote}</div>
                        </ProductPrice>
                      </StyledFlexBox>
                      <div>
                        <ProductPrice
                          flexDirection="column"
                          py={["7px", "7px", "14px"]}
                          width={[64, 64, 108]}
                        >
                          <div>官方售價</div>
                          <div className="text-danger">
                            {product.pageShow ? product.price : "無零售價"}
                          </div>
                        </ProductPrice>
                      </div>
                    </StyledFlexBox>
                  </StyledFlexBox>
                </ProductRow>
              );
            })}
        </div>
      </ContentWrapper>
      {modal && (
        <ConfirmOpenModal close={() => setModal(false)} openId={openId} />
      )}
    </StyledFlexBox>
  );
};

export default OpenDetail;
