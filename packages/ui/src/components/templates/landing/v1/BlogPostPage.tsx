"use client";

import { blogProps } from '@repo/ts-types/landing-page/blog';
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { motion } from "framer-motion";
import { formatDistanceToNow } from 'date-fns';
import h1 from '../../../atoms/mdx/h1';
import h2 from '../../../atoms/mdx/h2';
import h3 from '../../../atoms/mdx/h3';
import blockquote from '../../../atoms/mdx/blockquote';
import MdxAlert from '../../../atoms/mdx/Alert';
import MdxBadge from '../../../atoms/mdx/Badge';
import MdxSeparator from '../../../atoms/mdx/hr';
import code from '../../../atoms/mdx/code';
import Ul from '../../../atoms/mdx/ul';
import Ol from '../../../atoms/mdx/ol';
import Li from '../../../atoms/mdx/li';
import { useRouter } from 'next/navigation';
import { CircleChevronLeft } from 'lucide-react';
import Image from 'next/image';


const components:any = {
  h1: h1,
  h2: h2,
  h3: h3,
  blockquote: blockquote,
  Alert: MdxAlert,
  Badge: MdxBadge,
  hr: MdxSeparator,
  code: code,
  ul: Ul,
  ol: Ol,
  li: Li,
};

const BlogPostPage = ({ blogPost, mdxSource }: { blogPost: blogProps; mdxSource: MDXRemoteSerializeResult }) => {
  const router = useRouter();
  return (
    <div className="container max-w-5xl mx-auto px-6 py-16  my-10 relative">
      <CircleChevronLeft className='absolute top-4 left-4 cursor-pointer opacity-80 hover:opacity-100 select-none outline-none' 
      onClick={()=>router.back()}/>
      <Image
        src={process.env.NEXT_PUBLIC_STRAPI_URL + blogPost.cover.formats.large.url}
        alt={blogPost.title}
        className="rounded-3xl shadow-2xl mb-12 object-cover w-full "
        width={1200}
        height={600}
      />


          <h1 className="text-5xl font-serif font-bold drop-shadow-sm mb-4 text-primary">
            {blogPost.title}
          </h1>
          <p className="text-description text-sm">By {blogPost.author?.name} • {formatDistanceToNow(new Date(blogPost.publishedAt), { addSuffix: true })}</p>

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

export default BlogPostPage;