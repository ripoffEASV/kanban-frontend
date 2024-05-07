import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Invitation } from '../interfaces/i_invitation';

export const useInvitationStore = defineStore('invitation', () => {
  const invitations = ref<Invitation[]>([]);
  
    // Getter to get all invitations
    const getInvitations = () => invitations.value;

    // Setter to set invitations
    const setInvitations = (newInvitations: Invitation[]) => {
        invitations.value = newInvitations;
    };

    // Function to get the number of invitations
    const countInvitations = () => invitations.value.length;

    // Function to add an invitation
    const addInvitation = (invitation: Invitation) => {
        invitations.value.push(invitation);
    };

    // Function to remove an invitation by id
    const removeInvitation = (invitationId: string) => {
        invitations.value = invitations.value.filter(invite => invite.id !== invitationId);
    };

    return {
        invitations,
        getInvitations,
        setInvitations,
        addInvitation,
        removeInvitation,
        countInvitations
    };
})