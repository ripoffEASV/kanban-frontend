import type { State } from "./i_state"
import type { User } from "./i_user"

export interface Project{
    projectID:string,
    projectName:string,
    projectStateIDs?:Array<any>[],
    inviteArray?:Array<{
        email: string,
        fName: string,
        lName: string,
        color: string,
    }>
    membersInfo?: User[],
    projectStates?: State[],
}