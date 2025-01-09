
import { atom, useRecoilState, useSetRecoilState } from "recoil";
import {UserDetailsProps } from "@repo/ts-types/home/v1";

export const userDetailsState = atom<UserDetailsProps>({
    key: "userDetailsState", // Unique key for this atom
    default: {
        creditsUsed: 0,
        access: "",
        name: "",
        email: "",
        role: "",
        image: ""
    } // Initial empty array of notifications
});

// Optional: Selector hook for components that only need to read user details
export function useUserDetails() {
    const [userDetails] = useRecoilState(userDetailsState);
    return userDetails;
}

// Optional: Selector hook for components that only need to modify user details
export function useSetUserDetails() {
    const setUserDetails = useSetRecoilState(userDetailsState);
    return setUserDetails
}