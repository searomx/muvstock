import { IconeDetalhes } from "../Icones";
import { Customer } from "@prisma/client";


interface TabelaClienteProps {
  clientes: Customer[];
  onDetalhesCliente?: (cliente: Customer) => void;
}

export default function TabelaCliente(props: Readonly<TabelaClienteProps>) {
  const exibirAcoes = props.onDetalhesCliente;

  function renderizarCabecalho() {
    return (
      <tr>
        <th className="text-left p-4">Nome</th>
        <th className="text-left p-4">Cnpj</th>
        <th className="text-left p-4">Municipio</th>
        <th className="text-left p-4">Estado</th>
        {exibirAcoes ? <th className="text-center p-4">Ações</th> : false}
      </tr>
    )
  }
  function renderizarDados() {
    return props.clientes?.map((cliente, i) => {
      return (
        <tr key={cliente.id} className={`${i % 2 === 0 ? 'bg-slate-300' : 'bg-slate-200'}`}>
          <td className="text-left p-4">{cliente.nome}</td>
          <td className="text-left p-4">{cliente.cnpj}</td>
          <td className="text-left p-4">{cliente.municipio}</td>
          <td className="text-left p-4">{cliente.uf}</td>
          {exibirAcoes ? renderizarIcones(cliente) : false}
        </tr>
      )
    })
  }

  function renderizarIcones(cliente: Customer) {
    const id = cliente.id ?? null;
    return (
      <td className="flex justify-center items-center">
        {props.onDetalhesCliente ? (
          <button
            onClick={() => props.onDetalhesCliente?.(cliente as any)}
            className={`flex justify-center items-center 
                                rounded-full hover:bg-blue-50 p-2 m-1
                             text-blue-500`}>
            {IconeDetalhes}
          </button>
        ) : false}

      </td>
    )
  }
  return (
    <>
      <div className={`2xl:max-h-[48rem] 
                      xl:max-h-[38rem] xl:text-sm 
                      pt-0 pb-3 px-1 border-solid border-slate-300 
                      rounded-tr-none rounded-tl-md 
                      rounded-bl-md rounded-br-none 
                      overflow-y-auto`}>
        <table className="min-w-full min-h-full xl:text-sm">
          <thead className="bg-amber-500 p-4">
            {renderizarCabecalho()}
          </thead>
          <tbody>
            {renderizarDados()}
          </tbody>
        </table>
      </div>
      <div className="w-full h-10 bg-sky-500 p-2 rounded-md">
        <p className="text-center text-white">Total de clientes: {props.clientes.length}</p>
      </div>
    </>
  )
}
