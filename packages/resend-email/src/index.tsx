import {Resend} from 'resend';
import EmailVerification from './templates/EmailVertification';
import ResetPassword from './templates/ResetPassword';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY)

export const sendVerificationEmail = async (email: string, token:string) => {
    const verificationLink = `${process.env.NEXT_PUBLIC_URL}/auth/new-verification?token=${token}`
    let from = process.env.NEXT_PUBLIC_SUPPORT_MAIL || "support";
    let subject = "Verify Your Email Address";
    const res = await resend.emails.send({
        from: from,
        to: email,
        subject: subject,
        react: <EmailVerification verificationLink={verificationLink} />,
    })
}


export const sendResetEmail = async (email: string, token:string) => {
    const resetPasswordLink = `${process.env.NEXT_PUBLIC_URL}/auth/reset-password?token=${token}`
    let from = process.env.NEXT_PUBLIC_SUPPORT_MAIL || "support";
    let subject = "Verify Your Email Address";
    await resend.emails.send({
        from: from,
        to: email,
        subject: subject,
        react: <ResetPassword resetPasswordLink={resetPasswordLink} />,
    })
}

export const createContact = async( email: string) => {
    await resend.contacts.create({
        email: email,
        audienceId: process.env.NEXT_PUBLIC_RESEND_AUDIENCE_ID || "",
    })
}
