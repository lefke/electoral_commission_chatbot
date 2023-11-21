import LoadingModal from '@/components/Overlay';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { SidebarContent } from './SidebarContent';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="bg-slate-200 text-blue">
      <Header>
        <div className="pt-3">The EC Doc (Unofficial) Chatbot Search</div>
        <div className="text-xs pb-2">
          Built by <a href="https://www.campaignlab.uk">Campaign Lab</a>
        </div>
      </Header>
      <Sidebar>
        <SidebarContent />
      </Sidebar>
      <main className="w-full h-[90vh] lg:h-[95vh] flex sm:w-full bg-white flex-auto flex-col-reverse mt-0 p-0 justify-items-end lg:ps-64">
        {children}
      </main>
      <LoadingModal />
    </div>
  );
}
