"use client"
import ErrorPage from '@repo/ui/templates/auth/v1/ErrorPage'
import { useRouter } from 'next/navigation'
import React from 'react'

const Error = () => {

  const router = useRouter()

  const quote = 'The only way to do great work is to love what you do.'
  const author = 'Late Steve Jobs'
  const credential = 'Ex CEO of Apple Inc.'
  const errorMessage = 'Oops! Something went wrong!'
  const goToLoginPage = ()=>{
      router.push('/auth/login')
  }

  return (
    <div>
      <ErrorPage errorMessage={errorMessage} backFunction={goToLoginPage} quote={quote} author={author} credential={credential}/>
    </div>
  )
}

export default Error;