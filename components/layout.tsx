import { Sidebar } from "lucide-react";

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="mx-auto flex flex-row h-screen bg-slate-200 w-screen">
        <header className="fixed w-full text-center top-0 z-40 bg-white border-b border-b-slate-200 md:hidden">
            <div className="pt-3">The EC Doc (Unofficial) Chatbot Search</div>
            <div className="text-xs pb-2">Built by <a href="https://www.campaignlab.uk">Campaign Lab</a></div>
        </header>
        <div className="hidden md:flex flex-auto basis-1/4 w-1/5 grow shrink">

        </div>
        <main className="flex sm:w-full bg-white  basis-3/4 flex-auto flex-col-reverse overflow-hidden mt-0 pt-[46px] md:pt-0 pb-[0px] justify-items-end md:max-w-5xl ">
            {children}
        </main>
    </div>
  );
}
