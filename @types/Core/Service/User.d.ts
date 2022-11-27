export declare interface ChatUser {
	UUID?: string;
	RoomFrom: string;
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
	Rooms: string[];
	CreatedAt: Date;
	Authority: 'USER' | 'ADMIN' | 'OWNER';
}
