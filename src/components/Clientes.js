// src/components/Clientes.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clienteForm, setClienteForm] = useState({ nombre: '', apellido: '', email: '', telefono: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editingClienteId, setEditingClienteId] = useState(null);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = () => {
    axios.get('http://localhost:8080/clientes')
      .then(response => {
        setClientes(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Hubo un error obteniendo los clientes:', error);
        setError(`No se pudieron cargar los clientes. Error: ${error.message}`);
        setLoading(false);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClienteForm({ ...clienteForm, [name]: value });
  };

  const handleAddCliente = () => {
    axios.post('http://localhost:8080/clientes', clienteForm)
      .then(response => {
        setClientes([...clientes, response.data]);
        setClienteForm({ nombre: '', apellido: '', email: '', telefono: '' });
      })
      .catch(error => {
        console.error('Hubo un error añadiendo el cliente:', error);
        setError(`No se pudo añadir el cliente. Error: ${error.message}`);
      });
  };

  const handleEditCliente = (cliente) => {
    setIsEditing(true);
    setEditingClienteId(cliente.id);
    setClienteForm({ nombre: cliente.nombre, apellido: cliente.apellido, email: cliente.email, telefono: cliente.telefono });
  };

  const handleUpdateCliente = () => {
    axios.put(`http://localhost:8080/clientes/${editingClienteId}`, clienteForm)
      .then(response => {
        setClientes(clientes.map(cliente => (cliente.id === editingClienteId ? response.data : cliente)));
        setIsEditing(false);
        setEditingClienteId(null);
        setClienteForm({ nombre: '', apellido: '', email: '', telefono: '' });
      })
      .catch(error => {
        console.error('Hubo un error actualizando el cliente:', error);
        setError(`No se pudo actualizar el cliente. Error: ${error.message}`);
      });
  };

  const handleDeleteCliente = (clienteId) => {
    axios.delete(`http://localhost:8080/clientes/${clienteId}`)
      .then(() => {
        setClientes(clientes.filter(cliente => cliente.id !== clienteId));
      })
      .catch(error => {
        console.error('Hubo un error eliminando el cliente:', error);
        setError(`No se pudo eliminar el cliente. Error: ${error.message}`);
      });
  };

  if (loading) {
    return <div>Cargando clientes...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Lista de Clientes</h2>

      <div>
        <h3>{isEditing ? 'Editar Cliente' : 'Agregar Cliente'}</h3>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={clienteForm.nombre}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={clienteForm.apellido}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={clienteForm.email}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={clienteForm.telefono}
          onChange={handleInputChange}
        />
        {isEditing ? (
          <button onClick={handleUpdateCliente}>Actualizar Cliente</button>
        ) : (
          <button onClick={handleAddCliente}>Agregar Cliente</button>
        )}
      </div>

      {clientes.length === 0 ? (
        <p>No hay clientes disponibles.</p>
      ) : (
        <ul>
          {clientes.map(cliente => (
            <li key={cliente.id}>
              {cliente.nombre} {cliente.apellido} - {cliente.email} - {cliente.telefono}
              <button onClick={() => handleEditCliente(cliente)}>Editar</button>
              <button onClick={() => handleDeleteCliente(cliente.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Clientes;
