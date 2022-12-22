import React, { useCallback, useEffect, useState } from "react";
import {
  CheckButton,
  ContentWrapper,
  NavButton,
  NavRouteButton,
  PaginationWrapper,
  SearchIcon,
  SearchInput,
} from "../../component/StyledComponent";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AdminContentWrapper,
  Label,
  MessageSendButton,
  MessageTitle,
  MessageWrapper,
  NoteMessage,
  RecordTitle,
  RecordWrapper,
  StyledDate,
  StyledSelect,
} from "./AdminStyle";
import { SingleDateWithTimePicker } from "../../component/datepicker/DatePicker";
import Table from "../../component/table/Table";
import {
  fetchAdminAccounts,
  fetchNotifies,
  sendNotify,
} from "../../api/admin/ManagerAdmin";
import { Tr } from "../../component/table/TableStyle";
import Loading from "../components/loading/Loading";
import Pagination from "../components/pagination/Pagination";
import { fetchHawkerTypes } from "../../api/hawker/ManagerHawker";
import MyCKEditor from "../components/editor/MyEditor";
import { titleToClass } from "../../frontEnd/message/Message";
import moment from "moment";

const message = "message";
export const AdminSetting = "setting";

const adminStatsMap = {
  0: {
    stats: 0,
    text: "停用",
    icon: <i className="bi bi-slash-circle" />,
    color: "#FE868E",
  },
  1: {
    stats: 1,
    text: "啟用",
    icon: <i className="bi bi-check-lg" />,
    color: "#26B7BC",
  },
};

