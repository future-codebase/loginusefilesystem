const express = require("express");
const fs = require("fs");
const app = express();
const customevents = require("./Events/customevents");

const data = JSON.parse(fs.readFileSync("./Data/users.json"));
const session = JSON.parse(fs.readFileSync("./Data/session.json"));

myEvent.on("user-login", customevents.myEventhandler);
myEvent.on("session-status", customevents.myEventhandler_2);
app.use(express.json());
app.use((req, res, next) => {
  if (session.length != 0) {
    req.session = true;
  } else {
    req.session = false;
  }
  next();
});

app.get("/api/v1/dashboard", (req, res) => {
  if (req.session == true) {
    fs.readFile("./Data/dashboard.json", "utf-8", (err, data) => {
      if (err) throw err;
      res.status(200).json({
        status: "success",
        data: {
          data: JSON.parse(data),
        },
      });
    });
  } else {
    res.status(400).json({
      status: "Fail",
      message: "Please go to login page",
    });
  }
});

app.post("/api/v1/login", (req, res) => {
  if (session == false) {
    const { email, password } = req.body;
    const match = data.find(
      (el) => el.email === email && el.password === password
    );
    if (!match) {
      return res.status(200).json({
        status: "Fail",
        message: "Email or password is not correct",
      });
    }
    session.push(match);
    fs.writeFile("./Data/session.json", JSON.stringify(session), (err) => {
      if (err) throw err;
      myEvent.emit("user-login", "You are successfully login");
      fs.readFile("./Data/dashboard.json", "utf-8", (err, data) => {
        if (err) throw err;
        res.status(200).json({
          status: "success",
          data: {
            data: JSON.parse(data),
          },
        });
      });
    });
  }
});

app.get("/api/v1/logout", (req, res) => {
  if (req.session == true) {
    session.splice(0, 1);
    fs.writeFile("./Data/session.json", JSON.stringify(session), (err) => {
      if (err) throw err;
      res.status(200).json({
        status: "success",
        message: "Log out",
      });
    });
  } else {
    res.status(200).json({
      status: "success",
      message: "You are not logged in",
    });
  }
});

app.listen(3000, () => {
  console.log("Server is running...");
});
