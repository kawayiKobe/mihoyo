const Koa = require("koa");
const app = new Koa();
const bodyParser = require("body-parser");
const koaBody = require("koa-body");
const Koa_static = require("koa-static");
const Router = require("koa-router");
const multer = require("koa-multer");
const path = require("path");
const router = new Router();
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const { ConsoleSqlOutlined } = require("@ant-design/icons");


const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  port: "3306",
  database: "mihoyo",
});
connection.connect();

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

function getData(sql) {
  return new Promise(function (resolve, reject) {
    connection.query(sql, function (err, result) {
      if (err) {
        console.log("[error]", err.message);
        return;
      }
      resolve(JSON.parse(JSON.stringify(result)));
    });
  });
}

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
  let sql = 'select * from user where account = "' + account + '"';
  const res = await getData(sql);
  if (res.length === 0) {
    sql =
      'insert into user(account, pwd, userFlag) values ("' +
      account +
      '", "' +
      pwd +
      '", 2)';
    await getData(sql);
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
  const sql =
    'select * from user where account = "' +
    account +
    '" and pwd = "' +
    pwd +
    '" ';
  const res = await getData(sql);
  if (res.length === 1) {
    data.stat = "ok";
    data.userId = res[0].userId;
    data.account = res[0].account;
    data.userFlag = res[0].userFlag;
    data.message = "登录成功";
  } else {
    const judge = await getData(
      'select * from user where account = "' + account + '"'
    );
    if (judge.length === 1) {
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
  let sql =
    'select * from user where userId = "' +
    userId +
    '" and pwd = "' +
    oldPwd +
    '"';
  let res = await getData(sql);
  if (token) {
    if (res.length !== 1) {
      data.stat = "errPwd";
      data.message = "原密码输入错误";
    } else {
      sql =
        'update user set pwd = "' +
        newPwd +
        '" where userId = "' +
        userId +
        '" ';
      res = await getData(sql);
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
  let sql =
    'insert into picture(width, height, imgSrc , title, picState , isTop, userId,time) values ("' +
    width +
    '", "' +
    height +
    '", "' +
    imgSrc +
    '","' +
    title +
    '",0,1,"' +
    userId +
    '","' +
    now +
    '")';
  const judge = await getData(sql);
  if (token) {
    if (judge) {
      data.stat = "ok";
      data.message = "添加成功！";
    } else {
      data.stat = "fail";
      data.message = "添加失败！";
    }
  } else {
    data.stat = "Token_Not_Found";
  }
  ctx.response.body = { data };
});

//获取所有图片
router.get("/getPicture", async function (ctx) {
  const token = ctx.cookies.get("token");
  const data = {};

  let sql =
    "select  U.account,P.* from picture as P left join user as U on P.userId = U.userId order by P.isTop,time desc ";
  let res = await getData(sql);
  if (token) {
    if (res.length > 0) {
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
    "select  U.account,P.* from picture as P left join user as U on P.userId = U.userId where P.picState = 1";
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
