import React, { useState } from 'react'

import { SiGithub, SiNotion, SiYoutube } from 'react-icons/si'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { ProjectProps } from '@repo/ts-types/landing-page/projects'
import { useDeviceType } from '../../../../hooks/use-device'
import { Card, CardContent } from '../../shadcn/card'
import { cn } from '../../../../lib/utils'
import Image from 'next/image'
import { Button } from '../../../atoms/shadcn/button'

const ProjectDetails1 = ({project}:{project:ProjectProps}) => {

    const device = useDeviceType()
    const [showDetails, setShowDetails] = useState(false)

  return (
    <Card className={cn(`h-full`,
      device !== 'desktop' && 'w-full overflow-auto',
      device === 'desktop' && 'sticky top-10 max-w-[500px]'
    )}>
         <CardContent className='flex flex-col items-center justify-center gap-6 relative'>
            <div className='w-full flex justify-start items-center '>
               <div className={cn('flex items-center justify-center gap-4 pt-10',
                    device === 'desktop' && 'flex-col gap-4'
                  )}>
                      {project.demoImage && 
                      <Image src={project.demoImage} width={device === 'mobile' ? 200 : 400} 
                      height={device === 'mobile' ? 200 : 400} alt='logo' className='rounded-2xl '/>}
                      <div className='flex flex-col items-center justify-center gap-4'>
                        <p className='text-center text-2xl'>
                            {project.title}
                        </p>
                        <p className='text-center text-sm font-extralight bg-accent px-4 rounded-sm'>
                            {project.type}
                        </p>
                      </div>
                  </div>
            </div>
            {
              device!="desktop" && 
                <Button variant="ghost" onClick={()=>setShowDetails(!showDetails)} 
                className='absolute top-0 right-0 rounded-none rounded-tr-lg '>
                    {showDetails ? 'Hide Details' : 'Show Details'}
                </Button>
            }

            {(showDetails || device=="desktop") && 
              <>

              <div className={cn('w-full grid border-y-2 py-8',
                device === 'tablet' && 'grid-cols-2 gap-8',
                device === 'mobile' && 'grid-cols-1 gap-4',
                device === 'desktop' && 'grid-cols-1 gap-8'
              )}>
                <div className='text-description text-center'>
                    {project.description}
                </div>
    
              </div>
                <div className='flex items-center justify-center gap-4 flex-wrap  mt-2'>
                    {project.openSourceDetails && <a href={project.openSourceDetails.link} target='_blank'>
                        <SiGithub size={20} className='opacity-50 hover:opacity-100 transition-all duration-300'/>
                    </a>}
                    {project.notionDetails && <a href={project.notionDetails.templateLink} target='_blank'>
                        <SiNotion size={20} className='opacity-50 hover:opacity-100 transition-all duration-300'/>
                    </a>}
                    {project.contentDetails && <a href={project.contentDetails.videoLink} target='_blank'>
                        <SiYoutube size={20} className='opacity-50 hover:opacity-100 transition-all duration-300'/>
                    </a>}
                    {project.websiteDetails && <a href={project.websiteDetails.websiteLink} target='_blank'>
                        <FaExternalLinkAlt size={18} className='opacity-50 hover:opacity-100 transition-all duration-300'/>
                    </a>}
                </div>
              </>
              }
         </CardContent>
      </Card>
  )
}

export default ProjectDetails1