import React from 'react'
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './auth/Login';
import Register from './auth/Register';
import axios from 'axios'
import Dashboard from './admin/Dashboard';
import Clients from './admin/client/Clients';
import AddClient from './admin/client/AddClient';
import EditClient from './admin/client/EditClient';
import { GlobalProvider } from './GlobalContext';
import Bookings from './admin/bookings/Bookings';
import AddBooking from './admin/bookings/AddBooking';
import Page404 from './components/Page404';
import ClientDetails from './admin/client/ClientDetails';
import BookingDetails from './admin/bookings/BookingDetails';
import CalendarView from './admin/Calendar/CalendarView';

const App = () => {

  // axios.defaults.baseURL = 'http://localhost:4000/'
  axios.defaults.baseURL = 'https://crm-qyaz.vercel.app/'

  return (
    <BrowserRouter>
      <GlobalProvider>

        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

          <Route path='/dashboard' element={<Dashboard />} />

          <Route path='/clients' element={<Clients />} />
          <Route path='/clients/:id' element={<ClientDetails />} />
          <Route path='/clients/addclient' element={<AddClient />} />
          <Route path='/clients/editclient/:id' element={<EditClient />} />

          <Route path='/bookings' element={<Bookings />} />
          <Route path='/bookings/new' element={<AddBooking />} />
          <Route path='/bookings/:id' element={<BookingDetails />} />

          <Route path='/calendar' element={<CalendarView />} />

          <Route path='/404' element={<Page404 />} />
        </Routes>
      </GlobalProvider>
    </BrowserRouter>
  )
}

export default App
