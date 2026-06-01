import ProjectSidebar from "@/components/main/projectSidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className=" flex min-h-screen ">
      <ProjectSidebar />
      <div className="flex-1">{children}</div>
    </section>
  );
};

export default Layout;
