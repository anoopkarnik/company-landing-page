"use server"
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
 
export async function putBlob({filename,body,token}:any){
 
  const blob = await put(filename, body, {
    access: 'public',
    token: token
  });
 
  return blob;
}