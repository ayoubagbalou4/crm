import React from 'react'
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './auth/Login';
import Register from './auth/Register';
import axios from 'axios'

const App = () => {

  axios.defaults.baseURL = 'http://localhost:4000/'

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App