import http from "http";
import path from "path";

import express from "express";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import auth from "http-auth";

import { logger } from "./config";
import settings from "./settings";

class App {
  constructor(cfg) {
    this.port = cfg.port;
    this.basePath = cfg.basePath;
    this.shutdownTimeout = cfg.shutdownTimeout;
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use(fileUpload());
    const basic = auth.basic({ realm: "advent" }, (user, pw, cb) =>
      cb(
        (user === cfg.user && pw == cfg.password) ||
          (user === "admin" && pw === cfg.adminpw)
      )
    );
    this.app.use(auth.connect(basic));
  }

  async init(cfg) {
    this.app.get("/settings.js", (req, res) => {
      settings(req.user)
        .then(r => res.end(r))
        .catch(e => {
          res.status(500);
          res.end();
        });
    });
    this.app.use(express.static("../web/"));
  }

  run() {
    this.server = http.createServer(this.app);
    return this.server.listen(this.port);
  }

  stop() {
    let timer;
    const killer = new Promise((_, reject) => {
      timer = setTimeout(
        () => reject(new Error("timed out closing http server")),
        this.shutdownTimeout
      );
    });
    const close = new Promise(resolve =>
      this.server.close(() => {
        clearTimeout(timer);
        resolve();
      })
    );
    return Promise.race([close, killer]);
  }
}

export { App as default };
