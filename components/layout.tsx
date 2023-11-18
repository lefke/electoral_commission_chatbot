import { Header } from './Header';
import { SidebarContent } from './SidebarContent';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="mx-auto flex flex-row h-screen bg-slate-200 w-screen text-ec_blue">
        <Sidebar>
            <SidebarContent />
        </Sidebar>
        <div className="flex flex-col sm:w-full bg-white basis-3/4 flex-auto overflow-hidden justify-items-end md:max-w-5xl ">
            <Header>
                <div className="pt-3">The EC Doc (Unofficial) Chatbot Search</div>
                <div className="text-xs pb-2">Built by <a href="https://www.campaignlab.uk">Campaign Lab</a></div>
            </Header>
            <main className="flex sm:w-full bg-white flex-auto flex-col-reverse overflow-hidden mt-0 pt-0 pb-[0px] justify-items-end md:max-w-5xl ">
                {children}
            </main>
        </div>
    </div>
  );
}
