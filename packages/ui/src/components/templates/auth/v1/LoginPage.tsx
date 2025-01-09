import React, { Suspense } from 'react'
import LoadingCard from '../../../organisms/custom/auth/v1/LoadingCard'
import LoginCard from '../../../organisms/custom/auth/v1/LoginCard'
import Quote from '../../../organisms/custom/auth/v1/Quote'
import { LoginPageProps } from '@repo/ts-types/auth/v1';

const LoginPage = ({showEmail,showGoogleProvider,showGithubProvider,showLinkedinProvider,onEmailSubmit,onGoogleProviderSubmit,
    onGithubProviderSubmit,onLinkedinProviderSubmit,forgotPasswordFunction,backFunction,errorMessage,title,description,
    quote,author,credential}:LoginPageProps) => {
  return (
    <div className='min-h-screen grid grid-cols-1 lg:grid-cols-2 '>
        <div className='flex items-center justify-center bg-gradient-to-br from-primary to-black dark:bg-gradient-to-br'>
            <Suspense fallback={<LoadingCard title={title} description={description}/>}>
                <LoginCard showEmail={showEmail} showGoogleProvider={showGoogleProvider} showGithubProvider={showGithubProvider}
                 showLinkedinProvider={showLinkedinProvider} onEmailSubmit={onEmailSubmit} onGoogleProviderSubmit={onGoogleProviderSubmit} 
                 onGithubProviderSubmit={onGithubProviderSubmit} onLinkedinProviderSubmit={onLinkedinProviderSubmit} 
                 forgotPasswordFunction={forgotPasswordFunction} backFunction={backFunction} errorMessage={errorMessage}/>
            </Suspense>
        </div>
        <div className='hidden lg:block bg-white'>
            <Quote quote={quote} author={author} credential={credential}/>
        </div>
    </div>
  )
}

export default LoginPage