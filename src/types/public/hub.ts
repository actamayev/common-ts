import { CareerUUID, ClassCode } from "./utils"
import { UUID } from "crypto"

export interface StudentViewHubData {
    hubId: UUID
    classCode: ClassCode
    careerUUID: CareerUUID
    slideId: string
    hubName: string
}

export interface TeacherViewHubData extends StudentViewHubData {
	studentsJoined: {
		username: string
		userId: number
	}[]
}
