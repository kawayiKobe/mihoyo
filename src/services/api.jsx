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

//登出
export async function logout() {
  let result = await axios.post("/api/logout");
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

//根据图片状态获取
export async function getPictureByState() {
  let result = await axios.get("/api/getPictureByState");
  return result.data;
}

//删除图片
export async function deletePic(content) {
  let result = await axios.post("/api/deletePic", content);
  return result.data;
}

//更新审核状态
export async function updateCheckState(content) {
  let result = await axios.post("/api/updateCheckState", content);
  return result.data;
}

//更新置顶状态
export async function updateType(content) {
  let result = await axios.post("/api/updateType", content);
  return result.data;
}
