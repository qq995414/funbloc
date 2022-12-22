import React, { useEffect, useState } from "react";
import { ContentWrapper } from "../../component/StyledComponent";
import {
  Content,
  FormWrapper,
  ImgContainer,
  InnerContent,
  StyledTextarea,
  Text,
  Title,
  UploadContent,
} from "./WishStyle";
import { FileUploader } from "react-drag-drop-files";
import { CancelButton, SaveButton } from "../my/MyStyle";
import { createWish } from "../../api/message/Message";
import { useNavigate } from "react-router-dom";
import { DoneDialog } from "../../component/dialog/Dialog";
import { StyledFlexBox } from "../../styles/Shared.styles";

export const fileTypes = ["JPEG", "PNG", "JPG"];
const uploadFileImg = "/images/front-end/upload_file.png";

const Wish = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [modal, setModal] = useState(false);

  const [file, setFile] = useState(null);
  const [contact, setContact] = useState("");
  const [previewImgUrl, setPreviewImgUrl] = useState(null);

  const handleChange = (file) => setFile(file);

  const sendWish = () => {
    setIsLoading(true);

    const data = new FormData();
    data.append("photo", file);
    data.append("contact", contact);

    createWish(data)
      .then(() => {
        setFile(null);
        setPreviewImgUrl(null);
        setContact("");
        setModal(true);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    let fileReader,
      isCancel = false;
    if (file) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setPreviewImgUrl(result);
        }
      };
      fileReader.readAsDataURL(file);
    }

    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    };
  }, [file]);

  return (
    <>
      <StyledFlexBox flexDirection="column" pt={40} px={["8px", "16px", 50]}>
        <Title>商品許願</Title>
        <ContentWrapper>
          <Content p={["40px 10px", "48px 26px", "100px 15%"]}>
            <Text>
              除了平台上的商品，有想推薦或是購買的商品嗎？請告訴我們吧！
            </Text>
            <Text>也可將商品的圖片上傳至此，讓我們更清楚喔～</Text>
            <FormWrapper
              alignItems={["center", "initial"]}
              justifyContent={["initial", "center"]}
              flexDirection={["column", "row"]}
              onSubmit={(e) => {
                e.preventDefault();
                setFile(null);
                setPreviewImgUrl(null);
              }}
            >
              {!previewImgUrl ? (
                <FileUploader
                  multiple={false}
                  label={"點擊上傳圖片或拖拉進此區上傳圖片"}
                  handleChange={handleChange}
                  name="file"
                  types={fileTypes}
                  classes={"file border-primary"}
                >
                  <UploadContent width={236} height={258}>
                    <InnerContent>
                      <div>點擊上傳圖片</div>
                      <div>或</div>
                      <div>拖拉進此區上傳圖片</div>
                      <div className="mt-3">
                        <img src={uploadFileImg} className="w-75" />
                      </div>
                    </InnerContent>
                  </UploadContent>
                </FileUploader>
              ) : (
                <ImgContainer>
                  <img src={previewImgUrl} className="w-100" alt="" />
                  <div>
                    <button className="btn btn-lg rounded-circle text-white">
                      <i className="bi bi-trash3" />
                    </button>
                  </div>
                </ImgContainer>
              )}
              <StyledTextarea
                width={[236]}
                height={258}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                ml={[0, "1rem"]}
                mt={[12, 0]}
              />
            </FormWrapper>
          </Content>
        </ContentWrapper>
        <div className="text-center mt-4">
          <CancelButton className="mx-2" onClick={() => navigate(-1)}>
            取消
          </CancelButton>
          <SaveButton className="mx-2" disabled={isLoading} onClick={sendWish}>
            送出
          </SaveButton>
        </div>
      </StyledFlexBox>
      {modal && (
        <DoneDialog
          closeModal={() => {
            setModal(false);
            navigate("/message");
          }}
          text={"謝謝你的回饋"}
        />
      )}
    </>
  );
};

export default Wish;
