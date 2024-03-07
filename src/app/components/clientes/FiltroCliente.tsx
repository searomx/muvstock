import { Customer } from '@prisma/client';
import React, { useState, useMemo } from 'react';

interface FiltroClienteProps {
  clientes: Customer[];
}

export default function FiltroCliente(props: Readonly<FiltroClienteProps>) {
  const [filterValue, setFilterValue] = useState('');

  const filteredUsers = useMemo(() => {
    return props.clientes.filter(cliente => cliente.nome.toLowerCase().includes(filterValue.toLowerCase()));
  }, [props.clientes, filterValue]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
  };

  return (
    <div>
      <input type="text" value={filterValue} onChange={handleFilterChange} />
      <ul>
        {filteredUsers.map((user, index) => (
          <li key={index}>{user.nome}</li>
        ))}
      </ul>
    </div>
  );
}
