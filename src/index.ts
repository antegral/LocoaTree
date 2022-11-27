import { VERSION } from './runinfo.json';
import prompts from 'prompts';
import registerDevice from './TalkClient';
import { logger } from './logger';
import LocoaTreeCore from './Core';

export default class Main {
	public regDevice: registerDevice;

	constructor() {
		console.log('LocoaTree, KakaoTalk Bot Framework.');
		this.readVersion();
		this.regDevice = new registerDevice();
		this.start();
	}

	start() {
		this.regDevice.check().then(async (loginResult) => {
			if (loginResult?.status) {
				new LocoaTreeCore();
			} else {
				await this.regDevice.generateDevice();
				await this.regDevice.register();
			}
		});
	}

	shutdown() {
		throw new String('Shutdown LocoaTree.');
	}

	readVersion() {
		VERSION
			? console.log(`VERSION > ${VERSION}`)
			: () => {
					throw new Error(
						'버전을 읽는 중에 오류가 발생했습니다. 재설치 하세요.',
					);
			  };
	}
}
