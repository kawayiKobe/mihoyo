import React, { useState } from "react";
import "./index.css";
import * as api from "../../services/api";

function PictureUpload() {
  const [title, setTitle] = useState("");
  const uploadPic = async e => {
    let file = e.target.files[0];
    let param = new FormData();
    param.append("file", file);
    console.log("123ccr" + file);
    //上传图片到服务端
    let res = await api.uploadPic(param);
    console.log("cc" + res.stat);
    if (res.stat === "ok") {
      console.log("url" + res.url);
    } else {
      return;
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
        <button className="publish">发布</button>
      </div>
    </div>
  );
}

export default PictureUpload;
