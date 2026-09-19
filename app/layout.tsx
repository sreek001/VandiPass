import '@/styles/globals.css';
import NavHeader from '@/components/ui/nav-header';
import { CinematicFooter } from '@/components/ui/motion-footer';

export const metadata = {
  title: 'VandiPass · KSRTC Student Concession System',
  description: 'Digital transit concession ecosystem for Kerala State Road Transport Corporation',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#f8fafc] text-slate-900 min-h-screen flex flex-col">
        <NavHeader />
        <main className="flex-1">{children}</main>
        <CinematicFooter />
      </body>
    </html>
  );
}
