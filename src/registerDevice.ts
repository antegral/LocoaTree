import * as config from "../config/account.config.json";
import { accountConfig } from "../@types/account.config";
import prompts from "prompts";
import { writeFileSync } from "fs";
import { join } from "path";
import { util, AuthApiClient } from "node-kakao";

export default class registerDevice {
  private accountData: any;
  private configData: accountConfig;

  constructor(email: string, password: string) {
    this.configData = config;
    this.accountData = {
      email,
      password,
      forced: true,
    };
  }

  async check() {
    if (
      this.configData.RegisteredDeviceName ||
      this.configData.RegisteredUUID
    ) {
      (
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
      this.configData.RegisteredDeviceName = value;
    });

    this.configData.RegisteredUUID = util.randomWin32DeviceUUID();

    writeFileSync(
      join(__dirname, "..", "/config", "/account.config.json"),
      Buffer.from(JSON.stringify(this.configData))
    );
  }

  async register() {
    await prompts({
      type: "text",
      name: "authCode",
      message: "카카오톡으로 전송된 기기 인증번호를 입력해주세요.",
      validate: (value) =>
        0 <= parseInt(value) && parseInt(value) <= 9999
          ? true
          : `인증번호는 4자리의 숫자 입니다!`,
    });
  }

  async checkCode(passcode: string) {
    if (
      this.configData.RegisteredDeviceName &&
      this.configData.RegisteredUUID
    ) {
      let client = await AuthApiClient.create(
        this.configData.RegisteredDeviceName,
        this.configData.RegisteredUUID
      );

      return (await client.registerDevice(this.accountData, passcode, true))
        .status;
    } else {
      return false;
    }
  }
}
