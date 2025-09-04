import { TeacherName } from "./teacher"

export interface StudentData {
	username: string
	inviteStatus: "PENDING" | "ACCEPTED" | "DECLINED"
}

export interface StudentInviteJoinClass {
	teacherNameInfo: TeacherName
	classroomName: string
}
