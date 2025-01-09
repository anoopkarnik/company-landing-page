import { useState } from 'react'
import {z} from "zod"
import { Card, CardContent, CardFooter, CardHeader } from '../../../../molecules/shadcn/card';
import { useTransition } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '../../../../atoms/shadcn/button';
import { RegisterSchema } from '@repo/zod/auth'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../molecules/shadcn/form'
import { Input } from '../../../../atoms/shadcn/input';
import { FormResult } from './FormResult';
import { RegisterCardProps } from '@repo/ts-types/auth/v1';
import { Link } from 'react-router-dom';
import { useRouter } from 'next/navigation';
const RegisterCard = ({showEmail,showGoogleProvider,showGithubProvider,showLinkedinProvider,
  onEmailSubmit,onGoogleProviderSubmit,onGithubProviderSubmit,onLinkedinProviderSubmit,backFunction,
  errorMessage}:RegisterCardProps
) => {
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues:{
      name: '',
      email: '',
      password: ''
    },
  })

  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const router = useRouter();

  function handleSubmit(data: z.infer<typeof RegisterSchema>) {
    setError("")
    setSuccess("")
    startTransition(()=>{
      onEmailSubmit(data).then((result:any)=>{setError(result.error);setSuccess(result.success)})
    })
  }
  return (
    <Card className='w-[400px] bg-white text-black shadow-xl shadow-white/20'>
      <CardHeader>
        <div className='text-6xl font-bold text-center text-black'>Register</div>
        <div className='text-md font-extralight text-center'>Create an account</div>
      </CardHeader>
      {showEmail &&
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6 '>
              <div className='space-y-4 mb-4'>
              <FormField control={form.control} name="name" render={({field})=>(
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input disabled={isPending} type="name" placeholder='first name' className='bg-white text-black' {...field}/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}/>
                <FormField control={form.control} name="email" render={({field})=>(
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input disabled={isPending} type="email" placeholder='example@gmail.com'  className='bg-white text-black' {...field}/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}/>
                <FormField control={form.control} name="password" render={({field})=>(
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input disabled={isPending} placeholder='******' type="password"  className='bg-white text-black' {...field}/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}/>
              </div>
              <FormResult type="error" message={error}/>
              <FormResult type="success" message={success}/>
              <Button  disabled={isPending}  variant="default" className="w-full" type="submit" > Register</Button>
            </form>
          </Form>
        </CardContent>}
      <CardFooter className='fle rounded-2xl gap-4 '>
        {showGoogleProvider && 
        <Button onClick={onGoogleProviderSubmit} variant='secondary' className="w-full" >
          <FcGoogle/>
        </Button>}
        {showGithubProvider && <Button onClick={onGithubProviderSubmit} variant='secondary' className="w-full"><FaGithub/></Button>}
        {showLinkedinProvider && <Button onClick={onLinkedinProviderSubmit} variant='secondary' className="w-full"><FaLinkedin/></Button>}
      </CardFooter>
      <CardFooter className='flex justify-center'>
        <div onClick={backFunction} className='text-sm text-center text-black/60 hover:text-black cursor-pointer hover:underline'>
          Already have an Account!
        </div>
      </CardFooter>
      <CardFooter className='text-description text-wrap mx-2 text-center'>
        <span>
          By signing up, you agree to our 
          <span
            onClick={() => router.push('/landing/terms-of-service')} 
            className='cursor-pointer text-blue-400 hover:text-blue-800'> Terms of Service 
          </span> 
          ,
          <span
            onClick={() => router.push('/landing/privacy-policy')} 
            className='cursor-pointer text-blue-400 hover:text-blue-800'> Privacy Policy.
          </span>
        </span>
      </CardFooter>
    </Card>
  )
}

export default RegisterCard;