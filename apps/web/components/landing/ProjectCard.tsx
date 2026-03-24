
import Image from 'next/image'
import React from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { SiGithub, SiNotion, SiYoutube } from 'react-icons/si'
import ProjectModal from './ProjectModal'
import { ProjectProps } from '@/lib/ts-types/landing'

const ProjectCard = ({ project }: { project: ProjectProps }) => {
    return (
        <div className="flex flex-col items-center justify-center p-2 rounded-sm gap-2 relative group transition-all duration-300 w-full">
            {project.demoImage &&
                <div className="w-full overflow-hidden rounded-sm">
                    <Image src={project.demoImage} width={400} height={400} alt={project.title} unoptimized className='shadow-primary shadow-sm w-full h-auto object-cover' />
                </div>}
            <div className='flex items-center justify-center gap-2'>
                <div className='text-lg font-bold truncate max-w-[250px]'>{project.title}</div>
                <ProjectModal project={project} />
            </div>
            <div className='flex flex-col gap-2 items-center justify-center absolute right-[-40px] top-2 opacity-0 transition-all duration-300 group-hover:right-2 group-hover:opacity-100'>


                {project.openSourceDetails?.link && <a href={project.openSourceDetails.link} target='_blank'>
                    <SiGithub size={30} className='cursor-pointer opacity-50 hover:opacity-100 transition-all duration-300' />
                </a>}
                {project.notionDetails?.templateLink && <a href={project.notionDetails.templateLink} target='_blank'>
                    <SiNotion size={30} color='white' className='cursor-pointer opacity-50 hover:opacity-100 transition-all duration-300' />
                </a>}
                {project.contentDetails?.videoLink && <a href={project.contentDetails.videoLink} target='_blank'>
                    <SiYoutube size={30} color='red' className='cursor-pointer opacity-50 hover:opacity-100 transition-all duration-300' />
                </a>}
                {project.websiteDetails?.websiteLink && <a href={project.websiteDetails.websiteLink} target='_blank'>
                    <FaExternalLinkAlt size={26} className='cursor-pointer opacity-50 hover:opacity-100 transition-all duration-300' />
                </a>}
            </div>
        </div>
    )
}

export default ProjectCard