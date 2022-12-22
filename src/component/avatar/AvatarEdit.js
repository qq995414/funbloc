import React, { Component } from "react";
import Avatar from "react-avatar-edit";
import { StyledButtonGroup } from "./AvatarEdit.styles";

class AvatarEdit extends Component {
  constructor(props) {
    super(props);
    const src = "";
    this.state = {
      preview: null,
      src,
    };
    this.onCrop = this.onCrop.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onBeforeFileLoad = this.onBeforeFileLoad.bind(this);
  }

  onClose() {
    this.setState({ preview: null });
  }

  onCrop(preview) {
    this.setState({ preview });
  }

  onBeforeFileLoad(elem) {
    // if (elem.target.files[0].size > 71680) {
    //     alert("File is too big!")
    //     elem.target.value = ""
    // }
  }

  onSaveClick(preview) {
    this.props.save(preview);
    this.props.onCloseModal();
  }

  render() {
    return (
      <div className="bg-white">
        <Avatar
          width={390}
          height={295}
          onCrop={this.onCrop}
          onClose={this.onClose}
          onBeforeFileLoad={this.onBeforeFileLoad}
          src={this.state.src}
        />
        <StyledButtonGroup justifyContent="center" width={390}>
          <button
            className="btn btn-secondary cancel"
            onClick={this.props.onCloseModal}
          >
            取消
          </button>
          <button
            className="btn btn-primary text-white"
            onClick={() => this.onSaveClick(this.state.preview)}
          >
            儲存
          </button>
        </StyledButtonGroup>
        {/*<img src={this.state.preview} alt="Preview" />*/}
      </div>
    );
  }
}

export default AvatarEdit;
