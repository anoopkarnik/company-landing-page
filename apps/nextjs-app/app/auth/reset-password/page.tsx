'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect, useState } from 'react'
import ResetPasswordPage from '@repo/ui/templates/auth/v1/ResetPasswordPage'
import { verifyResetToken } from '../_actions/verify-reset-token'
import { resetPassword } from '../_actions/reset-password'
import ErrorPage from '@repo/ui/templates/auth/v1/ErrorPage'
import { DataResultProps } from '@repo/ts-types/auth/v1'

const ResetPasswordContent = () => {

    const router = useRouter();
    const [error, setError] = useState<string | undefined>('')
    const [success, setSuccess] = useState<string | undefined>('')
    const searchParams = useSearchParams();
    const token = searchParams?.get('token');
    
    useEffect(()=>{
        if (!token){
            setError("No token provided!")
        }
        verifyResetToken(token as string)
        .then((data:DataResultProps)=>{
            setError(data?.error);
            setSuccess(data?.success);
        })
    },[token,error,success])
    
  const title = 'Loading...'
  const description = 'Please wait while we are loading the page!'
  const quote = 'The only way to do great work is to love what you do.'
  const author = 'Late Steve Jobs'
  const credential = 'Ex CEO of Apple Inc.'

  const goToLoginPage = () => {
    router.push('/auth/login')
  }

  if (error){
    return (
        <ErrorPage
        errorMessage={error}
        quote={quote}
        author={author}
        credential={credential}
        backFunction={goToLoginPage}/>
    )
  }
  else if (success){
    return (
        <ResetPasswordPage 
        errorMessage={error}
        successMessage={success}
        token={token as string}
        backFunction={goToLoginPage}
        resetFunction={resetPassword}
        title={title}
        description={description}
        quote={quote}
        author={author}
        credential={credential}/>
    )
  }
}

const ResetPassword = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent/>
    </Suspense>
  )
}

export default ResetPassword
