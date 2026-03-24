import React from 'react'
import { ProjectProps } from '@/lib/ts-types/landing'
import { useDeviceType } from '@workspace/ui/hooks/use-device'
import { Card, CardContent } from '@workspace/ui/components/shadcn/card'
import { cn } from '@workspace/ui/lib/utils'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@workspace/ui/components/shadcn/accordion'

const ProjectDetails2 = ({ project }: { project: ProjectProps }) => {
  const device = useDeviceType()
  return (
    <Card className={cn('min-h-[700px] min-w-[70%] overflow-y-auto ',
      device === 'desktop' && 'max-w-[70%]',
      device !== 'desktop' && 'w-full'
    )}>
      <CardContent>
        <Accordion type='multiple' defaultValue={['open-source', 'content', 'notion', 'website']}>
          {project.openSourceDetails && <AccordionItem value='open-source'>
            <AccordionTrigger className='border-none outline-none'>Open Source Details</AccordionTrigger>
            <AccordionContent>
              <div className='flex flex-col flex-wrap text-paragraph gap-2'>
                {project.openSourceDetails?.link && (
                  <div className='flex justify-between items-center gap-4'>
                    <div className='whitespace-nowrap'>Github Link:</div>
                    <a className='text-description max-w-[60%] sm:max-w-[70%] truncate hover:text-white transition-colors duration-200' href={project.openSourceDetails.link} title={project.openSourceDetails.link} target='_blank'>
                      {project.openSourceDetails.link}
                    </a>
                  </div>
                )}
                {project.openSourceDetails?.npmPackageLink && (
                  <div className='flex justify-between items-center gap-4'>
                    <div className='whitespace-nowrap'>Npm Package Link: </div>
                    <a className='text-description max-w-[60%] sm:max-w-[70%] truncate hover:text-white transition-colors duration-200' href={project.openSourceDetails.npmPackageLink} title={project.openSourceDetails.npmPackageLink} target='_blank'>
                      {project.openSourceDetails.npmPackageLink}
                    </a>
                  </div>
                )}
                {project.openSourceDetails?.stars && (
                  <div className='flex justify-between items-center gap-4'>
                    <div className='whitespace-nowrap'>Github Repo Stars: </div>
                    <div className='text-description font-medium'>{project.openSourceDetails.stars}</div>
                  </div>
                )}
                {project.openSourceDetails?.weeklyClones && (
                  <div className='flex justify-between items-center gap-4'>
                    <div className='whitespace-nowrap'>Weekly Github Clones: </div>
                    <div className='text-description font-medium'>{project.openSourceDetails.weeklyClones}</div>
                  </div>
                )}
                {project.openSourceDetails?.weeklyDownloads && (
                  <div className='flex justify-between items-center gap-4'>
                    <div className='whitespace-nowrap'>Weekly Npm Downloads: </div>
                    <div className='text-description font-medium'>{project.openSourceDetails.weeklyDownloads}</div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>}
          {project.contentDetails && <AccordionItem value='content'>
            <AccordionTrigger className='hover:no-underline font-medium'>Content Details</AccordionTrigger>
            <AccordionContent>
              <div className='flex flex-col flex-wrap text-paragraph gap-2'>
                {project.contentDetails?.blogLink && (
                  <div className='flex justify-between items-center gap-4'>
                    <div className='whitespace-nowrap'>Blog | Documentation:</div>
                    <a className='text-description max-w-[60%] sm:max-w-[70%] truncate hover:text-white transition-colors duration-200' href={project.contentDetails.blogLink} title={project.contentDetails.blogLink} target='_blank'>
                      {project.contentDetails.blogLink}
                    </a>
                  </div>
                )}
                {project.contentDetails?.videoLink && (
                  <div className='flex justify-between items-center gap-4'>
                    <div className='whitespace-nowrap'>Youtube Video Link: </div>
                    <a className='text-description max-w-[60%] sm:max-w-[70%] truncate hover:text-white transition-colors duration-200' href={project.contentDetails.videoLink} title={project.contentDetails.videoLink} target='_blank'>
                      {project.contentDetails.videoLink}
                    </a>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>}
          {project.notionDetails && <AccordionItem value='notion'>
            <AccordionTrigger className='hover:no-underline font-medium'>Notion Template Details</AccordionTrigger>
            <AccordionContent>
              <div className='flex flex-col flex-wrap text-paragraph gap-2'>
                {project.notionDetails?.templateLink && (
                  <div className='flex justify-between items-center gap-4'>
                    <div className='whitespace-nowrap'>Template Link:</div>
                    <a className='text-description max-w-[60%] sm:max-w-[70%] truncate hover:text-white transition-colors duration-200' href={project.notionDetails.templateLink} title={project.notionDetails.templateLink} target='_blank'>
                      {project.notionDetails.templateLink}
                    </a>
                  </div>
                )}
                {project.notionDetails?.views && (
                  <div className='flex justify-between items-center gap-4'>
                    <div className='whitespace-nowrap'>Views: </div>
                    <div className='text-description font-medium'>{project.notionDetails.views}</div>
                  </div>
                )}
                {project.notionDetails?.downloads && (
                  <div className='flex justify-between items-center gap-4'>
                    <div className='whitespace-nowrap'>Downloads: </div>
                    <div className='text-description font-medium'>{project.notionDetails.downloads}</div>
                  </div>
                )}
                {project.notionDetails?.rating && (
                  <div className='flex justify-between items-center gap-4'>
                    <div className='whitespace-nowrap'>Rating: </div>
                    <div className='text-description font-medium'>{project.notionDetails.rating}</div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>}
          {project.websiteDetails && <AccordionItem value='website'>
            <AccordionTrigger className='hover:no-underline font-medium'>Website Details</AccordionTrigger>
            <AccordionContent>
              <div className='flex flex-col flex-wrap text-paragraph gap-2'>
                {project.websiteDetails?.websiteLink && (
                  <div className='flex justify-between items-center gap-4'>
                    <div className='whitespace-nowrap'>Website Link:</div>
                    <a className='text-description max-w-[60%] sm:max-w-[70%] truncate hover:text-white transition-colors duration-200' href={project.websiteDetails.websiteLink} title={project.websiteDetails.websiteLink} target='_blank'>
                      {project.websiteDetails.websiteLink}
                    </a>
                  </div>
                )}
                {project.websiteDetails?.websiteViews && (
                  <div className='flex justify-between items-center gap-4'>
                    <div className='whitespace-nowrap'>Views: </div>
                    <div className='text-description font-medium'>{project.websiteDetails.websiteViews}</div>
                  </div>
                )}
                {project.websiteDetails?.websiteUsers && (
                  <div className='flex justify-between items-center gap-4'>
                    <div className='whitespace-nowrap'>Monthly Active Users: </div>
                    <div className='text-description font-medium'>{project.websiteDetails.websiteUsers}</div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>}
        </Accordion>

      </CardContent>
    </Card>
  )
}

export default ProjectDetails2