const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(__dirname + "/dist/xtrack"));

app.get("*", (req, res, next) => {
    res.sendFile(path.join(__dirname) + "/dist/xtrack/index.html");
});

app.listen(process.env.PORT || 8080, () => console.log("Server started"));