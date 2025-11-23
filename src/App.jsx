import React from 'react';
// Nota: Si usas Vite o Create React App moderno, BrowserRouter suele ir en main.jsx/index.js.
// Si prefieres tenerlo aquí, lo dejamos aquí.
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// --- LAYOUTS ---
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
// import AdminLayout from './components/admin/AdminLayout'; // (Pendiente de migrar)

// --- PÁGINAS PÚBLICAS ---
import Home from './pages/Home';
import Productos from './pages/Productos';
import DetalleProducto from './pages/DetalleProducto';
// import Categorias from './pages/Categorias';
// import Ofertas from './pages/Ofertas';
// import Nosotros from './pages/Nosotros';
// import Blogs from './pages/Blogs';
// import DetalleBlog1 from './pages/DetalleBlog1'; // Ojo: Idealmente haremos esto dinámico luego (blogs/:id)
// import DetalleBlog2 from './pages/DetalleBlog2';
// import Contacto from './pages/Contacto';

// --- PÁGINAS DE USUARIO (AUTH & CLIENTE) ---
import IniciarSesion from './pages/IniciarSesion';
import RegistroUsuario from './pages/RegistroUsuario';
// import Carro from './pages/Carro';
// import AjustesUsuario from './pages/AjustesUsuario';
// import PedidosCliente from './pages/PedidosCliente';

// --- PÁGINAS ADMIN ---
// import AdminHome from './pages/admin/AdminHome';
// import AdminProductos from './pages/admin/AdminProductos';
// import AdminNuevoProducto from './pages/admin/AdminNuevoProducto';
// import AdminPedidos from './pages/admin/AdminPedidos';


function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        
        {/* Header siempre visible */}
        <Header />

        <main className="flex-grow-1 container my-5">
          <Routes>
            
            {/* =========================================
                RUTAS PÚBLICAS
               ========================================= */}
            
            {/* HOME (Asumimos que ya empezamos por aquí) */}
            <Route path="/" element={<Home />} />

            {/* PRODUCTOS */}
            <Route path="/productos" element={<Productos />} />
            {/*<Route path="/productos" element={<h2>PÁGINA: Catálogo de Productos (Pendiente)</h2>} />*/}

            {/* DETALLE PRODUCTO */}
            <Route path="/productos/:id" element={<DetalleProducto />} />

            {/* CATEGORIAS */}
            {/* <Route path="/categorias" element={<Categorias />} /> */}
            <Route path="/categorias" element={<h2>PÁGINA: Categorías (Pendiente)</h2>} />

            {/* OFERTAS */}
            {/* <Route path="/ofertas" element={<Ofertas />} /> */}
            <Route path="/ofertas" element={<h2>PÁGINA: Ofertas (Pendiente)</h2>} />

            {/* NOSOTROS */}
            {/* <Route path="/nosotros" element={<Nosotros />} /> */}
            <Route path="/nosotros" element={<h2>PÁGINA: Nosotros (Pendiente)</h2>} />

            {/* BLOGS */}
            {/* <Route path="/blogs" element={<Blogs />} /> */}
            <Route path="/blogs" element={<h2>PÁGINA: Blogs (Pendiente)</h2>} />
            
            {/* <Route path="/blogs/detalle/1" element={<DetalleBlog1 />} /> */}
            {/* <Route path="/blogs/detalle/2" element={<DetalleBlog2 />} /> */}

            {/* CONTACTO */}
            {/* <Route path="/contacto" element={<Contacto />} /> */}
            <Route path="/contacto" element={<h2>PÁGINA: Contacto (Pendiente)</h2>} />


            {/* =========================================
                RUTAS DE AUTENTICACIÓN Y USUARIO
               ========================================= */}

            {/* LOGIN */}
            <Route path="/iniciar-sesion" element={<IniciarSesion />} />

            {/* REGISTRO */}
            <Route path="/registro" element={<RegistroUsuario />} />

            {/* CARRO */}
            {/* <Route path="/carro" element={<Carro />} /> */}
            <Route path="/carro" element={<h2>PÁGINA: Carrito de Compras (Pendiente)</h2>} />

            {/* AJUSTES USUARIO */}
            {/* <Route path="/ajustes" element={<AjustesUsuario />} /> */}
            <Route path="/ajustes" element={<h2>PÁGINA: Ajustes de Usuario (Pendiente)</h2>} />

            {/* PEDIDOS CLIENTE */}
            {/* <Route path="/pedidos" element={<PedidosCliente />} /> */}
            <Route path="/pedidos" element={<h2>PÁGINA: Mis Pedidos (Pendiente)</h2>} />


            {/* =========================================
                RUTAS DE ADMINISTRADOR (DASHBOARD)
               ========================================= */}
            
            {/* NOTA: Descomentar todo el bloque Route cuando tengas AdminLayout listo */}
            
            {/* <Route path="/admin" element={<AdminLayout />}> */}
               
               {/* <Route index element={<AdminHome />} /> */}
               <Route path="/admin" element={<h2 className='text-center'>DASHBOARD ADMIN (Layout Pendiente)</h2>} />

               {/* <Route path="productos" element={<AdminProductos />} /> */}
               {/* <Route path="nuevo-producto" element={<AdminNuevoProducto />} /> */}
               {/* <Route path="pedidos" element={<AdminPedidos />} /> */}

               {/* RUTAS ADMIN QUE FALTABAN EN LOS IMPORTS ORIGINALES PERO ESTABAN EN EL ROUTER */}
               {/* <Route path="inventario" element={<h3 className='text-center'>PÁGINA: Inventario</h3>} /> */}
               {/* <Route path="clientes" element={<h3 className='text-center'>PÁGINA: Clientes</h3>} /> */}
               {/* <Route path="empleados" element={<h3 className='text-center'>PÁGINA: Empleados</h3>} /> */}
               {/* <Route path="reportes" element={<h3 className='text-center'>PÁGINA: Reportes</h3>} /> */}
            
            {/* </Route> */}


            {/* =========================================
                MANEJO DE ERRORES (404)
               ========================================= */}
            <Route path="*" element={<h1 className='text-center my-5 text-danger'>404 | Página no encontrada</h1>} />

          </Routes>
        </main>

        {/* Footer siempre visible */}
        <Footer />

      </div>
    </BrowserRouter>
  );
}

export default App;
