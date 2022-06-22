import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import "../../assets/css/common.css";
import * as api from "../../services/api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const user = { account: username, pwd: password };
  const log = async () => {
    let result = await api.login(user);
    console.log(result);
    if (result.data.stat === "ok") {
      message.success(`登录成功`);
      localStorage.setItem("userId", result.data.userId);
      localStorage.setItem("account", result.data.account);
      localStorage.setItem("userFlag", result.data.userFlag);
      history.push("/main");
    } else {
      message.error(result.data.message);
    }
  };
  return (
    <>
      <div className="login-box">
        <Card
          className="user-login"
          size="small"
          title="用户登录"
          extra={
            <a href="/Register" style={{ color: "#1890ff" }}>
              去注册
            </a>
          }
        >
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
          >
            <Form.Item
              name="nickname"
              rules={[
                {
                  required: true,
                  message: "请输入用户名",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="用户名"
                value={username}
                onChange={e => {
                  setUsername(e.target.value);
                }}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "请输入密码",
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                autoComplete="current-password"
                placeholder="密码"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                block
                type="primary"
                htmlType="submit"
                className="login-form-button"
                onClick={log}
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
      <div></div>
    </>
  );
}

export default Login;
