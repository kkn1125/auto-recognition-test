import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import multer from "multer";
import ejs from "ejs";
import os from "os";
import { execSync } from "child_process";
import DBManager from "./model/DBManager.js";

dotenv.config({
  path: path.join(path.resolve(), ".env"),
});

const PORT = Number(process.env.PORT) || 5000;

const formData = multer();
const app = express();

let useDB = "";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(formData.any());

app.engine("html", ejs.renderFile);
app.set("view engine", "html");

// const users = new Map();
const manager = new DBManager();

const pageRender = (res, pageName, datas = {}) => {
  res.render(path.join(path.resolve(), "src", "layout", "template.html"), {
    page: pageName,
    ...datas,
  });
};

const userList = new Map();

const db = manager.createDB("test");
const users = db.createTable("user", true);
const boards = db.createTable("board", true);

users.setHead([
  ["name", "string"],
  ["age", "number"],
]);
users.addRow([["kimson", 31]]);
users.addRow([["tommy", 30]]);

const getIps = () => {
  const cmd = `curl -s http://checkip.amazonaws.com || printf "0.0.0.0"`;
  const pubIp = execSync(cmd).toString().trim();
  const privIp = Object.entries(os.networkInterfaces())
    .filter(([k, v]) => k.match(/이더넷/i))
    .map(([k, v]) => v.filter((z) => z.family.match(/ipv4/i)))
    .flat(1)[0].address;
  return [pubIp, privIp];
};

const userDataInput = () => {
  const [pubIp, privIp] = getIps();
  const key = pubIp + "|" + privIp;

  if (!userList.has(key) && !userList.get(key)?.login) {
    userList.set(key, {
      accessCount: 1,
      login: true,
    });
  }
  return [pubIp, privIp, userList.get(key)?.login];
};

app.get("/", (req, res) => {
  const [pubIp, privIp, isLogin] = userDataInput();
  const key = pubIp + "|" + privIp;
  let ifAccessMany = false;
  if (userList.get(key)) {
    userList.get(key).accessCount++;
  }
  if (userList.get(key)?.accessCount > 10) {
    ifAccessMany = true;
  }
  console.log(userList.get(key)?.accessCount);
  // const found = users.findRowByPk(0);
  const found = users.findRowByColumn("name", "kimson");
  console.log("🚀 ~ file: index.js:85 ~ app.get ~ found:", found);

  pageRender(res, "index", {
    pubIp,
    privIp,
    dbs: manager.findAll(),
    useDB,
    isYou: ifAccessMany && isLogin,
  });
});

app.get("/about", (req, res) => {
  const [pubIp, privIp] = getIps();
  const key = pubIp + "|" + privIp;
  const isLogin = userList.has(key) && userList.get(key)?.login;
  if (isLogin) pageRender(res, "about");
  else pageRender(res, "notFound");
});

// app.post("/db", (req, res) => {
//   manager.createDB(req.body.name);
//   useDB = req.body.name;
//   res.write(`
//   <script>
//   window.parent.location.reload();
//   // document.body.innerText = '';
//   // document.head.innerText = '';
//   </script>
//   `);
//   res.end();
// });

// app.post("/table", (req, res) => {
//   const db = manager.findOneByName(req.body.dbName);
//   const newTable = new Table(req.body.tableName);
//   db.addTable(newTable);
//   res.write(`
//   <script>
//   window.parent.location.reload();
//   // document.body.innerText = '';
//   // document.head.innerText = '';
//   </script>
//   `);
//   res.end();
// });

// app.post("/row", (req, res) => {
//   const head = {};
//   const body = req.body;
//   console.log("🚀 ~ file: index.js:123 ~ app.post ~ body:", body);

//   const db = manager.findOneByName(body.dbName);
//   const table = db.findOneByName(body.tableName);
//   const row = new Row();

//   const filtered = Object.entries(body).filter(([k, v]) =>
//     k.match(/.+\..+|.+\[.+\]/)
//   );

//   filtered.forEach(([k, v]) => {
//     const [$$, $1, $2, $3, $4] = k.match(/(.+)\.(.+)|(.+)\[(.+)\]/);
//     const hd = $1 || $3;
//     const key = $2 || $4;
//     if (!head[hd]) {
//       head[hd] = [];
//     }
//     if (head[hd]) {
//       head[hd].push([key, v]);
//     }
//   });

//   const arrayData = Object.entries(head).map(([k, v]) => {
//     return [k, Object.fromEntries(v)];
//   });

//   const data = Object.fromEntries(arrayData);

//   arrayData.forEach(([k, v]) => {
//     const col = new Column(v.key, v.type, v.value);
//     row.addColumn(col);
//   });

//   table.addRow(row);

//   res.write(`
//   <script>
//   window.parent.location.reload();
//   // document.body.innerText = '';
//   // document.head.innerText = '';
//   </script>
//   `);
//   res.end();
// });

app.get((req, res) => {
  res.send("not found");
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
