export interface Organization {
  orgID: number
  orgName: string
  createdByID: string
  ownerID: string
  orgMembers?: string[]
  projectIDs?: string[]
  inviteArray?: string[]
  _id?: string
}
