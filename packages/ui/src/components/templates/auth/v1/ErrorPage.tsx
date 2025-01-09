"use client"

import {ErrorPageProps} from '@repo/ts-types/auth/v1'
import ErrorCard from '../../../organisms/custom/auth/v1/ErrorCard'
import Quote from '../../../organisms/custom/auth/v1/Quote'

const ErrorPage = ({errorMessage,backFunction,quote,author,credential}:ErrorPageProps) => {

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 '>
      <div className='flex items-center justify-center bg-gradient-to-br from-violet-400/30 to-black/90 dark:bg-gradient-to-br'>
          <ErrorCard errorMessage={errorMessage} backFunction={backFunction}/>
      </div>
      <div className='invisible lg:visible bg-white'>
          <Quote quote={quote} author={author} credential={credential}/>
      </div>
</div>
  )
}

export default ErrorPage