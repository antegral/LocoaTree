export declare interface ltUserData {
  UUID: string;
  room: string[];
  nickname: string;
  ID: string;
}

export declare interface ltRegisteredUserData {
  UUID: string;
  room: string[];
  nickname: string;
  ID: string;
  username: string;
  password: string;
  createdAt: Date;
  authority: "USER" | "ADMIN" | "OWNER";
}
