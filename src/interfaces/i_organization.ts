import type { User } from '../interfaces/i_user'
export interface Organization {
  orgID: string
  orgName: string
  createdByID: string
  ownerID: string[]
  orgMembers?: string[]
  projectIDs?: string[]
  inviteArray?: string[]
  owner?: User[]
  createdByUser?: User[]
  members?: User[]
  id?: string
}
