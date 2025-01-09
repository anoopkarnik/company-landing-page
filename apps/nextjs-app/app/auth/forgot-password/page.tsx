'use client'

import { useRouter} from 'next/navigation'
import React, {useState,useEffect } from 'react'
import ForgotPasswordPage from '@repo/ui/templates/auth/v1/ForgotPasswordPage'
import { ForgotPassword } from '../_actions/forgot-password'
import { DataResultProps } from '@repo/ts-types/auth/v1'

const ForgotPasswordClient = () => {
    const router = useRouter()

    const quote = 'The only way to do great work is to love what you do.'
    const author = 'Late Steve Jobs'
    const credential = 'Ex CEO of Apple Inc.'
    const title = 'Forgot Password'
    const description = 'Enter your email to reset your password.'
    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()

    const goToLoginPage = ()=>{
        router.push('/auth/login')
    }

    const ResetPasswordFunction = async (email: string) => {
        if (success || error) return;
        try {
            const data:DataResultProps = await ForgotPassword(email)
            setSuccess(data?.success)
            setError(data?.error)
        } catch  {
            setError("Something went wrong!")
        }
    }

    useEffect(()=>{
      
  },[success,error])

  return (
    <div>
      <ForgotPasswordPage errorMessage={error} successMessage={success} resetFunction={ResetPasswordFunction} backFunction={goToLoginPage} 
      title={title} description={description} quote={quote} author={author} credential={credential} />
    </div>
  )
}

export default ForgotPasswordClient