'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Button } from 'react-bootstrap';
import { isAuthenticated } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <Container className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <h1 className="display-4 mb-4">Network Device Inventory</h1>
        <p className="lead mb-4">
          Manage and monitor your network devices with ease
        </p>
        <div className="d-flex gap-3 justify-content-center">
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => router.push('/login')}
          >
            Login
          </Button>
          <Button 
            variant="outline-primary" 
            size="lg"
            onClick={() => router.push('/register')}
          >
            Register
          </Button>
        </div>
      </div>
    </Container>
  );
}
