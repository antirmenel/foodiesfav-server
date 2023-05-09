require('dotenv').config();
const express = require("express");
const app = express();
const router = require("./server/routes/router");
const cors = require("cors");
const port = 8004;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(router);

// error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`The server is started at port number :${port}`);
});
