import ProjectsNavbar from '@/components/navbar/projectsNavbar'
import React from 'react'

const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <section>
        <ProjectsNavbar/>
        {children}
    </section>
  )
}

export default Layout
