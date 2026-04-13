import { ReactNode } from 'react';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

export const Layout = ({ children, showFooter = true }: LayoutProps) => {
  return (
    <div className='min-h-screen flex flex-col'>
      <main className='flex-1'>{children}</main>
      {showFooter ? <Footer /> : null}
    </div>
  );
};
