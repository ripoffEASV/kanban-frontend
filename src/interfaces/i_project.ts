export default interface Project{
    projectID:number,
    projectName:string,
    projectStateIDs?:Array<any>[],
    inviteArray?:Array<{
        email: string,
        fName: string,
        lName: string,
        color: string,
    }>
}