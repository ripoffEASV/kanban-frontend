import * as GLOBAL from '../Globals/GLOBALS'
import type { Invitation } from '../../interfaces/i_invitation';

export default function orgInvites() {

    const numberOfInvites = async () => {
        const response = await fetch(GLOBAL.URL + 'organizations/checkUserInvites');
        if (!response.ok) {
            throw new Error('Failed to fetch organization invites for user');
        }
    }

    return { numberOfInvites };
}