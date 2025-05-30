import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import {Link} from "react-router-dom"
import { LogOut, MessageSquare, SunMoon, User} from "lucide-react"
import { useThemeStore } from '../store/useThemeStore'

const NavBar = () => {

  const {logout,authUser} = useAuthStore();
  const {theme,toggleTheme} = useThemeStore()

  const handleLogout = async () => {
    await logout();
  }
  
  return (
    <header
       className="bg-base-100 bororder-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80"
    >
      <div className='container mx-auto px-4 h-16'>
        <div className='flex items-center justify-between h-full' >
          <div className='flex items-center gap-8'>
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className='w-9 h-9 rounded-b-lg bg-success/10 flex items-center justify-center'>
                <MessageSquare className="w-5 h-5 text-success" />
              </div>
              <h1 className="text-lg font-bold">message</h1>
            </Link>
          </div>

          <div className='flex items-center gap-2'>

            {authUser && (
              <>
                <Link to={"/profile"} className='btn btn-sm gap-2'>
                  <User className='size-5' />
                  <span className='hidden sm:inline'>Profile</span>
                </Link>

                <Link to={"/"} onClick={handleLogout} className='btn btn-sm gap-2'>
                  <LogOut className="size-5" />
                  <span className='hidden sm:inline'>Logout</span>
                </Link>
              </>
            )}
            <div onClick={toggleTheme} className='btn btn-sm gap-2'>
              <SunMoon className='size-5'/>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default NavBar
