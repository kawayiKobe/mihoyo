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
export async function uploadPic(content) {
  let result = await axios.post("/api/uploadPic", content);
  return result.data;
}

//添加图片
export async function addPic(content) {
  let result = await axios.post("/api/addPic", content);
  return result.data;
}

//获取图片
export async function getPicture() {
  let result = await axios.get("/api/getPicture");
  return result.data;
}

export async function getPictureByState() {
  let result = await axios.get("/api/getPictureByState");
  return result.data;
}

export async function deletePic(content) {
  let result = await axios.post("/api/deletePic",content);
  return result.data;
}

export async function updatePic(content) {
  let result = await axios.post("/api/updatePic",content);
  return result.data;
}
