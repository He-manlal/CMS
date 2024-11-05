'use client';

import { useRouter } from 'next/navigation';
import  Button  from '@/components/ui/button';

const Logout = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Redirect to the login page
    router.push('/');
  };

  return (
    <div className="text-center mb-4">
      <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white">
        Logout
      </Button>
    </div>
  );
};

export default Logout;
