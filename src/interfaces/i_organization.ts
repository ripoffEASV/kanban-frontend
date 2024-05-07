import type { User } from '../interfaces/i_user'
export interface Organization {
  orgID: number
  orgName: string
  createdByID: string
  ownerID: string[]
  orgMembers?: string[]
  projectIDs?: string[]
  inviteArray?: string[]
  owner?: User[]
  members?: User[]
  _id?: string
}
