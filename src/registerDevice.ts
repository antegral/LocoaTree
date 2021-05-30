import * as config from "../config/account.config.json";
import { accountConfig } from "../@types/account.config";
import prompts from "prompts";
import { writeFileSync } from "fs";
import { join } from "path";
import { util, AuthApiClient } from "node-kakao";

export default class registerDevice {
  private accountData: any;
  private configData: accountConfig;

  constructor() {
    this.configData = config;
    this.accountData = {
      email: this.configData.KAKAO_ACCOUNT.USERNAME,
      password: this.configData.KAKAO_ACCOUNT.PASSWORD,
      forced: true,
    };
  }

  async check() {
    if (
      this.configData.RegisteredDeviceName ||
      this.configData.RegisteredUUID
    ) {
      return (
        await AuthApiClient.create(
          this.configData.RegisteredDeviceName,
          this.configData.RegisteredUUID
        )
      ).login(this.accountData);
    } else {
      return null;
    }
  }

  async generateDevice() {
    await prompts({
      type: "text",
      name: "clientName",
      message: "클라이언트의 이름을 입력해주세요.",
    }).then((value) => {
      this.configData.RegisteredDeviceName = value.clientName as string;
      this.configData.RegisteredUUID = util.randomWin32DeviceUUID();
      console.log(`this.configData.RegisteredUUID`);
    });

    writeFileSync(
      join(__dirname, "..", "/config", "/account.config.json"),
      Buffer.from(JSON.stringify(this.configData))
    );
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
