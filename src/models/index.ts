export interface User {
	id: string;
	username: string;
	email: string;
	createdAt: Date;
}

export enum UserRole {
	ADMIN = "admin",
	USER = "user",
	GUEST = "guest"
}
