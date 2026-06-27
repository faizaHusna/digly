import Sidebar from "./Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8F5F0] flex">
      <Sidebar />

      <main className="ml-[240px] w-full p-8">
        {children}
      </main>
    </div>
  );
}