"use client";

import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import { CircleChevronLeft } from 'lucide-react';
import { components } from '../../../../atoms/mdx/mdxComponents';
import { docProps } from '@repo/ts-types/landing-page/doc';

const DocPostPage = ({ docPost, mdxSource }: { docPost: docProps; mdxSource: MDXRemoteSerializeResult }) => {
  const router = useRouter();
  return (
    <div className="container max-w-5xl mx-auto px-6 py-16  my-10 relative">
      <CircleChevronLeft className='absolute top-4 left-4 cursor-pointer opacity-80 hover:opacity-100 select-none outline-none' 
      onClick={()=>router.back()}/>
          <h1 className="text-5xl font-serif font-bold drop-shadow-sm mb-4 text-primary">
            {docPost.title}
          </h1>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="prose prose-xl mx-auto prose-headings:font-serif prose-headings:text-gray-800"
      >
        <MDXRemote {...mdxSource} components={components} />
      </motion.article>
    </div>
  );
};

export default DocPostPage;