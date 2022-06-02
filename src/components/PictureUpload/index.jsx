import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./index.css";
import * as api from "../../services/api";
import { message } from "antd";

function PictureUpload() {
  const history = useHistory();

  const [title, setTitle] = useState("");
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const uploadPic = async e => {
    let file = e.target.files[0];
    let param = new FormData();
    param.append("file", file);
    console.log("123ccr" + file);
    let res = await api.uploadPic(param);
    let img = new Image();
    console.log("url" + res.url);
    img.src = res.url;
    img.onload = function () {
      setWidth(img.width);
      setHeight(img.height);
    };
    if (res.stat === "ok") {
      localStorage.setItem("imgUrl", res.url);
      message.success(res.message);
    } else {
      return;
    }
  };

  const addPic = async () => {
    let res = await api.addPic({
      width: width,
      height: height,
      imgSrc: localStorage.getItem("imgUrl"),
      title: title,
      userId: localStorage.getItem("userId"),
    });
    console.log(res);
    if (res.data.stat === "ok") {
      message.success(`添加图片成功`);
      history.push("/main/picture-wall");
    } else {
      message.error(res.data.message);
    }
  };
  return (
    <div className="upload-box">
      <div className="publish-pic">
        <h3>发布图片</h3>
      </div>
      <div className="trap-box">
        <div className="title">
          <span>标题：</span>
          <input
            type="text"
            value={title}
            onChange={e => {
              setTitle(e.target.value);
            }}
          />
        </div>
        <div className="pic-upload">
          <span>图片上传：</span>
          <div className="pic-select">
            <label type="button" className="btn">
              <span>选择图片</span>
              <input type="file" id="file" multiple onChange={uploadPic} />
            </label>
          </div>
        </div>
        <button className="publish" onClick={addPic}>
          发布
        </button>
      </div>
    </div>
  );
}

export default PictureUpload;
