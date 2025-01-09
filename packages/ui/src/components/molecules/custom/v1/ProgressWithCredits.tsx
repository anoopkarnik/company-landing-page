import React, { useEffect, useState } from 'react'
import { Progress } from '../../../atoms/shadcn/progress'
import { CreditsProps } from '@repo/ts-types/home/v1'

const ProgressWithCredits = ({creditsUsed, maxTrialCredits,maxProCredits,access}:CreditsProps) => {
    const [creditsPercentageUsed, setCreditsPercentageUsed] = useState(0)

    useEffect(() => {
        if(access === 'PRO'){
            setCreditsPercentageUsed(creditsUsed*100/ maxProCredits)
        }
        else if(access === 'TRIAL'){
            setCreditsPercentageUsed(creditsUsed*100/ maxTrialCredits)
        }
    }, [creditsUsed,  maxTrialCredits, maxProCredits, access])

  return (
    <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between'>
            <div className='text-description'>Credits Used</div>
            <div className='text-description'>{access=="PRO"?`${creditsUsed}/${maxProCredits}`:`${creditsUsed}/${maxTrialCredits}`}</div>
        </div>
       <Progress value={access=="PRO"?creditsUsed*100/maxProCredits:creditsUsed*100/maxTrialCredits} /> 
    </div>
  )
}

export default ProgressWithCredits