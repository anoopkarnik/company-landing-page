import React, { useState } from 'react'
import { ProjectProps } from '@repo/ts-types/landing-page/projects'
import { useDeviceType } from '../../../../hooks/use-device'
import { Card, CardContent } from '../../shadcn/card'
import { cn } from '../../../../lib/utils'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../shadcn/accordion'

const ProfileDetails2 = ({project}:{project:ProjectProps}) => {    
  const device = useDeviceType()
  return (
    <Card className={cn('min-h-[700px] min-w-[70%] overflow-y-auto ',
        device === 'desktop' && 'max-w-[70%]',
        device !== 'desktop' && 'w-full'
    )}>
      <CardContent>
          <Accordion type='multiple' defaultValue={['open-source','content','notion','website']}>
              {project.openSourceDetails && <AccordionItem value='open-source'>
                  <AccordionTrigger className='border-none outline-none'>Open Source Details</AccordionTrigger>
                  <AccordionContent>
                      <div className='flex flex-col flex-wrap text-paragraph '>
                          <div className='flex justify-between items-center gap-4 '>
                            <div>Github Link:</div> 
                            <a className='text-description hover:text-white' href={project.openSourceDetails?.link} target='_blank'>
                              {project.openSourceDetails?.link}
                            </a>
                          </div>
                          <div className='flex justify-between items-center gap-4 '>
                            <div>Npm Package Link: </div> 
                            <a className='text-description hover:text-white' href={project.openSourceDetails?.npmPackageLink} target='_blank'>
                              {project.openSourceDetails?.npmPackageLink}
                            </a>
                          </div>
                          <div className='flex justify-between items-center gap-4 '>
                            <div>Github Repo Stars: </div>
                            <div className='text-description'>{project.openSourceDetails?.stars}</div>
                          </div>
                          <div className='flex justify-between items-center gap-4 '>
                            <div>Weekly Github Clones: </div>
                            <div  className='text-description'>{project.openSourceDetails?.weeklyClones}</div>
                          </div>
                          <div className='flex justify-between items-center gap-4 '>
                            <div>Weekly Npm Downloads: </div>
                            <div  className='text-description'>{project.openSourceDetails?.weeklyDownloads}</div>
                          </div>
                      </div>
                  </AccordionContent>
              </AccordionItem>}
              {project.contentDetails && <AccordionItem value='content'>
                  <AccordionTrigger>Content Details</AccordionTrigger>
                  <AccordionContent>
                      <div className='flex flex-col flex-wrap text-paragraph '>
                          <div className='flex justify-between items-center gap-4 '>
                            <div>Blog | Documentation Link:</div> 
                            <a className='text-description hover:text-white' href={project.contentDetails?.blogLink} target='_blank'>
                              {project.contentDetails?.blogLink}
                            </a>
                          </div>
                          <div className='flex justify-between items-center gap-4 '>
                            <div>Youtube Video Link </div> 
                            <a className='text-description hover:text-white' href={project.contentDetails?.videoLink} target='_blank'>
                              {project.contentDetails?.videoLink}
                            </a>
                          </div>
                      </div>
                  </AccordionContent>
              </AccordionItem>}
              {project.notionDetails && <AccordionItem value='notion'>
                  <AccordionTrigger>Notion Template Details</AccordionTrigger>
                  <AccordionContent>
                      <div className='flex flex-col flex-wrap text-paragraph '>
                          <div className='flex justify-between items-center gap-4 '>
                            <div>Template Link:</div> 
                            <a className='text-description hover:text-white' href={project.notionDetails?.templateLink} target='_blank'>
                              {project.notionDetails?.templateLink}
                            </a>
                          </div>
                          <div className='flex justify-between items-center gap-4 '>
                            <div>Views: </div>
                            <div className='text-description'>{project.notionDetails?.views}</div>
                          </div>
                          <div className='flex justify-between items-center gap-4 '>
                            <div>Downloads: </div>
                            <div  className='text-description'>{project.notionDetails?.downloads}</div>
                          </div>
                          <div className='flex justify-between items-center gap-4 '>
                            <div>Rating: </div>
                            <div  className='text-description'>{project.notionDetails?.rating}</div>
                          </div>
                      </div>
                  </AccordionContent>
              </AccordionItem>}
              {project.websiteDetails && <AccordionItem value='website'>
                  <AccordionTrigger>Website Details</AccordionTrigger>
                  <AccordionContent>
                      <div className='flex flex-col flex-wrap text-paragraph '>
                          <div className='flex justify-between items-center gap-4 '>
                            <div>Website Link:</div> 
                            <a className='text-description hover:text-white' href={project.websiteDetails?.websiteLink} target='_blank'>
                              {project.websiteDetails?.websiteLink}
                            </a>
                          </div>
                          <div className='flex justify-between items-center gap-4 '>
                            <div>Views: </div>
                            <div className='text-description'>{project.websiteDetails?.websiteViews}</div>
                          </div>
                          <div className='flex justify-between items-center gap-4 '>
                            <div>Monthly Active Users: </div>
                            <div  className='text-description'>{project.websiteDetails?.websiteUsers}</div>
                          </div>
                      </div>
                  </AccordionContent>
              </AccordionItem>}
          </Accordion>

      </CardContent>
    </Card>
  )
}

export default ProfileDetails2