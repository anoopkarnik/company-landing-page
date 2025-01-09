import React, { Suspense } from 'react'
import LoadingCard from '../../../organisms/custom/auth/v1/LoadingCard'
import Quote from '../../../organisms/custom/auth/v1/Quote'
import { ResetPasswordPageProps} from '@repo/ts-types/auth/v1'
import ResetPasswordCard from '../../../organisms/custom/auth/v1/ResetPasswordCard'

const ResetPasswordPage = ({errorMessage,successMessage,token,backFunction,resetFunction,title,description,quote,author,credential}:ResetPasswordPageProps) => {
  return (
    <div className='min-h-screen grid grid-cols-1 lg:grid-cols-2 '>
        <div className='flex items-center justify-center bg-gradient-to-br from-primary to-black dark:bg-gradient-to-br'>
            <Suspense fallback={<LoadingCard title={title} description={description}/>}>
                <ResetPasswordCard token={token} resetFunction={resetFunction} backFunction={backFunction} 
                errorMessage={errorMessage} successMessage={successMessage}/>
            </Suspense>
        </div>
        <div className='hidden lg:block bg-white'>
            <Quote quote={quote} author={author} credential={credential}/>
        </div>
    </div>
  )
}

export default ResetPasswordPage