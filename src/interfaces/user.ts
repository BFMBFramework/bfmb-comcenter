export interface IUser {
	name?: string,
	password?: string,
	networks?: any

	verifyPasswordSync(password: string): boolean
}