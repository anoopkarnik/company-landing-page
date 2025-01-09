import React, { Suspense } from 'react'
import LoadingCard from '../../../organisms/custom/auth/v1/LoadingCard'
import Quote from '../../../organisms/custom/auth/v1/Quote'
import { ForgotPasswordPageProps } from '@repo/ts-types/auth/v1';
import ForgotPasswordCard from '../../../organisms/custom/auth/v1/ForgotPasswordCard';

const ForgotPasswordPage = ({errorMessage,resetFunction,title,description,backFunction,quote,author,credential}:ForgotPasswordPageProps) => {
  return (
    <div className='min-h-screen grid grid-cols-1 lg:grid-cols-2 '>
        <div className='flex items-center justify-center bg-gradient-to-br from-primary to-black dark:bg-gradient-to-br'>
            <Suspense fallback={<LoadingCard title={title} description={description}/>}>
                <ForgotPasswordCard resetFunction={resetFunction} backFunction={backFunction} errorMessage={errorMessage}/>
            </Suspense>
        </div>
        <div className='hidden lg:block bg-white'>
            <Quote quote={quote} author={author} credential={credential}/>
        </div>
    </div>
  )
}

export default ForgotPasswordPage