export interface JwtPayload {
	userId: number
	username: string | null
	isActive?: boolean
	iat?: number
	exp?: number
}
