export declare interface LoginInfo {
	Account: KakaoAccount;
	Options?: LoginOption;
}

export declare interface KakaoAccount {
	Email: string;
	Password: string;
	Device: Device;
}

export declare interface Device {
	UUID: string;
	Name: string;
}

export declare interface LoginOption {
	Force?: boolean;
	RetryCount?: number;
	RetryInteral?: number;
}
