import * as config from "../config/account.config.json";
import { accountConfig } from "../@types/account.config";
import { accountData } from "../@types/registerDevice";
import prompts from "prompts";
import { writeFileSync } from "fs";
import { join } from "path";
import { util, AuthApiClient } from "node-kakao";
import { logger } from "./logger";

export default class registerDevice {
  private accountData: accountData;
  private configData: accountConfig;

  constructor() {
    this.configData = config;
    this.accountData = {
      email: config.KAKAO_ACCOUNT.USERNAME,
      password: config.KAKAO_ACCOUNT.PASSWORD,
      forced: true,
    };
  }

  async check() {
    if (config.RegisteredDeviceName || config.RegisteredUUID) {
      return (
        await AuthApiClient.create(
          this.configData.RegisteredDeviceName ||
            this.configData.RegisteredDeviceName,
          this.configData.RegisteredUUID
        )
      ).login(this.accountData);
    } else {
      return null;
    }
  }

  generateDevice() {
    return prompts({
      type: "text",
      name: "clientName",
      message: "클라이언트의 이름을 입력해주세요.",
    })
      .then((value) => {
        logger.info("selected client name: " + value.clientName);

        return {
          RegisteredDeviceName: value.clientName,
          RegisteredUUID: util.randomWin32DeviceUUID(),
        };
      })
      .then((registeredDeviceData) => {
        let configData = {
          AUTO_RETRY_CONNECT: config.AUTO_RETRY_CONNECT,

          KAKAO_ACCOUNT: {
            USERNAME: config.KAKAO_ACCOUNT.USERNAME,
            PASSWORD: config.KAKAO_ACCOUNT.PASSWORD,
          },

          RegisteredDeviceName: registeredDeviceData.RegisteredDeviceName,
          RegisteredUUID: registeredDeviceData.RegisteredUUID,
        };
        // let assignedData = Object.assign(configData, registeredDeviceData);

        writeFileSync(
          join(__dirname, "../config/account.config.json"),
          JSON.stringify(configData)
        );

        logger.info("config assign completed.");

        return configData;
      });
  }

  async register() {
    if (
      this.configData.RegisteredDeviceName &&
      this.configData.RegisteredUUID
    ) {
      let client = await AuthApiClient.create(
        this.configData.RegisteredDeviceName,
        this.configData.RegisteredUUID
      );

      let response = await prompts({
        type: "text",
        name: "authCode",
        message: "카카오톡으로 전송된 기기 인증번호를 입력해주세요.",
        validate: (value) =>
          0 <= parseInt(value) && parseInt(value) <= 9999
            ? true
            : `인증번호는 4자리의 숫자 입니다!`,
      });

      let passcode = response.authCode as string;

      return (await client.registerDevice(this.accountData, passcode, true))
        .status;
    } else {
      this.generateDevice().then(() => {
        this.register();
      });
    }
  }
}
