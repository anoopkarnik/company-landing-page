import React, { Suspense } from 'react'
import LoadingCard from '../../../organisms/custom/auth/v1/LoadingCard'
import Quote from '../../../organisms/custom/auth/v1/Quote'
import VerificationCard from '../../../organisms/custom/auth/v1/VerificationCard'
import { VerificationPageProps } from '@repo/ts-types/auth/v1'

const NewVerificationPage = ({errorMessage,successMessage,backFunction,title,description,quote,author,credential}:VerificationPageProps) => {
  return (
    <div className='min-h-screen grid grid-cols-1 lg:grid-cols-2 '>
        <div className='flex items-center justify-center bg-gradient-to-br from-primary to-black dark:bg-gradient-to-br'>
            <Suspense fallback={<LoadingCard title={title} description={description}/>}>
                <VerificationCard errorMessage={errorMessage} successMessage={successMessage} backFunction={backFunction}/>
            </Suspense>
        </div>
        <div className='hidden lg:block bg-white'>
            <Quote quote={quote} author={author} credential={credential}/>
        </div>
    </div>
  )
}

export default NewVerificationPage