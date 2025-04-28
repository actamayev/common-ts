import { User } from "../models"

export function validateEmail(email: string): boolean {
	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return regex.test(email)
}

export function validateUser(user: Partial<User>): string[] {
	const errors: string[] = []

	if (!user.username || user.username.length < 3) {
		errors.push("Username must be at least 3 characters")
	}

	if (!user.email || !validateEmail(user.email)) {
		errors.push("Valid email is required")
	}

	return errors
}
