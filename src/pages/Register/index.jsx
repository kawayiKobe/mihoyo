import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import * as api from "../../services/api";
import "../../assets/css/common.css";
import "./index.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const user = { account: username, pwd: password };

  const register = async () => {
    let result = await api.registry(user);
    console.log(result, result.data.message);
    if (result.data.stat === "ok") {
      message.success(`注册成功`);
      history.push("/login");
    } else {
      message.error(result.data.message);
      console.log("error");
    }
  };

  return (
    <>
      <div className="login-box">
        <Card className="user-login" size="small" title="用户注册">
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
          >
            <Form.Item
              name="username"
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
                autoComplete="username"
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
            <div className="to-login">
              已有账户，
              <a href="/login" style={{ color: "#42c02e" }}>
                去登录
              </a>
            </div>

            <Form.Item>
              <Button
                block
                type="primary"
                htmlType="submit"
                className="login-form-button"
                style={{ backgroundColor: "#42c02e", borderColor: "#42c02e" }}
                onClick={register}
              >
                注册
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
}

export default Register;