const MessageLayout = ({ changeActiveTab }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState(titleToClass.product.text);
  const [showTime, setShowTime] = useState(new Date());

  const [hawkerTypes, setHawkerTypes] = useState([]);
  const [notifies, setNotifies] = useState([]);

  const [notifiedType, setNotifiedType] = useState("");
  const [notifyContent, setNotifyContent] = useState("");

  const getNotifies = () => {
    fetchNotifies()
      .then((res) => {
        setNotifies(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const send = () => {
    if (!notifyContent) return;

    let types;
    if (notifiedType === "all") {
      types = hawkerTypes
        .filter((type) => type.id !== "all")
        .map((type) => type.id);
    } else {
      types = [notifiedType];
    }

    sendNotify({
      title: title,
      types: types,
      content: notifyContent,
      showTime: moment(showTime).format("YYYY-MM-DD HH:mm:ss"),
    })
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getNotifies();

    fetchHawkerTypes({ page: 1, perPage: 1000 })
      .then((res) => {
        setNotifiedType(res.data[0].id);
        setHawkerTypes([
          ...res.data,
          {
            id: "all",
            name: res.data.map((type) => type.name).join(", "),
          },
        ]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between">
        <nav className="nav">
          <NavButton
            className={`nav-link active`}
            onClick={() => changeActiveTab(message)}
          >
            建立推播訊息
          </NavButton>
          <NavButton
            className="nav-link"
            onClick={() => changeActiveTab(AdminSetting)}
          >
            管理員設定
          </NavButton>
        </nav>

        <div className="d-flex">
          <NavRouteButton
            className="btn btn-primary rounded-pill text-white d-flex justify-content-center align-items-center me-3"
            style={{ width: "173px" }}
            onClick={() => navigate("/manager/admin/new")}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.875 7.5H8.5V5.125C8.5 5.05625 8.44375 5 8.375 5H7.625C7.55625 5 7.5 5.05625 7.5 5.125V7.5H5.125C5.05625 7.5 5 7.55625 5 7.625V8.375C5 8.44375 5.05625 8.5 5.125 8.5H7.5V10.875C7.5 10.9437 7.55625 11 7.625 11H8.375C8.44375 11 8.5 10.9437 8.5 10.875V8.5H10.875C10.9437 8.5 11 8.44375 11 8.375V7.625C11 7.55625 10.9437 7.5 10.875 7.5Z"
                fill="white"
              />
              <path
                d="M8 1C4.13438 1 1 4.13438 1 8C1 11.8656 4.13438 15 8 15C11.8656 15 15 11.8656 15 8C15 4.13438 11.8656 1 8 1ZM8 13.8125C4.79063 13.8125 2.1875 11.2094 2.1875 8C2.1875 4.79063 4.79063 2.1875 8 2.1875C11.2094 2.1875 13.8125 4.79063 13.8125 8C13.8125 11.2094 11.2094 13.8125 8 13.8125Z"
                fill="white"
              />
            </svg>
            <div className="ms-2">建立新管理員</div>
          </NavRouteButton>
        </div>
      </div>
      <ContentWrapper className="mt-4">
        <AdminContentWrapper>
          <MessageWrapper>
            <MessageTitle>新增推播資訊</MessageTitle>
            <div className="row mb-3">
              <div className="col-2">
                <Label>通知對象</Label>
              </div>
              <div className="col">
                <StyledSelect
                  value={notifiedType}
                  onChange={(e) => setNotifiedType(e.target.value)}
                >
                  {hawkerTypes.map((hawkerType) => {
                    return (
                      <option key={hawkerType.id} value={hawkerType.id}>
                        {hawkerType.name}
                      </option>
                    );
                  })}
                </StyledSelect>
                <NoteMessage>這則資訊要推播給那些人？</NoteMessage>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-2">
                <Label>發送時間</Label>
              </div>
              <div className="col">
                <StyledDate>
                  <SingleDateWithTimePicker
                    startDate={showTime}
                    setStartDate={setShowTime}
                  />
                  <i className="bi bi-calendar text-primary" />
                </StyledDate>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-2">
                <Label>標題</Label>
              </div>
              <div className="col">
                <StyledSelect
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                >
                  {Object.values(titleToClass)
                    .filter((item) => item.text !== "款項確認")
                    .map((title) => {
                      return (
                        <option key={title.text} value={title.text}>
                          {title.text}
                        </option>
                      );
                    })}
                </StyledSelect>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-2">
                <Label>內 文</Label>
              </div>
              <div className="col-10">
                <div className="border rounded border-primary">
                  <MyCKEditor setContent={setNotifyContent} />
                </div>
              </div>
            </div>
            <MessageSendButton onClick={send}>發送訊息</MessageSendButton>
          </MessageWrapper>

          <RecordWrapper>
            <RecordTitle>發送紀錄</RecordTitle>
            <div className="row py-3">
              <div className="col text-center">通知對象</div>
              <div className="col text-center">發送時間</div>
              <div className="col text-center">標題</div>
              <div className="col text-center">內文</div>
            </div>
            {notifies.map((notify) => {
              return (
                <div className="row border-top py-3" key={notify.id}>
                  <div className="col text-center">{notify.types}</div>
                  <div className="col text-center">{notify.showTime}</div>
                  <div className="col text-center">{notify.title}</div>
                  <div
                    className="col text-center"
                    dangerouslySetInnerHTML={{ __html: notify.content }}
                  />
                </div>
              );
            })}
          </RecordWrapper>
        </AdminContentWrapper>
      </ContentWrapper>
    </>
  );
};

const SettingLayout = ({ changeActiveTab }) => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [accounts, setAccounts] = useState([]);

  const [pageObject, setPageObject] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const [inputKeyword, setInputKeyword] = useState("");
  const [keyword, setKeyword] = useState("");

  const ths = ["加入日期", "帳號", "狀態", "管理員名稱", "備註", "查看"];

  useEffect(() => {
    setIsLoading(true);
    fetchAdminAccounts({ page: currentPage, keyword })
      .then((res) => {
        setAccounts(res.data);
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
      <div className="d-flex justify-content-between">
        <nav className="nav">
          <NavButton
            className="nav-link"
            onClick={() => changeActiveTab(message)}
          >
            建立推播訊息
          </NavButton>
          <NavButton
            className="nav-link active"
            onClick={() => changeActiveTab(AdminSetting)}
          >
            管理員設定
          </NavButton>
        </nav>

        <div className="d-flex">
          <NavRouteButton
            className="btn btn-primary rounded-pill text-white d-flex justify-content-center align-items-center me-3"
            style={{ width: "173px" }}
            onClick={() => navigate("/manager/admin/new")}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.875 7.5H8.5V5.125C8.5 5.05625 8.44375 5 8.375 5H7.625C7.55625 5 7.5 5.05625 7.5 5.125V7.5H5.125C5.05625 7.5 5 7.55625 5 7.625V8.375C5 8.44375 5.05625 8.5 5.125 8.5H7.5V10.875C7.5 10.9437 7.55625 11 7.625 11H8.375C8.44375 11 8.5 10.9437 8.5 10.875V8.5H10.875C10.9437 8.5 11 8.44375 11 8.375V7.625C11 7.55625 10.9437 7.5 10.875 7.5Z"
                fill="white"
              />
              <path
                d="M8 1C4.13438 1 1 4.13438 1 8C1 11.8656 4.13438 15 8 15C11.8656 15 15 11.8656 15 8C15 4.13438 11.8656 1 8 1ZM8 13.8125C4.79063 13.8125 2.1875 11.2094 2.1875 8C2.1875 4.79063 4.79063 2.1875 8 2.1875C11.2094 2.1875 13.8125 4.79063 13.8125 8C13.8125 11.2094 11.2094 13.8125 8 13.8125Z"
                fill="white"
              />
            </svg>

            <div className="ms-2">建立新管理員</div>
          </NavRouteButton>
        </div>
      </div>

      <div className="row my-3">
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
        {accounts.length > 0 ? (
          accounts.map((account) => {
            const { color, icon, text } = adminStatsMap[account.stats];
            return (
              <Tr key={account.id} color={color}>
                <td>{account.created_at}</td>
                <td>{account.account}</td>
                <td className="icon">
                  {icon} {text}
                </td>
                <td>{account.name}</td>
                <td>{account.note}</td>
                <td>
                  <CheckButton
                    className="btn btn-success rounded-pill border-0 px-4"
                    to={`/manager/admin/edit/${account.id}`}
                    state={{ account }}
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

const Admin = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => location?.state || message);

  const changeActiveTab = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  return (
    <div className="container-fluid p-5">
      {activeTab === message && (
        <MessageLayout changeActiveTab={changeActiveTab} />
      )}
      {activeTab === AdminSetting && (
        <SettingLayout changeActiveTab={changeActiveTab} />
      )}
    </div>
  );
};

export default Admin;
