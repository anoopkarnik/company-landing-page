import React, { useState } from 'react'

import { SiGithub, SiNotion, SiYoutube } from 'react-icons/si'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { ProjectProps } from '@/lib/ts-types/landing'
import { useDeviceType } from '@workspace/ui/hooks/use-device'
import { Card, CardContent } from '@workspace/ui/components/shadcn/card'
import { cn } from '@workspace/ui/lib/utils'
import Image from 'next/image'
import { Button } from '@workspace/ui/components/shadcn/button'

const ProjectDetails1 = ({ project }: { project: ProjectProps }) => {

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
                height={device === 'mobile' ? 200 : 400} alt='logo' className='rounded-2xl ' unoptimized />}
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
          device != "desktop" &&
          <Button variant="ghost" onClick={() => setShowDetails(!showDetails)}
            className='absolute top-0 right-0 rounded-none rounded-tr-lg '>
            {showDetails ? 'Hide Details' : 'Show Details'}
          </Button>
        }

        {(showDetails || device == "desktop") &&
          <>
            <div className='flex items-center justify-center gap-4 flex-wrap pb-2'>
              {project.openSourceDetails?.link && <a href={project.openSourceDetails.link} title="GitHub" target='_blank'>
                <SiGithub size={22} className='opacity-50 hover:opacity-100 transition-all duration-300' />
              </a>}
              {project.notionDetails?.templateLink && <a href={project.notionDetails.templateLink} title="Notion" target='_blank'>
                <SiNotion size={22} className='opacity-50 hover:opacity-100 transition-all duration-300' />
              </a>}
              {project.contentDetails?.videoLink && <a href={project.contentDetails.videoLink} title="YouTube" target='_blank'>
                <SiYoutube size={22} className='opacity-50 hover:opacity-100 transition-all duration-300' />
              </a>}
              {project.websiteDetails?.websiteLink && <a href={project.websiteDetails.websiteLink} title="Website" target='_blank'>
                <FaExternalLinkAlt size={20} className='opacity-50 hover:opacity-100 transition-all duration-300' />
              </a>}
            </div>

            <div className={cn('w-full grid border-t-2 pt-6',
              device === 'tablet' && 'grid-cols-2 gap-8',
              device === 'mobile' && 'grid-cols-1 gap-4',
              device === 'desktop' && 'grid-cols-1 gap-8'
            )}>
              <div className='text-description text-center max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-sidebar scrollbar-track-accent pr-2'>
                {project.description}
              </div>

            </div>
          </>
        }
      </CardContent>
    </Card>
  )
}

export default ProjectDetails1