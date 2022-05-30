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

async function getData(sql) {
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
  const data = {};
  let sql = 'select * from user where account = "' + account + '"';
  const res = await getData(sql);
  if (res.length === 0) {
    sql =
      'insert into user(account, pwd, userflag) values ("' +
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
  const data = {};
  const sql =
    'select * from user where account = "' +
    account +
    '" and pwd = "' +
    pwd +
    '" ';
  const res = await getData(sql);
  console.log("first" + res);
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

//修改密码
router.post("/updatePwd", async ctx => {
  const { userId, oldPwd, newPwd } = ctx.request.body;
  console.log("useid" + userId);
  const data = {};
  let sql =
    'select * from user where userId = "' +
    userId +
    '" and pwd = "' +
    oldPwd +
    '"';
  let res = await getData(sql);
  if (res.length !== 1) {
    data.stat = "errPwd";
    data.message = "原密码输入错误";
  } else {
    sql =
      'update user set pwd = "' + newPwd + '" where userId = "' + userId + '" ';
    res = await getData(sql);
    data.stat = "success";
    data.message = "修改密码成功";
  }
  ctx.response.body = { data };
});

router.post("/uploadPic", upload.single("file"), async ctx => {
  const file = ctx.request.files.file;
  // console.log(file);
  const fileName = "http://localhost:3000/imgs/" + path.basename(file.filepath);
  ctx.response.body = { stat: "ok", url: fileName, message: "上传成功！" };
});

router.post("/addPic", async function (ctx) {
  const { width, height, imgSrc, title, userId } = ctx.request.body;
  const data = {};
  console.log("11wode" + width, imgSrc);
  let sql =
    'insert into picture(width, height, imgSrc , title,userId) values ("' +
    width +
    '", "' +
    height +
    '", "' +
    imgSrc +
    '","' +
    title +
    '","' +
    userId +
    '")';
  const judge = await getData(sql);
  if (judge.length === 1) {
    data.stat = "ok";
    data.message = "添加成功！";
  } else {
    data.stat = "ok";
    data.message = "添加失败！";
  }
  ctx.response.body = { data };
});

router.get("/getPicture", async function (ctx) {
  const data = {};
  let sql =
    "select  U.account,P.* from picture as P left join user as U on P.userId = U.userId";
  let res = await getData(sql);
  if (res.length > 0) {
    sql =
      "select count(*) from (select  U.account,P.* from picture as P left join user as U on P.userId = U.userId) as total";
    total = await getData(sql);
    data.stat = "ok";
    data.content = res;
    data.total = total;
  } else {
    data.stat = "fail";
    data.message = "没有查询到图片";
  }
  ctx.response.body = { data };
});
