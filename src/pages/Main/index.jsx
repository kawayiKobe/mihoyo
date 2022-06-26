import { React, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import "./index.css";
import RouteTo from "../../routeTo";
import Modal from "antd/lib/modal/Modal";
import { useState } from "react";
import { ExportOutlined } from "@ant-design/icons";
import * as api from "../../services/api";
import Encrypt from "../../utils/encrypt"

function Main() {
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [num, setNum] = useState(1);
  const history = useHistory();

  const logout = async () => {
    const result = await api.logout();
    if (result.data.stat === "ok") {
      message.success(`退出成功`);
      localStorage.removeItem("userId");
      localStorage.removeItem("account");
      localStorage.removeItem("userFlag");
      history.replace("/login");
    } else if (result.data.stat === "Token_Not_Found") {
      history.replace("/login");
    }
  };

  const updatePwd = async () => {
    const result = await api.updatePwd({
      userId: localStorage.getItem("userId"),
      oldPwd: Encrypt(oldPwd),
      newPwd: Encrypt(newPwd),
    });
    if (result.data.stat === "ok") {
      message.success(`修改密码成功`);
      history.replace("/login");
    } else if (result.data.stat === "Token_Not_Found") {
      history.replace("/login");
    } else {
      message.error(result.data.message);
    }
  };

  function handleCancel() {
    setIsShowDialog(false);
  }

  function showDialog() {
    setIsShowDialog(true);
  }

  function changePic() {
    setNum(1);
  }

  function changeUpload() {
    setNum(2);
  }

  function changeManage() {
    setNum(3);
  }

  return (
    <>
      <div className="header">
        <div className="header-inner">
          <div className="header-logo">
            <img
              src="https://bbs.mihoyo.com/_nuxt/img/miHoYo_Game.a137b1d.png"
              alt=""
            />
          </div>
          <div className="header-pic">
            <Link
              onClick={changePic}
              className={num === 1 ? "is-acitve header-img" : "header-img"}
              to="/main/picture-wall"
            >
              瀑布流
            </Link>
          </div>
          <div className="header-upload">
            <Link
              onClick={changeUpload}
              className={num === 2 ? "header-img is-acitve" : "header-img"}
              to="/main/picture-upload"
            >
              图片上传
            </Link>
          </div>
          {localStorage.getItem("userFlag") === "1" ? (
            <div className="header-manage">
              <Link
                onClick={changeManage}
                className={num === 3 ? "header-img is-acitve" : "header-img"}
                to="/main/picture-manage"
              >
                图片管理
              </Link>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="logout">
          <ExportOutlined className="logout-img" />
          <div className="drop">
            <div className="margin-top-5" onClick={showDialog}>
              修改密码
            </div>
            <div className="margin-top-5" onClick={logout}>
              退出登录
            </div>
          </div>
        </div>
      </div>
      <RouteTo />
      <Modal
        title="修改密码"
        align="center"
        visible={isShowDialog}
        destroyOnClose={true}
        onCancel={handleCancel}
        footer={null}
        width={420}
      >
        <div className="dialog">
          <Form name="create" labelCol={{ span: 7 }} wrapperCol={{ span: 20 }}>
            <Form.Item
              name="old"
              label="旧密码"
              rules={[
                {
                  required: true,
                  message: "密码不能为空!",
                },
              ]}
            >
              <Input.Password
                maxLength={13}
                placeholder="请输入旧密码"
                value={oldPwd}
                onChange={e => {
                  setOldPwd(e.target.value);
                }}
                style={{ marginLeft: 20 }}
              ></Input.Password>
            </Form.Item>
            <Form.Item
              name="new"
              label="新密码"
              rules={[
                {
                  required: true,
                  message: "密码不能为空!",
                },
              ]}
            >
              <Input.Password
                maxLength={13}
                placeholder="请输入新密码"
                style={{ marginLeft: 20 }}
                value={newPwd}
                onChange={e => {
                  setNewPwd(e.target.value);
                }}
              ></Input.Password>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" onClick={updatePwd}>
                提交
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
}

export default Main;
