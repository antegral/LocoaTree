import { PrismaClient } from '@prisma/client';

export default class LtDatabase extends PrismaClient {
	/**
	 * @version 1.0.0
	 * @author ANTEGRAL <antegral@antegral.net>
	 * @description Establish database connection
	 * @returns {Promise<null | Error>}
	 */
	async Connect(): Promise<null | Error> {
		return await this.$connect()
			.then(() => {
				return null;
			})
			.catch((Reason) => {
				return new Error(Reason);
			});
	}

	/**
	 * @version 1.0.0
	 * @author ANTEGRAL <antegral@antegral.net>
	 * @description Terminate database connection
	 * @returns {Promise<null | Error>}
	 */
	async Disconnect(): Promise<null | Error> {
		return await this.$disconnect()
			.then(() => {
				return null;
			})
			.catch((Reason) => {
				return new Error(Reason);
			});
	}
}
