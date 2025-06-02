import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useAuth } from "@/contexts/useAuth";
import GlobalDebugTools from "../GlobalDebugTools";

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

const MainLayout = ({ children, className }: MainLayoutProps) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <>{children}</>;
  }
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 md:ml-[250px]">
        <TopBar />
        <main className={cn("flex-1 p-4 md:p-6 overflow-auto", className)}>
          {children}
        </main>
      </div>
      <GlobalDebugTools />
    </div>
  );
};

export default MainLayout;
