'use client';
import TabelaCliente from "./components/clientes/TabelaCliente";
import TabelaCnpjBase from "./components/cnpj/TabelaCnpj";
import FormularioDadosCliente from "./components/FormularioDadosCliente";
import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "./services/server";
import { Customer } from "@prisma/client";
import Papa from "papaparse";
import CompleteString from "@/lib/utils/CompleteString";

export default function Home() {
  const [dadosBase, setDadosBase] = useState<BaseCnpj[]>([]);
  const [clientes, setClientes] = useState<Customer[] | null>([]);
  const [cliente, setCliente] = useState<Customer | null>(null);
  const [visivel, setVisivel] = useState<'tabcli' | 'formcli'>('tabcli');
  const [isLoading, setIsLoading] = useState(false);

  type BaseCnpj = {
    id: string;
    cnpj: string;
  }

  const handlerCnpjBase = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    let cnpjs: BaseCnpj[] = [];
    let dadosCnpjs: BaseCnpj[] = [];
    const arquivo = e.target.files && e.target.files[0];
    if (arquivo) {
      Papa.parse(arquivo, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          cnpjs = results.data as BaseCnpj[];
          cnpjs.map((item) => dadosCnpjs.push({
            id: item.id,
            cnpj: CompleteString.formatarPadString(item.cnpj.toString(), 14, "0"),
          }));
          setDadosBase(dadosCnpjs);
          //SaveAsCnpj(dadosCnpjs);
        },
        error: (error) => {
          alert("Erro ao analisar o CSV: " + error.message);
        },
      });
    }
  }, []);

  useEffect(() => {
    handlerCnpjBase; // Pass the event argument to the function call
  }, [handlerCnpjBase, dadosBase]);

  // ...

  const showDataClienteAll = useCallback(async () => {
    setIsLoading(true);
    const response = await api.get("/api/cliente");
    setClientes(response.data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    showDataClienteAll();
  }, [showDataClienteAll]);

  const cnpjs = useMemo(() => {
    return dadosBase.map((item) => {
      return {
        id: item.id,
        cnpj: item.cnpj,
      }
    });
  }, [dadosBase]);
  function detalhesDoCliente(cliente: Customer) {
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
              <TabelaCnpjBase base={dadosBase} handleFiles={handlerCnpjBase} />
            </div>
            <div className="flex-initial col-span-3 w-full min-h-[calc(100vh-9.3rem)]">
              <TabelaCliente clientes={clientes} onDetalhesCliente={detalhesDoCliente} />
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
                <TabelaCnpjBase base={dadosBase} handleFiles={handlerCnpjBase} />
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
