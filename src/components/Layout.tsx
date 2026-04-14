import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/20 selection:text-primary">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-muted/20 overflow-y-auto hide-scrollbar">
          <div className="container mx-auto py-8 px-6 max-w-7xl animate-in fade-in duration-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
