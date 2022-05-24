import axios from "axios";

//注册
export async function registry(user) {
  const result = await axios.post("/api/registry", user);
  return result.data;
}

//登录
export async function login(user) {
  const result = await axios.post("/api/login", user);
  return result.data;
}

//修改密码
export async function updatePwd(content) {
  const result = await axios.post("/api/updatePwd", content);
  return result.data;
}

//上传
export async function uploadPic(param){
    let result = await axios.post('/api/uploadPic',param)
    return result.data
}
