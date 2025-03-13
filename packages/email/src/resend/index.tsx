import {Resend} from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || "");


export const createContact = async( email: string) => {
    await resend.contacts.create({
        email: email,
        audienceId: process.env.RESEND_AUDIENCE_ID || "",
    })
}
