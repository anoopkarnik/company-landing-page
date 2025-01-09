'use client'

import NewVerificationPage from '@repo/ui/templates/auth/v1/NewVerificationPage'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect, useState,useCallback } from 'react'
import { newVerification } from '../_actions/new-verification'

const NewVerificationContent = () => {

    const router = useRouter();
    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()
    const searchParams = useSearchParams();
    const token = searchParams?.get('token');

    const onSubmit = useCallback(async()=>{
        if (success || error) return;
        if(!token){
            setError("Missing token!")
            return
        }
        try{
            const data = await newVerification(token)
            setSuccess(data?.success)
            setError(data?.error)
        }catch{
            setError("Something went wrong!")
        }
    },[token,success,error])

    useEffect(()=>{
        onSubmit()
    },[onSubmit])
    
  const title = 'Loading...'
  const description = 'Please wait while we are loading the page!'
  const quote = 'The only way to do great work is to love what you do.'
  const author = 'Late Steve Jobs'
  const credential = 'Ex CEO of Apple Inc.'

  const goToLoginPage = () => {
    router.push('/auth/login')
  }

  return (
    <NewVerificationPage 
    errorMessage={error} 
    successMessage={success} 
    backFunction={goToLoginPage} 
    title={title} 
    description={description}
    quote={quote} 
    author={author} 
    credential={credential}/>
  )
}

const NewVerification = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewVerificationContent />
    </Suspense>
  )
}

export default NewVerification
