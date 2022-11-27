import LtDatabase from '@Internal/Database';
import Database from '@Internal/Database';
import { ChatUser } from '@LtTypes/service';
import { users } from '@prisma/client';
import { ChannelUser, ChannelUserInfo } from 'node-kakao';

export class UserService {
	private Database: LtDatabase;
	private User: ChannelUserInfo;

	constructor(Database: LtDatabase, User: ChannelUserInfo) {
		this.Database = Database;
		this.User = User;
	}

	async IsRegisteredChatUser() {
		return await this.Database.users
			.count({
				where: {
					ID: this.User.userId.toString(),
				},
			})
			.then(() => {
				return null;
			})
			.catch((err) => {
				return new Error(err);
			});
	}

	/**
	 * @version 1.0.0
	 * @author ANTEGRAL <antegral@antegral.net>
	 * @description Establish database connection
	 * @returns {Promise<Error | users>}
	 */

	async AddUser(): Promise<Error | users> {
		return await this.Database.users
			.create({
				data: {
					room: '',
					nickname: this.User.nickname,
					ID: this.User,
					createdAt: new Date(),
				},
			})
			.then((User: users) => {
				return User;
			})
			.catch((err) => {
				return new Error(err);
			});
	}

	// async Register() {

	// 		await this.Database.accounts
	// 			.create({
	// 				data: this.User,
	// 			})
	// 			.then(() => {
	// 				return true;
	// 			})
	// 			.catch(() => {
	// 				return false;
	// 			});
	// 	} else if ('UUID' in this.userData) {
	// 		// ltRegisteredUserData가 아니라면, 타입은 ltUserData로 추론 될 수 있음.
	// 		return false; // ltRegisteredUserData의 데이터가 필요함.
	// 	} else {
	// 		return null; // 타입이 일치하지 않을 경우
	// 	}
	// }
}

// export class LtAccountOptions extends UserService {
// 	constructor(Database: LtDatabase, UserData: ChatUser) {
// 		super(Database, UserData);
// 	}

// 	async IsRegisteredLtChatUser() {
// 		// get usersResult
// 		let usersResult = await this.prisma.users.findUnique({
// 			where: { UUID: this.userData.UUID },
// 		});

// 		// get registeredUsersResult
// 		let registeredUsersResult = await this.prisma.accounts.findUnique({
// 			where: { UUID: this.userData.UUID },
// 		});

// 		if (registeredUsersResult) {
// 			return true; // registeredUsersResult is exist. > Registered.
// 		} else if (usersResult) {
// 			return false; // not exist registeredUsersResult, > Unregistered.
// 		} else {
// 			return null;
// 		}
// 	}

// 	async getUserInfo() {
// 		// get usersResult
// 		let usersResult = await this.prisma.users.findUnique({
// 			where: { UUID: this.userData.UUID },
// 		});

// 		// get registeredUsersResult
// 		let registeredUsersResult = await this.prisma.accounts.findUnique({
// 			where: { UUID: this.userData.UUID },
// 		});

// 		if (usersResult) {
// 			return {
// 				usersResult,
// 				isRegistered: registeredUsersResult ? true : false,
// 				accountData: registeredUsersResult,
// 			};
// 		} else return null;
// 	}

// 	async resign() {
// 		let isRegistered = await this.isRegistered();

// 		if (isRegistered === true) {
// 			return this.prisma.accounts
// 				.delete({
// 					where: {
// 						UUID: this.userData.UUID,
// 					},
// 				})
// 				.then(() => {
// 					return true; // account successfully deleted.
// 				})
// 				.catch(() => {
// 					return false; // Failed to delete the account.
// 				});
// 		} else {
// 			return null; // Unregistered.
// 		}
// 	}
// }
