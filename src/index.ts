import { VERSION } from "./runinfo.json";
import prompts from "prompts";
import {} from "node-kakao";

export default class LocoaTree {
  constructor() {
    console.log("LocoaTree, Kakao Bot Framework.");
    this.readVersion();
    this.start();
  }

  start() {}

  shutdown() {}

  readVersion() {
    VERSION
      ? console.log(`VERSION > ${VERSION}`)
      : () => {
          throw new Error(
            "버전을 읽는 중에 오류가 발생했습니다. 재설치 하세요."
          );
        };
  }
}
