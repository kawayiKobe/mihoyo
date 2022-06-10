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
  const secret = "deyun"; //给定密钥
  const token = jwt.sign({ account, pwd }, secret, {
    expiresIn: 60 * 60 * 2,
  });
  ctx.cookies.set("token", token.toString());
  const data = {};
  const res = userJson.RECORDS.find(item => item.account === account);
  if (!res) {
    fs.readFile("./user.json", function (err, data) {
      if (err) {
        return;
      }
      let user = data.toString();
      user = JSON.parse(user);
      user.RECORDS.push({
        userId: userJson.RECORDS.length + 1,
        account: account,
        pwd: pwd,
        userFlag: "2",
      });
      let str = JSON.stringify(user);
      fs.writeFile("./user.json", str, function (err) {
        if (err) {
          return;
        }
      });
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
  console.log(res);
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
  if (token) {
    data.stat = "ok";
  } else {
    data.stat = "Token_Not_Found";
  }
  ctx.cookies.set("token", "");
  ctx.response.body = { data };
});

//修改密码
router.post("/updatePwd", async ctx => {
  const token = ctx.cookies.get("token");
  const { userId, oldPwd, newPwd } = ctx.request.body;
  const data = {};
  const res = userJson.RECORDS.find(
    item => item.userId === userId && item.pwd === oldPwd
  );
  console.log(res);
  if (token) {
    if (!res) {
      data.stat = "errPwd";
      data.message = "原密码输入错误";
    } else {
      fs.readFile("./user.json", function (err, data) {
        if (err) {
          return;
        }
        let user = data.toString();
        user = JSON.parse(user);
        user.RECORDS.array.forEach(item => {
          const select = user.find(item => item.id === userId);
          console.log(select);
        });
        let str = JSON.stringify(user);
        fs.writeFile("./user.json", str, function (err) {
          if (err) {
            return;
          }
        });
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
  const data = {};

  if (token) {
    fs.readFile("./picture.json", function (err, data) {
      if (err) {
        return;
      }
      let pic = data.toString();
      pic = JSON.parse(pic);
      pic.RECORDS.push({
        picId: pictureJson.RECORDS.length + 1,
        width: width,
        height: height,
        imgSrc: imgSrc,
        title: title,
        picState: 0,
        isTop: 1,
        time: now,
        userId: userId,
      });
      let str = JSON.stringify(pic);
      fs.writeFile("./picture.json", str, function (err) {
        if (err) {
          return;
        }
      });
      if (str) {
        data.stat = "ok";
        data.message = "添加成功！";
      } else {
        data.stat = "fail";
        data.message = "添加失败！";
      }
    });
  } else {
    data.stat = "Token_Not_Found";
  }
  ctx.response.body = { data };
});

//获取所有图片
router.get("/getPicture", async function (ctx) {
  const token = ctx.cookies.get("token");
  const data = {};
  pictureJson.RECORDS.sort((a, b) => a.picState - b.picState);
  pictureJson.RECORDS.forEach(item => {
    const findAccount = userJson.RECORDS.find(
      content => content.userId === item.userId
    );
    item.account = findAccount.account;
  });
  if (token) {
    if (pictureJson.RECORDS.length > 0) {
      sql =
        "select count(*) from (select  U.account,P.* from picture as P left join user as U on P.userId = U.userId) as total";
      const total = await getData(sql);
      data.stat = "ok";
      data.content = res;
      data.total = total;
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
  let sql =
    "select  U.account,P.* from picture as P left join user as U on P.userId = U.userId where P.picState = 1 order by P.isTop,time desc";
  let res = await getData(sql);
  if (token) {
    if (res.length > 0) {
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
  const sql = 'delete from picture where picId = "' + picId + '" ';
  const res = await getData(sql);
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
  const sql =
    'update picture set picState = "' +
    picState +
    '" where picId = "' +
    picId +
    '" ';
  const res = await getData(sql);
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
  const sql =
    'update picture set isTop = "' +
    isTop +
    '" ,time = "' +
    now +
    '"where picId = "' +
    picId +
    '"';
  const res = await getData(sql);
  if (token) {
    data.stat = "ok";
    data.message = "修改置顶状态成功！";
  } else {
    data.stat = "Token_Not_Found";
  }
  ctx.response.body = { data };
});
