import prompts from 'prompts';
import { util } from 'node-kakao';
import { DeviceTypes } from '@LtTypes/interactive';
import { Log } from '@Internal/Log';
import { Device } from '@LtTypes/internal';

const GetDeviceInfo = async (): Promise<Device | null> => {
	const DeviceInfo = await prompts([
		{
			type: 'text',
			name: 'Name',
			message: 'Please enter the name of the client.',
			validate: (value: string) =>
				value.length > 0 ? true : 'Client name cannot be empty!',
		},
		{
			type: 'text',
			name: 'UUID',
			message: 'Input the device UUID in Base64 format. (Optional)',
			validate: (value: string) =>
				value.length > 0 ? true : 'Client name cannot be empty!',
			initial: undefined,
		},
	]);

	const DeviceType = await prompts({
		type: 'select',
		name: 'Type',
		message: 'Select Device Type.',
		choices: [
			{
				title: 'Win32',
				description: '(Recommended)',
				value: DeviceTypes.Win32,
			},
			{ title: 'Blue', value: DeviceTypes.Android },
		],
	});

	if (DeviceInfo.UUID) {
		const Result = {
			UUID: DeviceInfo.UUID as string,
			Name: DeviceInfo.Name as string,
		};
		return Result;
	}

	let GeneratedUUID = '';

	switch (DeviceType.Type) {
		case DeviceTypes.Win32:
			GeneratedUUID = util.randomWin32DeviceUUID();
			break;
		case DeviceTypes.Android:
			GeneratedUUID = util.randomAndroidSubDeviceUUID();
			break;
		default:
			Log.error('GetDeviceInfo > invalid Device type');
			return null;
	}

	const Result = {
		UUID: GeneratedUUID,
		Name: DeviceInfo.Name as string,
	};

	return Result;
};

const GetPasscode = async () => {
	const Answer = await prompts({
		type: 'text',
		name: 'AuthCode',
		message: '카카오톡으로 전송된 기기 인증번호를 입력해주세요.',
		validate: (value: string) =>
			0 <= parseInt(value) && parseInt(value) <= 9999
				? true
				: '인증번호는 4자리의 숫자 입니다!',
	});
	return Answer.AuthCode as string;
};

export { GetDeviceInfo, GetPasscode };
