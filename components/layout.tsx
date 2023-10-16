interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="mx-auto flex flex-col-reverse space-y-4 h-screen">
      <header className="container fixed text-center top-0 z-40 bg-white border-b border-b-slate-200">
        <div className="pt-3">The EC Doc (Unofficial) Chatbot Search</div>
        <div className="text-xs pb-2">Built by <a href="https://www.campaignlab.uk">Campaign Lab</a></div>
      </header>
        <main className="flex w-full flex-1 flex-col-reverse overflow-hidden pt-[46px] pb-[0px] justify-items-end">
          {children}
        </main>
    </div>
  );
}
