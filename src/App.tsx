import React from 'react';
import Header from "./components/Header";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Person from "./pages/RegisterPerson";
import Business from "./pages/RegisterBusiness";
import Dog from "./pages/RegisterDog";
import Login from "./pages/Login";
import Autenticar from "./pages/Autenticar";
import Perfil from  "./pages/Perfil";
import Validar from  "./pages/Validar";
import Carteira from  "./pages/Carteira";
import AdminDashboard from './components/AdminDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import EditarCao from './pages/EditarCao';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/cadastro/usuário" element={<Person />} />
          <Route path="/cadastro/instituição" element={<Business />} />
          <Route path="/cadastro/cão" element={<Dog />} />
          <Route path="/cadastro" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/autenticar" element={<Autenticar />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/validar" element={<Validar />} />
          <Route path="/carteira" element={<Carteira />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/editar-cao/:id" element={<EditarCao />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
