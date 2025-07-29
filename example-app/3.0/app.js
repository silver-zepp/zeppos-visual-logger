import { BaseApp } from "@zeppos/zml/base-app";

import VisLog from "../../2.0/dist/vis-log";

App(
  BaseApp({
    globals: {
      vis: new VisLog(),
    },
    onCreate() {
      this.globals.vis.log("Log from app.js!");
    },
    onDestroy() {},
  })
);
