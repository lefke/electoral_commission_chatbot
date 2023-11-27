import LoadingModal from '@/components/Overlay';
import { Sidebar } from './Sidebar';
import { SidebarContent } from './SidebarContent';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="bg-slate-200 text-ec-blue-900 h-screen flex flex-col">
      <Sidebar>
        <SidebarContent />
      </Sidebar>
      <main className="w-full overflow-hidden flex sm:w-full bg-white flex-auto flex-col-reverse mt-0 p-0 justify-items-end lg:ps-64">
        {children}
      </main>
      <LoadingModal />
    </div>
  );
}
