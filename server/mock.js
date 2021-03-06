const Koa = require("koa");
const app = new Koa();
const bodyParser = require("body-parser");
const koaBody = require("koa-body");
const Koa_static = require("koa-static");
const Router = require("koa-router");
const multer = require("koa-multer");
const path = require("path");
const router = new Router();
const jwt = require("jsonwebtoken");
const { ConsoleSqlOutlined } = require("@ant-design/icons");
const pictureJson = require("./picture.json");
const userJson = require("./user.json");
const fs = require("fs");
const CryptoJS = require("crypto-js");

const key = CryptoJS.enc.Utf8.parse("1234123412ABCDEF"); //密钥
const iv = CryptoJS.enc.Utf8.parse("ABCDEF1234123412"); //密钥偏移量

var storage = multer.diskStorage({
  destination: path.join(__dirname, "../public/imgs"),
  filename: function (req, file, cb) {
    // 前端上传的文件名
    let filename = req.body.filename;
    var fileFormat = file.originalname.split(".");
    cb(
      null,
      file.fieldname +
        "-" +
        Date.now() +
        "." +
        fileFormat[fileFormat.length - 1]
    );
  },
});

var upload = multer({
  storage,
});

function Decrypt(word) {
  let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  let decrypt = CryptoJS.AES.decrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}

app.use(
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: path.join(__dirname, "../public/imgs"),
      maxFileSize: 2097152,
      keepExtensions: true,
    },
  })
);
app.use(router.routes());

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));

app.listen("3200", () => {
  console.log("success");
});

router.prefix("/api");

//注册
router.post("/registry", async ctx => {
  const { account, pwd } = ctx.request.body;
  const secret = "debunk"; //给定密钥
  const token = jwt.sign({ account, pwd }, secret, {
    expiresIn: 60 * 60 * 2,
  });
  ctx.cookies.set("token", token.toString());
  const data = {};
  const res = userJson.RECORDS.find(item => item.account === account);
  if (!res) {
    userJson.RECORDS.push({
      userId: userJson.RECORDS[userJson.RECORDS.length - 1].userId + 1,
      account: account,
      pwd: pwd,
      userFlag: "2",
    });
    let str = JSON.stringify(userJson);
    fs.writeFile("./user.json", str, function (err) {
      if (err) {
        return;
      }
    });
    data.stat = "ok";
    data.message = "注册成功";
  } else {
    data.stat = "fail";
    data.message = "该账号已存在,请输入有效的账号";
  }
  ctx.body = { data };
});

//登录
router.post("/login", async ctx => {
  const { account, pwd } = ctx.request.body;
  const secret = "deyun"; //给定密钥
  const token = jwt.sign({ account, pwd }, secret, {
    expiresIn: 60 * 60 * 2,
  });
  ctx.cookies.set("token", token.toString());
  const data = {};
  const res = userJson.RECORDS.find(
    item => item.account === account && item.pwd === pwd
  );
  if (res) {
    data.stat = "ok";
    data.userId = res.userId;
    data.account = res.account;
    data.userFlag = res.userFlag;
    data.message = "登录成功";
  } else {
    const judge = userJson.RECORDS.find(item => item.account === account);
    if (judge) {
      data.stat = "errorPwd";
      data.message = "密码错误，请输入正确的密码";
    } else {
      data.stat = "notFound";
      data.message = "账户不存在";
    }
  }
  ctx.body = { data };
});

//退出登录
router.post("/logout", async ctx => {
  const token = ctx.cookies.get("token");
  const data = {};
  data.stat = token ? "ok" : "Token_Not_Found";
  ctx.cookies.set("token", "");
  ctx.response.body = { data };
});

//修改密码
router.post("/updatePwd", async ctx => {
  const token = ctx.cookies.get("token");
  const { userId, oldPwd, newPwd } = ctx.request.body;
  const oldPassword = Decrypt(oldPwd);
  const newPassword = Decrypt(newPwd);
  const data = {};
  const res = userJson.RECORDS.find(
    item => item.userId === Number(userId) && item.pwd === oldPassword
  );
  if (token) {
    if (!res) {
      data.stat = "errPwd";
      data.message = "原密码输入错误";
    } else {
      res.pwd = newPassword;
      fs.writeFile("./user.json", JSON.stringify(userJson), function (err) {
        if (err) {
          return;
        }
      });
      data.stat = "ok";
      data.message = "修改密码成功";
      ctx.cookies.set("token", "");
    }
  } else {
    data.stat = "Token_Not_Found";
  }
  ctx.response.body = { data };
});

//上传图片到服务器
router.post("/uploadPic", upload.single("file"), async ctx => {
  const file = ctx.request.files.file;
  const fileName = "http://localhost:3000/imgs/" + path.basename(file.filepath);
  ctx.response.body = { stat: "ok", url: fileName, message: "上传成功！" };
});

