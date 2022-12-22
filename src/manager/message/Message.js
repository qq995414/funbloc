import React, { useEffect, useState } from "react";
import { NavButton } from "./MessageStyle";
import {
  CheckButton,
  PaginationWrapper,
  SearchIcon,
  SearchInput,
} from "../../component/StyledComponent";
import Table from "../../component/table/Table";
import { Tr, Notice } from "../../component/table/TableStyle";
import Pagination from "../components/pagination/Pagination";
import { fetchComments, fetchWishes } from "../../api/message/ManagerMessage";
import Loading from "../components/loading/Loading";
import { useLocation } from "react-router-dom";
import { StyledFlexBox } from "../../styles/Shared.styles";

export const MessageTab = {
  feedback: {
    key: 1,
    text: "意見與回饋",
  },
  wish: {
    key: 2,
    text: "商品許願",
  },
};

const Comments = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [pageObject, setPageObject] = useState({
    totalPage: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const [inputKeyword, setInputKeyword] = useState("");
  const [keyword, setKeyword] = useState("");
  const [comments, setComments] = useState([]);

  const ths = ["訊息時間", "小販名稱", "訊息內容", "操作"];

  useEffect(() => {
    setIsLoading(true);
    fetchComments({ page: currentPage, keyword })
      .then((res) => {
        setComments(res.data);
        setPageObject(res.meta);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentPage, keyword]);

  return (
    <>
      <div className="row mb-4 align-items-center">
        <div className="ms-auto col-2 position-relative">
          <SearchInput
            type="text"
            value={inputKeyword}
            onChange={(e) => setInputKeyword(e.target.value)}
            placeholder="關鍵字搜尋..."
          />
          <SearchIcon onClick={() => setKeyword(inputKeyword)}>
            <i className="bi bi-search" />
          </SearchIcon>
        </div>
      </div>
      <Table ths={ths}>
        {comments.length > 0 ? (
          comments.map((comment) => {
            return (
              <Tr key={comment.id}>

                <td className="flex"><Notice show={comment.isRead} />{comment.created_at}</td>
                <td>{comment.hawkerName}</td>
                <td>{comment.contact}</td>
                <td>
                  <CheckButton
                    className="btn btn-success rounded-pill border-0 px-4"
                    to={`/manager/message/comment/${comment.id}`}
                  >
                    查看
                  </CheckButton>
                </td>
              </Tr>
            );
          })
        ) : (
          <Tr>
            <td colSpan={ths.length}>{isLoading ? <Loading /> : "無資料"}</td>
          </Tr>
        )}
      </Table>
      <PaginationWrapper>
        <Pagination
          pageObject={pageObject}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </PaginationWrapper>
    </>
  );
};

const Wishes = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [pageObject, setPageObject] = useState({
    totalPage: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const [inputKeyword, setInputKeyword] = useState("");
  const [keyword, setKeyword] = useState("");
  const [wishes, setWishes] = useState([]);

  const ths = ["訊息時間", "小販名稱", "訊息內容", "操作"];

  useEffect(() => {
    setIsLoading(true);
    fetchWishes({ page: currentPage, keyword })
      .then((res) => {
        setWishes(res.data);
        setPageObject(res.meta);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentPage, keyword]);

  return (
    <>
      <div className="row mb-4 align-items-center">
        <div className="ms-auto col-2 position-relative">
          <SearchInput
            type="text"
            value={inputKeyword}
            onChange={(e) => setInputKeyword(e.target.value)}
            placeholder="關鍵字搜尋..."
          />
          <SearchIcon onClick={() => setKeyword(inputKeyword)}>
            <i className="bi bi-search" />
          </SearchIcon>
        </div>
      </div>
      <Table ths={ths}>
        {wishes.length > 0 ? (
          wishes.map((wish) => {
            return (
              <Tr key={wish.id}>
                <td className="flex"><Notice show={wish.isRead} />{wish.created_at}</td>
                <td>{wish.hawkerName}</td>
                <td>{wish.contact}</td>
                <td>
                  <CheckButton
                    className="btn btn-success rounded-pill border-0 px-4"
                    to={`/manager/message/wish/${wish.id}`}
                  >
                    查看
                  </CheckButton>
                </td>
              </Tr>
            );
          })
        ) : (
          <Tr>
            <td colSpan={ths.length}>{isLoading ? <Loading /> : "無資料"}</td>
          </Tr>
        )}
      </Table>
      <PaginationWrapper>
        <Pagination
          pageObject={pageObject}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </PaginationWrapper>
    </>
  );
};

const Message = () => {
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(
    location.state?.tab || MessageTab.feedback.key
  );

  const onChangeActiveTab = (stats) => {
    setActiveTab(stats);
  };

  console.log(location);

  return (
    <div className="container-fluid p-5">
      <div className="d-flex justify-content-between">
        <nav className="nav">
          {Object.entries(MessageTab).map(([_, value]) => {
            return (
              <NavButton
                className={`nav-link ${activeTab === value.key ? "active" : ""
                  }`}
                onClick={() => onChangeActiveTab(value.key)}
              >
                {value.text}
              </NavButton>
            );
          })}
        </nav>
      </div>
      {activeTab === MessageTab.feedback.key && <Comments />}

      {activeTab === MessageTab.wish.key && <Wishes />}
    </div>
  );
};

export default Message;
