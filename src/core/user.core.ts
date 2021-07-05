import { logger } from "./../logger";
import { PrismaClient } from "@prisma/client";
import { ltUserData, ltRegisteredUserData } from "./../../@types/core";

export default class LocoaTreeUser {
  protected prisma: PrismaClient;
  protected userData: ltUserData | ltRegisteredUserData;

  constructor(userData: ltUserData | ltRegisteredUserData) {
    this.userData = userData;
  }

  async addUser() {
    await this.prisma.users.create({
      data: {
        room: this.userData.room,
        nickname: this.userData.nickname,
        ID: this.userData.ID,
        createdAt: new Date(),
      },
    });
  }

  async register() {
    // if a username exists, this data is registered. (ltRegisteredUserData must include username)
    if ("username" in this.userData) {
      await this.prisma.accounts
        .create({
          data: this.userData,
        })
        .then(() => {
          return true;
        })
        .catch(() => {
          return false;
        });
    } else if ("UUID" in this.userData) {
      // ltRegisteredUserData가 아니라면, 타입은 ltUserData로 추론 될 수 있음.
      return false; // ltRegisteredUserData의 데이터가 필요함.
    } else {
      return null; // 타입이 일치하지 않을 경우
    }
  }
}

export class UserOptions extends LocoaTreeUser {
  async isRegistered() {
    // get usersResult
    let usersResult = await this.prisma.users.findUnique({
      where: { UUID: this.userData.UUID },
    });

    // get registeredUsersResult
    let registeredUsersResult = await this.prisma.accounts.findUnique({
      where: { UUID: this.userData.UUID },
    });

    if (registeredUsersResult) {
      return true; // registeredUsersResult is exist. > Registered.
    } else if (usersResult) {
      return false; // not exist registeredUsersResult, > Unregistered.
    } else {
      return null;
    }
  }

  async getUserInfo() {
    // get usersResult
    let usersResult = await this.prisma.users.findUnique({
      where: { UUID: this.userData.UUID },
    });

    // get registeredUsersResult
    let registeredUsersResult = await this.prisma.accounts.findUnique({
      where: { UUID: this.userData.UUID },
    });

    if (usersResult) {
      return {
        usersResult,
        isRegistered: registeredUsersResult ? true : false,
        accountData: registeredUsersResult,
      };
    } else return null;
  }

  async resign() {
    let isRegistered = await this.isRegistered();

    if (isRegistered === true) {
      return this.prisma.accounts
        .delete({
          where: {
            UUID: this.userData.UUID,
          },
        })
        .then(() => {
          return true; // account successfully deleted.
        })
        .catch(() => {
          return false; // Failed to delete the account.
        });
    } else {
      return null; // Unregistered.
    }
  }
}
