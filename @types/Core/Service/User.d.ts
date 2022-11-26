export declare interface ChatUser {
	UUID: string;
	Room: string[];
	Nickname: string;
	ID: string;
}

export declare interface LtUser {
	Info: ChatUser;
	Account: LtAccount;
}

export declare interface LtAccount {
	Username: string;
	Password: string;
	CreatedAt: Date;
	Authority: 'USER' | 'ADMIN' | 'OWNER';
}
