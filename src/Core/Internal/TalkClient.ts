import { AuthApiClient } from 'node-kakao';
import { KakaoAccount } from '@LtTypes/internal';
import { Log } from '@Internal/Log';
import { GetDeviceInfo, GetPasscode } from '@Interactive/Internal/TalkClient';

export default class TalkClient {
	private ApiDevice: AuthApiClient;
	private Credential: KakaoAccount;

	constructor(LoginCredential: KakaoAccount, AuthDevice: AuthApiClient) {
		this.ApiDevice = AuthDevice;
		this.Credential = LoginCredential;
	}

	/**
	 * @version 1.0.0
	 * @author ANTEGRAL <antegral@antegral.net>
	 * @description Creates a Device object.
	 * @return {Promise<AuthApiClient | null>}
	 */

	static async GetAuthDevice(): Promise<AuthApiClient | null> {
		Log.info('GetAuthDevice() > Enter CLI interactive mode.');
		const DeviceInfo = await GetDeviceInfo();

		if (DeviceInfo === null) {
			Log.error('GetAuthDevice() > GetDeviceInfo() Failed.');
			return null;
		} else {
			const Client: AuthApiClient | Error = await AuthApiClient.create(
				DeviceInfo.Name,
				DeviceInfo.UUID,
			).catch((Reason: any) => {
				return new Error(Reason);
			});

			if (Client instanceof Error) {
				Log.error(`GetAuthDevice() > ${Client.message}`);
				return null;
			} else if (Client instanceof AuthApiClient) {
				return Client;
			} else {
				Log.error('GetAuthDevice() > Type Guard failed.');
				return null;
			}
		}
	}

	/**
	 * @version 1.0.0
	 * @author ANTEGRAL <antegral@antegral.net>
	 * @description Log in to KakaoTalk
	 * @return {Promise<true | null>}
	 */

	async Login(): Promise<true | null> {
		const Result = await this.ApiDevice.login({
			email: this.Credential.Email,
			password: this.Credential.Password,
		}).catch((Reason: any) => {
			return new Error(Reason);
		});

		if (Result instanceof Error) {
			console.error(Result);
			return null;
		} else {
			return true;
		}
	}

	/**
	 * @version 1.0.0
	 * @author ANTEGRAL <antegral@antegral.net>
	 * @description Register the device to KakaoTalk Account
	 * @return {Promise<true | Error>}
	 */

	async Register(IsPermanent: boolean): Promise<true | null> {
		const AccountForm = {
			email: this.Credential.Email,
			password: this.Credential.Password,
		};

		const Client = await AuthApiClient.create(
			this.ApiDevice.name,
			this.ApiDevice.deviceUUID,
		);

		await Client.requestPasscode(AccountForm);

		Log.info('Send the authentication code.');
		const Passcode = await GetPasscode();

		Log.info('Attempt to register a device...');
		let registerResult = await Client.registerDevice(
			AccountForm,
			Passcode,
			IsPermanent,
		);

		if (registerResult?.success) {
			Log.info('Device registration completed.');

			Log.info('Device information saved in ./config/device.json');
			return true;
		} else {
			Log.error(
				`Register() > Device registration failed. Error Code: ${registerResult.status}`,
			);
			return null;
		}
	}
}
