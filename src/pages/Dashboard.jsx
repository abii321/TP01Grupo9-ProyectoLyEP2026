// src/pages/Dashboard.jsx
import '../css/dashboard.css';
import { useState, useEffect } from 'react';
import useAutorizaciones from '../hooks/useAutorizaciones';
import Login from './Login';
import clientesService from '../services/clientesService';
import autorizacionesService from '../services/autorizacionesServices';

const Dashboard = () => {
  const { admin } = useAutorizaciones();

  const [metricas, setMetricas] = useState({
    clientes: 0,
    gerencia: 0,
    soporte: 0
  });

  useEffect(() => {
    if (admin) {
      const cargarDatos = async () => {
        try {
          let totalClientes = 0;
          const clientesGuardados = localStorage.getItem("clientesLocal");

          if (clientesGuardados) {
            // 1. Si existen clientes guardados localmente, tomamos la longitud de dicho arreglo
            const listaLocal = JSON.parse(clientesGuardados);
            totalClientes = listaLocal.length;
          } else {
            // 2. Si no hay cache local, los obtenemos de la API e inicializamos el localStorage
            const clientesData = await clientesService.obtenerClientes();
            totalClientes = clientesData.length;
            localStorage.setItem("clientesLocal", JSON.stringify(clientesData));
          }

          // 3. Obtenemos los contadores estáticos/filtrados del personal por sector
          const personalData = autorizacionesService.obtenerEstadisticas();

          // 4. Actualizamos el estado de las métricas de forma dinámica
          setMetricas({
            clientes: totalClientes,
            gerencia: personalData.gerencia,
            soporte: personalData.soporte
          });
        } catch (error) {
          console.error("Error al cargar las métricas del dashboard:", error);
        }
      };

      cargarDatos();
    }
  }, [admin]);

  return (
    <div className="dashboard">
      <h1>Panel de Control de Clientes</h1>
      {!admin ? (
        <div className="dashboard-login">
          <h3>Bienvenido al sistema</h3>
          <p>Ingrese sus credenciales para acceder.</p>
          <Login />
        </div>
      ) : (
        <>
          <div className="user-card">
            <h3>Usuario conectado</h3>
            <p><strong>Administrador:</strong> {admin.nombre}</p>
            <p><strong>Email:</strong> {admin.email}</p>
            <p><strong>Sector:</strong> {admin.sector}</p>
          </div>
          <div className="dashboard-cards">
            <div className="dashboard-card">
              <h3>Clientes</h3>
              <p>{metricas.clientes}</p>
            </div>
            <div className="dashboard-card">
              <h3>Gerencia</h3>
              <p>{metricas.gerencia}</p>
            </div>
            <div className="dashboard-card">
              <h3>Soporte</h3>
              <p>{metricas.soporte}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;