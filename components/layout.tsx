import { Sidebar } from "lucide-react";
import styles from '@/styles/Home.module.css';

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
            <div>
                <h1>Here's a handy chatbot for when it's impossible to get through electoral guidance</h1>
                <img src="/robot-ai.png" max-width="200px" width="40%" alt="Girl in a jacket"/>
                <h2>Ask the (unofficial) chat bot to do the searching for you</h2>
                <p>Connected to The Electoral Commission electoral rules and regulations documents</p>
                <p>(last update: 02/10/2023)</p>
                <p>Disclaimer: Do not take answers provided as legal advice, this is an experimental search tool. All data provided should be fact checked with The Electoral Commission tel: 0333 103 1928</p>
                <p>Powered by LangChainAI. Built by Campaign Lab</p>
            </div>
        </div>
        <main className="flex sm:w-full bg-white  basis-3/4 flex-auto flex-col-reverse overflow-hidden mt-0 pt-[46px] md:pt-0 pb-[0px] justify-items-end md:max-w-5xl ">
            {children}
        </main>
    </div>
  );
}
