import LoadingModal from '@/components/Overlay';
import { Sidebar } from './Sidebar';
import { SidebarContent } from './SidebarContent';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <main className="bg-slate-200 text-ec-blue-900 min-h-screen flex flex-col h-full w-full">
      <Sidebar>
        <SidebarContent />
      </Sidebar>
      <div className="w-full overflow-hidden flex sm:w-full bg-white flex-auto flex-col-reverse mt-0 p-0 justify-items-end lg:ps-64">
        {children}
      </div>
      <LoadingModal />
    </main>
  );
}
