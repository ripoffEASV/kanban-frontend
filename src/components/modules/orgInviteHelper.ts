const baseURL = import.meta.env.VITE_API_URL
import type { Invitation } from '../../interfaces/i_invitation'
import { useInvitationStore } from '../../stores/invitationStore'

export default function orgInvites() {
  const { setInvitations } = useInvitationStore()

  const numberOfInvites = async () => {
    console.log(baseURL)
    try {
      const response = await fetch(baseURL + 'organizations/check-user-invites', {
        method: 'GET',
        credentials: 'include'
      })

      if (!response.ok) {
        // console.error('Failed to fetch organization invites for user');
        return
      }

      const invitations = await response.json()
      setInvitations(invitations)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const acceptInvite = async (orgID) => {
    try {
      const response = await fetch(baseURL + 'organizations/accept-org-inv/' + orgID, {
        method: 'GET',
        credentials: 'include'
      })

      if (!response.ok) {
        return
      }
      numberOfInvites()
    } catch (err) {
      console.error(err)
    }
  }

  const declineInvite = async (orgID) => {
    try {
      const response = await fetch(baseURL + 'organizations/decline-org-inv/' + orgID, {
        method: 'GET',
        credentials: 'include'
      })

      if (!response.ok) {
        return
      }
      numberOfInvites()
    } catch (err) {
      console.error(err)
    }
  }

  return { numberOfInvites, acceptInvite, declineInvite }
}
