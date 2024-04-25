import * as GLOBAL from '../Globals/GLOBALS'
import type { Invitation } from '../../interfaces/i_invitation';
import { useInvitationStore } from '../../stores/invitationStore';

export default function orgInvites() {
    const { setInvitations } = useInvitationStore();

    const numberOfInvites = async () => {
        try {
            const response = await fetch(GLOBAL.URL + 'organizations/check-user-invites', {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) {
                // console.error('Failed to fetch organization invites for user');
                return;
            }

            const invitations = await response.json();
            setInvitations(invitations);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const acceptInvite = async (orgID) => {
        try {
            const response = await fetch(GLOBAL.URL + 'organizations/accept-org-inv/' + orgID, {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) {
                return;
            }
            numberOfInvites();
        } catch(err) {
            console.error(err);
        }
    }

    return { numberOfInvites, acceptInvite };
}