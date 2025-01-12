"use server"

import {createContact} from "@repo/resend-email/mail"

export const createContactAction = async (email:string) => {
    // add to contact list
    try{
        const contact = await createContact(email)
        return {"success": "Successfully subscribed to our newsletter"}
    }
    catch{
        return {"error": "Failed to subscribe to our newsletter"}
    }
}