//发布图片
router.post("/addPic", async function (ctx) {
  const token = ctx.cookies.get("token");
  const now = new Date().getTime();
  const { width, height, imgSrc, title, userId } = ctx.request.body;
  const findAccount = userJson.RECORDS.find(
    item => item.userId === Number(userId)
  );
  const data = {};
  if (token) {
    pictureJson.RECORDS.push({
      picId: pictureJson.RECORDS[pictureJson.RECORDS.length - 1].picId + 1,
      width: width,
      height: height,
      imgSrc: imgSrc,
      title: title,
      picState: 0,
      isTop: 1,
      time: now,
      userId: userId,
      account: findAccount.account,
    });
    fs.writeFile("./picture.json", JSON.stringify(pictureJson), function (err) {
      if (err) {
        return;
      }
    });
    data.stat = "ok";
    data.message = "添加成功！";
  } else {
    data.stat = "Token_Not_Found";
  }
  ctx.response.body = { data };
});

//获取所有图片
router.get("/getPicture", async function (ctx) {
  const token = ctx.cookies.get("token");
  const data = {};
  let picData = JSON.parse(JSON.stringify(pictureJson.RECORDS));
  picData.sort((a, b) => a.isTop - b.isTop);
  picData.sort((a, b) => b.time - a.time);
  picData.forEach(item => {
    const findAccount = userJson.RECORDS.filter(
      content => content.userId === Number(item.userId)
    );
    findAccount.forEach(findAcount => {
      item.account = findAcount.account;
    });
  });
  if (token) {
    if (picData) {
      data.stat = "ok";
      data.content = picData;
      data.total = picData.length;
    } else {
      data.stat = "fail";
      data.message = "没有查询到图片！";
    }
  } else {
    data.stat = "Token_Not_Found";
  }

  ctx.response.body = { data };
});

//根据状态获取图片
router.get("/getPictureByState", async function (ctx) {
  const token = ctx.cookies.get("token");
  const data = {};
  const res = pictureJson.RECORDS.filter(item => item.picState === 1);
  res.forEach(item => {
    const findAccount = userJson.RECORDS.filter(
      content => content.userId === item.userId
    );
    findAccount.forEach(findAcount => {
      item.account = findAcount.account;
    });
  });
  if (token) {
    if (res) {
      data.stat = "ok";
      data.content = res;
    } else {
      data.stat = "fail";
      data.message = "没有通过审核的图片！";
    }
  } else {
    data.stat = "Token_Not_Found";
  }

  ctx.response.body = { data };
});

//删除图片
router.post("/deletePic", async function (ctx) {
  const token = ctx.cookies.get("token");
  const { picId } = ctx.request.body;
  const data = {};
  const res = pictureJson.RECORDS.find(item => item.picId === picId);
  pictureJson.RECORDS.splice(pictureJson.RECORDS.indexOf(res), 1);
  fs.writeFile("./picture.json", JSON.stringify(pictureJson), function (err) {
    if (err) {
      return;
    }
  });
  if (token) {
    data.stat = "ok";
    data.message = "删除成功！";
  } else {
    data.stat = "Token_Not_Found";
  }
  ctx.response.body = { data };
});

//更新审核状态
router.post("/updateCheckState", async function (ctx) {
  const token = ctx.cookies.get("token");
  const { picState, picId } = ctx.request.body;
  const data = {};
  const res = pictureJson.RECORDS.find(item => item.picId === picId);
  res.picState = picState;
  pictureJson.RECORDS.splice(pictureJson.RECORDS.indexOf(res), 1, res);
  fs.writeFile("./picture.json", JSON.stringify(pictureJson), function (err) {
    if (err) {
      return;
    }
  });
  if (token) {
    data.stat = "ok";
    data.message = "修改审核状态成功！";
  } else {
    data.stat = "Token_Not_Found";
  }
  ctx.response.body = { data };
});

//更新置顶状态
router.post("/updateType", async function (ctx) {
  const token = ctx.cookies.get("token");
  const now = new Date().getTime();
  const { isTop, picId } = ctx.request.body;
  const data = {};
  const res = pictureJson.RECORDS.find(item => item.picId === picId);
  res.isTop = isTop;
  res.time = now;
  pictureJson.RECORDS.splice(pictureJson.RECORDS.indexOf(res), 1, res);
  fs.writeFile("./picture.json", JSON.stringify(pictureJson), function (err) {
    if (err) {
      return;
    }
  });
  if (token) {
    data.stat = "ok";
    data.message = "修改置顶状态成功！";
  } else {
    data.stat = "Token_Not_Found";
  }
  ctx.response.body = { data };
});
