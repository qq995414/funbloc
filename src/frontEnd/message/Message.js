import React, { useEffect, useState } from "react";
import styled from "styled-components";
import _ from "lodash";
import {
  ContentWrapper,
  PaginationWrapper,
} from "../../component/StyledComponent";
import Pagination from "../../manager/components/pagination/Pagination";
import { fetchMessages } from "../../api/message/Message";
import { StyledFlexBox } from "../../styles/Shared.styles";
import { flexbox, layout, space, typography } from "styled-system";
import moment from "moment";

const MessageLayout = styled.div.attrs({
  className: "container-fluid",
})`
  padding: 50px 110px;
  ${space}
  p {
    margin: 0;
  }
`;

const Title = styled.div.attrs({
  className: "text-primary text-center",
})`
  margin-bottom: 26px;
  font-size: 17px;
  font-weight: 600;
`;

const MessageWrapper = styled.div.attrs({
  className: "row border border-primary",
})`
  width: 100%;
  padding: 20px 50px;
  margin: 0 0 15px 0;
  border-radius: 11px;
  background-color: ${({ admin }) => (admin ? "#F5FEFF" : "#FFFFFF")};
  ${space}
  ${flexbox}
  display: flex;
  flex-wrap: nowrap;
  &.admin {
    background-color: #f5feff;
  }
`;

const MessageType = styled.div.attrs(({ className }) => ({
  className: `col-2 ${className}`,
}))`
  align-self: center;
  font-weight: 600;
  font-size: 16px;
  padding: 0;
  ${flexbox}
  ${layout}
  ${space}
`;

const MessageContent = styled.div.attrs({
  className: "col-8",
})`
  line-height: 20px;
  font-size: 15px;
  color: #000000;
  ${layout}
`;

const MessageTime = styled.div.attrs({
  className: "col-2",
})`
  color: #747474;
  font-size: 12px;
  white-space: nowrap;
  ${typography}
  ${layout}
  ${space}
`;

export const titleToClass = {
  product: {
    color: "text-danger",
    text: "新品上架",
  },
  price: {
    color: "text-info-dark",
    text: "價格異動",
  },
  payment: {
    color: "text-warning",
    text: "款項確認",
  },
  admin: {
    color: "text-primary",
    text: "小販團官方公告",
  },
};

const Message = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageObject, setPageObject] = useState({
    totalPage: 1,
  });

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages({ page: currentPage })
      .then((res) => {
        setMessages(res.data);
        setPageObject(res.meta);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [currentPage]);

  return (
    <StyledFlexBox
      flexDirection="column"
      className="container-fluid"
      ml={["15px", "48px", 36]}
      p={[0, "3rem"]}
      mt={[66, 0]}
    >
      <ContentWrapper
        width={[311, "inherit"]}
        minWidth={["unset", "unset", 720]}
      >
        <MessageLayout p={["24px 20px", "32px 64px", "54px 108px"]}>
          <Title>訊息通知列表</Title>

          {console.log(messages)}
          {messages.map((message) => {
            const findTitleObject = _.find(
              Object.values(titleToClass),
              function (title) {
                return title?.text === message.title;
              }
            );

            return (
              <MessageWrapper
                key={message.id}
                p={["12px 10px", "12px 20px", "20px 50px"]}
                className={
                  findTitleObject?.text === "小販團官方公告" ? "admin" : ""
                }
                flexDirection={["column", "row"]}
                alignItems={["initial", "center"]}
              >
                <StyledFlexBox alignItems="center" p={0} width="auto">
                  {message.isRead === 0 && (
                    <StyledFlexBox
                      bg="#db5f5f"
                      width="8px"
                      minWidth="8px"
                      height="8px"
                      borderRadius="50%"
                      p={0}
                      mr={["8px", 10, 18]}
                    />
                  )}
                  <MessageType
                    className={findTitleObject?.color}
                    alignSelf={["baseline", "center"]}
                    width={["100%", 65, 126]}
                    mr={[0, 20, 0]}
                  >
                    {message.title}
                  </MessageType>
                </StyledFlexBox>
                <StyledFlexBox
                  flexDirection={["column-reverse", "column-reverse", "row"]}
                  mt={[-20, 0, 0]}
                  p={0}
                >
                  <MessageContent
                    dangerouslySetInnerHTML={{ __html: message.content }}
                    width={["100%", "75%", "48%"]}
                  />
                  <MessageTime
                    width={["100%", "75%", "calc(52% - 126px)"]}
                    textAlign={["end", "initial", "end"]}
                    mb={["4px", 0]}
                  >
                    {moment(message.showTime).format("YYYY-MM-DD HH:mm")}
                  </MessageTime>
                </StyledFlexBox>
              </MessageWrapper>
            );
          })}
        </MessageLayout>
      </ContentWrapper>

      <PaginationWrapper>
        <Pagination
          pageObject={pageObject}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </PaginationWrapper>
    </StyledFlexBox>
  );
};

export default Message;
