import LoadingCard from '../../../organisms/custom/auth/v1/LoadingCard'
import Quote from '../../../organisms/custom/auth/v1/Quote'
import React, { Suspense } from 'react'

import { RegisterPageProps } from '@repo/ts-types/auth/v1'
import RegisterCard from '../../../organisms/custom/auth/v1/RegisterCard'

const RegisterPage = ({title,description,quote,author,credential,showEmail,showGoogleProvider,showGithubProvider,
    showLinkedinProvider,onEmailSubmit,onGoogleProviderSubmit,onGithubProviderSubmit,
    onLinkedinProviderSubmit,backFunction,errorMessage}:RegisterPageProps) => {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 '>
        <div className='flex items-center justify-center bg-gradient-to-br from-primary to-black dark:bg-gradient-to-br'>
            <Suspense fallback={<LoadingCard title={title} description={description}/>}>
                <RegisterCard showEmail={showEmail} 
                showGoogleProvider={showGoogleProvider} showGithubProvider={showGithubProvider} 
                showLinkedinProvider={showLinkedinProvider} onEmailSubmit={onEmailSubmit} 
                onGoogleProviderSubmit={onGoogleProviderSubmit} onGithubProviderSubmit={onGithubProviderSubmit} 
                onLinkedinProviderSubmit={onLinkedinProviderSubmit} backFunction={backFunction} errorMessage={errorMessage}/>
            </Suspense>
        </div>
        <div className='invisible lg:visible bg-white'>
            <Quote quote={quote} author={author} credential={credential}/>
        </div>
    </div>
  )
}

export default RegisterPage