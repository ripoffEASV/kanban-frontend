export interface Organization{
    orgID: number,
    orgName: string,
    createdByID: number,
    ownerID: number,
    orgMembers: number[],
    projectID?:number[],
    inviteArray?:number[]
}