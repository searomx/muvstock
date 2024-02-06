'use client';
import TabelaCliente from "./components/clientes/TabelaCliente";
import TabelaCnpjBase from "./components/cnpj/TabelaCnpj";
import CnpjBase from "@/core/CnpjBase";
import FormularioDadosCliente from "./components/FormularioDadosCliente";
import { useCallback, useEffect, useState } from "react";
import { api } from "./services/server";
import { Base, Customer } from "@prisma/client";

export default function Home() {
  const [dadosBase, setDadosBase] = useState<Base[]>([]);
  const [clientes, setClientes] = useState<Customer[] | null>([]);
  const [cliente, setCliente] = useState<Customer | null>(null);
  const [visivel, setVisivel] = useState<'tabcli' | 'formcli'>('tabcli');
  const [isLoading, setIsLoading] = useState(false);

  const showDataClienteAll = useCallback(async () => {
    setIsLoading(true);
    const response = await api.get("/api/cliente");
    setClientes(response.data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    showDataClienteAll();
  }, [showDataClienteAll]);

  const cnpjs = [
    new CnpjBase('00913443000173', '1'),
    new CnpjBase('61198164000160', '2'),
    new CnpjBase('33448150000200', '3'),
    new CnpjBase('61573796000166', '4'),
    new CnpjBase('61573796000409', '5'),
    new CnpjBase('61573796014116', '6'),
    new CnpjBase('33448150001860', '7'),
    new CnpjBase('61550141009129', '8'),
    new CnpjBase('33164021000100', '9'),
    new CnpjBase('6155014100050', '10'),
    new CnpjBase('6119816400024', '11'),
    new CnpjBase('1092480800011', '12'),
    new CnpjBase('4315830200079', '13'),
    new CnpjBase('1092480800046', '14'),
    new CnpjBase('3316402100044', '15'),
    new CnpjBase('6155014100033', '16'),
    new CnpjBase('6107417500013', '17'),
    new CnpjBase('61074175000294', '18'),
    new CnpjBase('61074175000375', '19'),
    new CnpjBase('61074175000456', '20'),
    new CnpjBase('61074175000537', '21'),
    new CnpjBase('61074175000618', '22'),
    new CnpjBase('61074175000790', '23'),
    new CnpjBase('61074175000871', '24'),
    new CnpjBase('61074175000952', '25'),

  ];
  function detalhesDoCliente(cliente: Customer) {
    console.log(cliente);
    setCliente(cliente);
    setVisivel('formcli');
  }
  return (
    <div className="flex flex-col min-w-full min-h-[calc(100vh-9.5rem)] bg-slate-700">
      {isLoading && <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 z-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>}
      <>
        {visivel === 'tabcli' ? (
          <div className={`grid grid-cols-4 justify-items-center
                         gap-4
                         sm:grid-cols-1 md:grid-cols-1 
                         lg:grid-cols-2 xl:grid-cols-4 
                         2xl:grid-cols-4`}>
            <div className="flex-initial w-full min-h-[calc(100vh-9.3rem)]">
              <div className="tableContainer">

                <TabelaCnpjBase cnpj={cnpjs} />
              </div>

            </div>
            <div className="flex flex-col col-span-3 w-full min-h-[calc(100vh-9.3rem)]">
              <div className="tableContainer">
                <TabelaCliente clientes={clientes} onDetalhesCliente={detalhesDoCliente} />
              </div>

            </div>

          </div>
        ) : (
          <div className={`grid grid-cols-4 justify-items-center
                         gap-4
                         sm:grid-cols-1 md:grid-cols-1 
                         lg:grid-cols-2 xl:grid-cols-4 
                         2xl:grid-cols-4`}>
            <div className="flex-initial w-full min-h-[calc(100vh-9.3rem)]">
              <div className="tableContainer">
                <TabelaCnpjBase cnpj={cnpjs} />
              </div>

            </div>
            <div className="flex flex-col col-span-3 w-full min-h-[calc(100vh-9.3rem)]">
              <div className="tableContainer">
                <FormularioDadosCliente clientes={cliente} onDetalhesCliente={detalhesDoCliente} onFechar={() => setVisivel('tabcli')} />
              </div>

            </div>

          </div>
        )}
      </>
    </div>
  );
}
