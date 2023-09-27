import React from 'react'
import { Outlet } from 'react-router-dom'

export default function Layout({ showHeader }) {
  return (
    <main>
      {showHeader && <Header />}
      <Outlet />
    </main>
  )
}
