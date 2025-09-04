import { TeacherName } from "./teacher"

export type StudentInviteStatus = "PENDING" | "ACCEPTED" | "DECLINED"

export interface StudentData {
	username: string
	inviteStatus: StudentInviteStatus
}

export interface StudentInviteJoinClass {
	teacherNameInfo: TeacherName
	classroomName: string
}
