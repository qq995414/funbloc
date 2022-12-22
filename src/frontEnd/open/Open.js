import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ContentWrapper,
  PaginationWrapper,
  SearchIcon,
  SearchInput,
} from "../../component/StyledComponent";
import {
  DefaultImgWrapper,
  ItemButton,
  ItemContentTitle,
  ItemContentWrapper,
  OpenImgWrapper,
  OpenItemWrapper,
  OpenWrapper,
  StyledLabel,
  StyledSelect,
} from "./OpenStyle";
import { fetchFunblocTypes, fetchOpens } from "../../api/Open";
import Pagination from "../../manager/components/pagination/Pagination";
import { funblocConditionType } from "../../manager/funbloc/Funbloc";
import { numberWithThousandCommas } from "../../helper/Helper";
import ConfirmOpenModal from "./confirm/ConfirmOpen";
import { StyledFlexBox } from "../../styles/Shared.styles";

const defaultImg = "/images/front-end/upload_file.png";

const Open = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [inputKeyword, setInputKeyword] = useState("");
  const [keyword, setKeyword] = useState("");

  const [pageObject, setPageObject] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const [opens, setOpens] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [modal, setModal] = useState(false);

  const [funblocTypes, setFunblocTypes] = useState([]);

  const [currentType, setCurrentType] = useState("all");
  const [currentSubType, setCurrentSubType] = useState("all");

  const onTypeChange = (e) => {
    const type = e.target.value;
    setCurrentType(type);
  };

  useEffect(() => {
    setIsLoading(true);

    const type = currentType === "all" ? undefined : currentType;
    const subType = currentSubType === "all" ? undefined : currentSubType;

    fetchOpens({ page: currentPage, keyword, type: type, subType })
      .then((res) => {
        setOpens(res.data);
        setPageObject(res.meta);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentPage, keyword, currentType, currentSubType]);

  useEffect(() => {
    fetchFunblocTypes({ page: 1, perPage: 100 })
      .then((res) => {
        setFunblocTypes(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    setCurrentSubType("all");
  }, [currentType]);

  return (
    <StyledFlexBox
      className="container-fluid pb-5"
      px={[15, "3rem"]}
      flexDirection="column"
    >
      <StyledFlexBox
        className="mt-5 mb-4"
        flexDirection={["column", "row"]}
        alignItems={["initial", "flex-end", "center"]}
        justifyContent={["initial", "space-between"]}
      >
        <div className="col-4 d-flex align-items-center">
          <StyledFlexBox
            alignItems={["initial", "initial", "center"]}
            flexGrow={1}
            ml={[0, 0, 20]}
            flexDirection={["column", "column", "row"]}
          >
            <StyledLabel mr={10} mb={["8px", "8px", 0]}>
              請選擇商品類別
            </StyledLabel>
            <StyledSelect
              disabled={isLoading}
              value={currentType}
              onChange={onTypeChange}
            >
              <option value={"all"}>全部</option>
              {funblocTypes.map((type) => {
                return (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                );
              })}
            </StyledSelect>
          </StyledFlexBox>
          <StyledFlexBox
            alignItems={["initial", "initial", "center"]}
            flexGrow={1}
            ml={[0, 0, 20]}
            flexDirection={["column", "column", "row"]}
          >
            <StyledLabel mr={10} mb={["8px", "8px", 0]}>
              請選擇次分類
            </StyledLabel>
            <StyledSelect
              disabled={isLoading}
              value={currentSubType}
              onChange={(e) => setCurrentSubType(e.target.value)}
            >
              <option value={"all"}>全部</option>
              {funblocTypes
                .find((item) => item.id.toString() === currentType)
                ?.sub.map((type) => {
                  return (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  );
                })}
            </StyledSelect>
          </StyledFlexBox>
        </div>
        <StyledFlexBox
          className="col-2 position-relative"
          width={["100%", 189]}
          mt={[20, 0]}
        >
          <SearchInput
            type="text"
            value={inputKeyword}
            onChange={(e) => setInputKeyword(e.target.value)}
            placeholder="關鍵字搜尋..."
          />
          <SearchIcon onClick={() => setKeyword(inputKeyword)}>
            <i className="bi bi-search" />
          </SearchIcon>
        </StyledFlexBox>
      </StyledFlexBox>

      <ContentWrapper>
        <OpenWrapper>
          {opens.map((open) => {
            return (
              <OpenItemWrapper
                key={open.id}
                py={20}
                alignItems={["flex-end", "center"]}
                justifyContent="space-around"
              >
                {open.photo !== "" ? (
                  <OpenImgWrapper flexBasis={[0, 168, 221]}>
                    <img
                      src={open.photo}
                      className="w-50 d-block mx-auto"
                      alt=""
                    />
                  </OpenImgWrapper>
                ) : (
                  <DefaultImgWrapper flexBasis={[0, 168, 221]}>
                    <img
                      src={defaultImg}
                      className="w-50 d-block mx-auto"
                      alt=""
                    />
                  </DefaultImgWrapper>
                )}
                <ItemContentWrapper flexBasis={[160, 214, 240]}>
                  <ItemContentTitle>{open.name}</ItemContentTitle>
                  <div>
                    <div>
                      成團條件：{funblocConditionType[open.condition_type]}
                      {numberWithThousandCommas(open.condition_number)}
                      {open.condition_unit}
                    </div>
                    <div>結束時間：{open.end_date}</div>
                    <div>出貨時間：{open.delivery_time}</div>
                  </div>
                </ItemContentWrapper>
                <StyledFlexBox
                  flexDirection={["column", "row"]}
                  flexBasis={[60, 200, 324]}
                  justifyContent={["initial", "space-evenly"]}
                >
                  <div>
                    <ItemButton
                      className="bg-danger"
                      onClick={() => navigate(`/open/${open.id}`)}
                      display={["none", "none", "block"]}
                    >
                      查看團購資訊
                    </ItemButton>
                    <ItemButton
                      className="bg-danger"
                      onClick={() => navigate(`/open/${open.id}`)}
                      display={["block", "block", "none"]}
                      width={80}
                      m={0}
                    >
                      查看商品
                    </ItemButton>
                  </div>
                  <div>
                    <ItemButton
                      className="bg-warning"
                      onClick={() => {
                        setOpenId(open.id);
                        setModal(true);
                      }}
                      display={["none", "none", "block"]}
                    >
                      立即開團賺外快
                    </ItemButton>
                    <ItemButton
                      className="bg-warning"
                      mt={["8px", 0]}
                      onClick={() => {
                        setOpenId(open.id);
                        setModal(true);
                      }}
                      display={["block", "block", "none"]}
                      width={80}
                    >
                      立即開團
                    </ItemButton>
                  </div>
                </StyledFlexBox>
              </OpenItemWrapper>
            );
          })}
        </OpenWrapper>
      </ContentWrapper>

      <PaginationWrapper>
        <Pagination
          pageObject={pageObject}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </PaginationWrapper>

      {modal && (
        <ConfirmOpenModal
          close={() => {
            setOpenId(null);
            setModal(false);
          }}
          openId={openId}
        />
      )}
    </StyledFlexBox>
  );
};

export default Open;
