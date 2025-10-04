import ProjectSidebar from '@/components/main/projectSidebar'

const Layout = ({children}:{children: React.ReactNode}) => {
  return (
    <section className=' flex'>
    <ProjectSidebar/>
    { children }
    </section>
  )
}

export default Layout