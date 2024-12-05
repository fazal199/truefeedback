'use client'

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';

function Navbar() {
  const { data: session } = useSession();
  const user : User | undefined = session?.user as User;

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href="/" className="text-2xl font-bold mb-4 md:mb-0">
          TrueFeedback
        </Link>
        {session ? (
          <>
            <span className="text-xl mb-5 font-semibold tracking-wide">
              Welcome, {user.username || user.email}
            </span>
            <Button onClick={() => signOut()} className="bg-slate-100 text-black font-semibold text-xl shadow-md shadow-white" variant='link' size={"lg"}>
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button className="w-full md:w-auto bg-slate-100 text-black font-semibold text-xl shadow-md shadow-white" size={"lg"} variant={'link'}>Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
