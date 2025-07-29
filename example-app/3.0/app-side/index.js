import { BaseSideService } from "@zeppos/zml/base-side";
import { VisLogAppSide } from "../../../2.0/dist/vis-side/vis-log-appside";

const vis = new VisLogAppSide();

AppSideService(
  BaseSideService({
    onInit() {
      vis.attachSideRelay(this);
      vis.log("Hello from AppSide!");
    },

    // onRequest(req, res) {
    //   res(null, { status: 'ok' });
    // },

    // stub to ignore the .onSettingsChange(blah) warning in console; unnecessary to have
    // onSettingsChange({ key, newValue, oldValue }) { }
  })
);