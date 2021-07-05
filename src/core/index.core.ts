import { logger } from "../logger";
import { PrismaClient } from "@prisma/client";

export default class LocoaTreeCore {
  private prisma: PrismaClient;

  constructor() {
    console.log("<< LocoaTree Core >>");
    this.init();
  }

  async init() {
    this.prisma = new PrismaClient();
    logger.info("LTCore init check...");

    await this.prisma
      .$connect()
      .then(() => {
        logger.info("Database Connected. (1/1)");
      })
      .catch(() => {
        logger.error("Database connect error!");
      });

    logger.info("All tasks complated. Starting LTCore...");
  }
}
