// src/App.js
import React from 'react';
import Clientes from './components/Clientes';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Barbería - Gestión de Clientes</h1>
        <Clientes />
      </header>
    </div>
  );
}

export default App;
