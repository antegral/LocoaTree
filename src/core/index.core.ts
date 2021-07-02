import { logger } from "../logger";

export default class LocoaTreeCore {
  constructor() {
    console.log("LocoaTree Core");
    logger.info("Starting LocoaTree core...");
    this.init();
  }

  init() {
    logger.info("LTCore init check....");
    return new Promise((res, rej) => {
      // DB Check Logic
    });
  }
}
