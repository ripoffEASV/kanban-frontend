export default interface Project{
    projectID:number,
    projectName:string,
    projectStateID?:number,
    inviteArray?:Array<{
        email: string,
        fName: string,
        lName: string,
        color: string,
    }>
}