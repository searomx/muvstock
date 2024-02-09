import React, { useMemo } from 'react';
import { useTable } from 'react-table';
import { COLUMNS } from './Columns';
import './table.css';

interface TabelaCnpjBaseProps {
  base: any[];
  //handleFiles: (event: React.ChangeEvent<HTMLInputElement>) => void;

}

const TableBaseCnpj = (props: TabelaCnpjBaseProps) => {
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => props.base, [props.base]);
  const tabela = useTable({
    columns,
    data,
  });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tabela;

  function renderizarCabecalho() {
    return (
      <tr>
        <th className="text-left p-4">Código</th>
        <th className="text-left p-4">Cnpj</th>
      </tr>
    )
  }
  function renderizarDados() {
    return props.base?.map((cnpj, i) => {
      return (
        <tr key={cnpj.id} className={`${i % 2 === 0 ? 'bg-slate-300' : 'bg-slate-200'}`}>
          <td className="text-left p-4 w-16">{cnpj.id}</td>
          <td className="text-left p-4">{cnpj.cnpj}</td>
        </tr>
      )
    });
  }

  return (
    <div className="flex flex-col min-w-full max-h-[calc(100vh-15.3rem)]">
      <div className="tableContainer">
        <table {...getTableProps()} className="w-full"></table>
        <table>
          <thead>
            {headerGroups.map((headerGroup: any) => {

              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column: any) => {
                  <th {...column.getHeaderProps(column.getSortByToogleProps())}>
                    {column.render('Header')}

                  </th>
                })};

              </tr>
            })};

          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row: any) => {
              prepareRow(row);
              return (
                <tr key={row.id} {...row.getRowProps()}>
                  {row.cells.map((cell: any) => {
                    return <td key={cell.column.id} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  })}
                </tr>
              );
            })}

          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableBaseCnpj;
