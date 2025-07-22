'use client';

import React from 'react';
import { useServiceWorker } from '@/hooks/useServiceWorker';
import { ThemeToggle } from './ThemeToggle';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export const ClientProviders: React.FC<ClientProvidersProps> = ({ children }) => {
  useServiceWorker();

  return (
    <>
      {children}
      <ThemeToggle />
    </>
  );
};