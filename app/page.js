'use client';

import { useEffect } from 'react';
import { useRouter } from "next/navigation";

const RoutePage = () => {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('PUID');

    if (!isLoggedIn) {
      router.push('/login');
    } else {
      router.push('/user');
    }
  }, [router]);

  return null;
};

export default RoutePage;
