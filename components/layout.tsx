import styles from '@/styles/Home.module.css';
import { Header } from './Header';
import { SidebarContent } from './SidebarContent';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className=" bg-slate-200 text-blue">
      <Header>
        <div className="pt-3">The EC Doc (Unofficial) Chatbot Search</div>
        <div className="text-xs pb-2">
          Built by <a href="https://www.campaignlab.uk">Campaign Lab</a>
        </div>
      </Header>
      <Sidebar>
        <SidebarContent />
      </Sidebar>
      <main className="w-full h-full pt-10 px-4 sm:px-6 md:px-8 lg:ps-72">
        {children}
      </main>
    </div>
  );
}
