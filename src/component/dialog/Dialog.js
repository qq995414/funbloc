import React, { useEffect } from "react";
import {
  DialogConfirmContentWrapper,
  DialogTitle,
  DialogWrapper,
} from "./DialogStyle";
import Portal from "../portal/Portal";

const forbiddenIcon = "/images/manager/forbidden.png";
const doneIcon = "/images/manager/done.png";
const trashCan = "/images/manager/trash_can.png";

export const CancelledDialog = ({ closeModal, text }) => (
  <Dialog onClose={closeModal}>
    <DialogConfirmContentWrapper>
      <div>
        <img src={forbiddenIcon} className="w-100 h-100" alt="" />
      </div>
      <DialogTitle>{text}</DialogTitle>
    </DialogConfirmContentWrapper>
  </Dialog>
);

export const DeleteDialog = ({ closeModal, text }) => (
  <Dialog onClose={closeModal}>
    <DialogConfirmContentWrapper>
      <div>
        <img src={trashCan} className="w-100 h-100" alt="" />
      </div>
      <DialogTitle>{text}</DialogTitle>
    </DialogConfirmContentWrapper>
  </Dialog>
);

export const DoneDialog = ({ closeModal, text }) => (
  <Dialog onClose={closeModal}>
    <DialogConfirmContentWrapper>
      <div>
        <img src={doneIcon} className="w-100 h-100" alt="" />
      </div>
      <DialogTitle>{text}</DialogTitle>
    </DialogConfirmContentWrapper>
  </Dialog>
);

const Dialog = ({ children, onClose = () => {}, extend }) => {
  const wrapperClick = (e) => {
    if (e.target.getAttribute("class").indexOf("dialog-wrapper") !== -1) {
      onClose();
    }
  };

  useEffect(() => {
    document.querySelector("#root").classList.toggle("manager-fixed");
    return () => {
      document.querySelector("#root").classList.remove("manager-fixed");
    };
  }, []);

  return (
    <Portal>
      <DialogWrapper
        extend={extend}
        className="dialog-wrapper"
        onClick={wrapperClick}
      >
        {children}
      </DialogWrapper>
    </Portal>
  );
};

export default Dialog;
