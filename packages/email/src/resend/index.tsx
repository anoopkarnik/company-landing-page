import { Resend } from 'resend';

export const createContact = async (email: string) => {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const response = await resend.contacts.create({
        email: email,
        audienceId: process.env.RESEND_AUDIENCE_ID || "",
    })
    return response
}

export const sendSupportEmail = async (supportEmail: string, subject: string, body: string) => {
    const resend = new Resend(process.env.RESEND_API_KEY)

    const response = await resend.emails.send({
        from: supportEmail,
        to: supportEmail,
        subject,
        text: body
    });
    return response;
};
