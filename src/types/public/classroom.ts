import { TeacherName } from "./teacher"

export interface StudentData {
	username: string
	didAccept: boolean
}

export interface StudentInviteJoinClass {
	teacherNameInfo: TeacherName
	classroomName: string
}
