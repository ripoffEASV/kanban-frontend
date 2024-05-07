import type { User } from "./i_user";

export interface Invitation {
    id: string;
    orgName: string;
    owner?: User;
}