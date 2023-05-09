require("dotenv").config();
const express = require("express");
const app = express();
const router = require("./routes/router");
const cors = require("cors");
const port = 8004;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(router);

app.listen(port, () => {
  console.log(`The server is started at port number :${port}`);
});
