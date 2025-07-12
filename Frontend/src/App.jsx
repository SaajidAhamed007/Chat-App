import React from 'react'
import {Navigate, Route,Routes} from "react-router-dom"
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import NavBar from './components/NavBar'
import { useEffect } from 'react'
import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from './store/useThemeStore'
import { Loader } from 'lucide-react'
import { Toaster } from "react-hot-toast"
import { useState } from 'react'
import { axiosInstance } from './lib/axios'

const App = () => {

  const {checkAuth,authUser,isCheckingAuth,onlineUsers} = useAuthStore();

  console.log("Online Users",{onlineUsers});

  const {theme} = useThemeStore();

  useEffect(()=>{
    checkAuth();
  },[checkAuth])

  useEffect(()=>{
    if(theme == "dark"){
      document.documentElement.setAttribute("data-theme","dark")
    } else {
      document.documentElement.setAttribute("data-theme","cupcake")
    }
  },[theme])


  if(isCheckingAuth && !authUser){
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin'></Loader>
      </div>
    )
  }

  return (
    <div>
      <NavBar />

      <Routes>
        <Route path="/" element={authUser? <HomePage /> : <Navigate to={"/login"} />} ></Route>
        <Route path="/sign-up" element={!authUser? <SignUpPage /> : <Navigate to={"/"} /> } ></Route>
        <Route path="/login" element={ !authUser? <LoginPage /> : <Navigate to={"/"} /> } ></Route>
        <Route path="/profile" element={authUser? <ProfilePage /> : <Navigate to={"/login"} />}></Route>
      </Routes>

      <Toaster />
    </div>
    
  )
}

export default App

