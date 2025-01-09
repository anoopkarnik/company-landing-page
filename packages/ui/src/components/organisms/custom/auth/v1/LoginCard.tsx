import { useState } from 'react'
import {z} from "zod"
import { Card, CardContent, CardFooter, CardHeader } from '../../../../molecules/shadcn/card';
import { useTransition } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '../../../../atoms/shadcn/button';
import { LoginSchema } from '@repo/zod/auth'
import {  useForm } from 'react-hook-form';
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
import { LoginCardProps } from '@repo/ts-types/auth/v1';
import { useRouter } from 'next/navigation';

const LoginCard = ({showEmail,showGoogleProvider,showGithubProvider,showLinkedinProvider,onEmailSubmit,
  onGoogleProviderSubmit,onGithubProviderSubmit,onLinkedinProviderSubmit,forgotPasswordFunction,backFunction,errorMessage}
  :LoginCardProps
) => {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues:{
      email: '',
      password: ''
    },
  })

  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>(errorMessage)
  const [success, setSuccess] = useState<string | undefined>("")
  const router = useRouter();

  async function handleSubmit(data: z.infer<typeof LoginSchema>) {
    setError("")
    setSuccess("")
    startTransition(()=>{
      onEmailSubmit(data)
      .then((data:any)=>{
          setError(data?.error);
          setSuccess(data?.success);
      })
    })
  }

  async function loginAsGuest(){
    setError("")
    setSuccess("")
    let data = {email: process.env.NEXT_PUBLIC_GUEST_MAIL, password: process.env.NEXT_PUBLIC_GUEST_PASSWORD}
    startTransition(()=>{
      onEmailSubmit(data)
      .then((data:any)=>{
          setError(data?.error);
          setSuccess(data?.success);
      })
    })
  }

  async function loginAsAdmin(){
    setError("")
    setSuccess("")
    let data = {email: process.env.NEXT_PUBLIC_ADMIN_MAIL, password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD}
    startTransition(()=>{
      onEmailSubmit(data)
      .then((data:any)=>{
          setError(data?.error);
          setSuccess(data?.success);
      })
    })
  }
  
  return (
    <Card className='w-[400px] bg-white text-black shadow-xl shadow-white/20'>
      <CardHeader>
        <div className='text-6xl font-bold text-center'>Login</div>
        <div className='text-md font-extralight text-center'>Welcome Back</div>
      </CardHeader>
      {showEmail &&
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
              <div className='space-y-4 mb-4'>
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
              <div onClick={forgotPasswordFunction} className='text-sm text-left text-black/60 hover:text-black cursor-pointer hover:underline'>Forgot Password</div>
              <FormResult type="error" message={error }/>
              <FormResult type="success" message={success}/>
              <Button className='w-full' disabled={isPending} variant="default" type="submit">Login</Button>
            </form>
          </Form>
        </CardContent>}
      <CardFooter className='flex rounded-2xl gap-4 '>
        {showGoogleProvider && <Button className='w-full' onClick={onGoogleProviderSubmit} variant='secondary'> <FcGoogle/></Button>}
        {showGithubProvider && <Button className='w-full' onClick={onGithubProviderSubmit} variant='secondary'><FaGithub/></Button>}
        {showLinkedinProvider && <Button className='w-full' onClick={onLinkedinProviderSubmit} variant='secondary'><FaLinkedin/></Button>}
      </CardFooter>
      <CardFooter className='flex flex-col gap-4 justify-center'>
        <Button className='w-full' disabled={isPending} variant="default" onClick={loginAsGuest}>Login as Guest</Button>
        <Button className='w-full' disabled={isPending} variant="default" onClick={loginAsAdmin}>Login as Admin</Button>
      </CardFooter>
      <CardFooter className='flex justify-center'>
        <div onClick={backFunction} className='text-sm text-center text-black/60 hover:text-black cursor-pointer hover:underline'>Don't have an Account?</div>
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

export default LoginCard;