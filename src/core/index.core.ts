import { logger } from "../logger";

export default class LocoaTreeCore {
  constructor() {
    console.log("LocoaTree Core >> Starting...");
    logger.debug("starting locoatree core...");
    this.init();
  }

  init() {
    console.log("init check...");
    return new Promise((res, rej) => {
      // DB Check Logic
    });
  }
}
