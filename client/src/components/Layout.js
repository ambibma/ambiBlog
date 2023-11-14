import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'


export default function Layout({ showHeader }) {
  return (
    <main>
      {<Header />}
      
      <Outlet />
    </main>
  )
}
