import { CareerUUID, ClassCode, HubUUID } from "./utils"

export interface StudentViewHubData {
    hubId: HubUUID
    classCode: ClassCode
    careerUUID: CareerUUID
    slideId: string
    hubName: string
}

export interface StudentJoinedHubData {
	username: string
	userId: number
}

export interface TeacherViewHubData extends StudentViewHubData {
	studentsJoined: StudentJoinedHubData[]
}
