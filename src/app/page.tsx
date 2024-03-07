'use client';
import TabelaCliente from "./components/clientes/TabelaCliente";
import TabelaCnpjBase from "./components/cnpj/TabelaCnpjBase";
import FormularioDadosCliente from "./components/FormularioDadosCliente";
import { Suspense, useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { api } from "./services/server";
import { Customer } from "@prisma/client";
import Papa from "papaparse";
import CompleteString from "@/lib/utils/CompleteString";
import ValidaCnpj from "@/lib/utils/validacnpj";
import ShowToast from "@/lib/utils/showToast";
import Header from "./components/navigation/navbar/header";
import Loading from "./loading";
import TableClientes from "./components/clientes/TableClientes";
import TableCnpjBase from "./components/cnpj/TableCnpjBase";
import ClientesTable from "./components/clientes/ClientesTable";
type BaseCnpj = {
  id?: string;
  cnpj: string;
}
type TBaseCnpj = {
  id?: string;
  cnpj: string;
}
type TClientes = {
  id: string;
  nome: string;
  cnpj: string;
  municipio: string;
  uf: string;
}

const initialState: TBaseCnpj[] = [];

type Action = | { type: "complete", payload: TBaseCnpj[] } | { type: "remove", id: string };

function reducer(state: TBaseCnpj[], action: Action) {
  switch (action.type) {
    case "complete":
      return action.payload;
    case "remove":
      return state.filter((cnpj) => cnpj.id !== action.id);
    default:
      return state;
  }

}


export default function Home() {
  const [clientes, setClientes] = useState<Customer[] | null>([]);
  const [cliente, setCliente] = useState<Customer | null>(null);
  const [visivel, setVisivel] = useState<'tabcli' | 'formcli'>('tabcli');
  const [state, dispatch] = useReducer(reducer, initialState);
  const [inputCnpjUnico, setCnpjUnico] = useState<string>("");
  const [inputToken, setInputToken] = useState<string>("");
  const [processando, setProcessando] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [totalSegundos, setTotalSegundos] = useState<number>(2 * 60);
  const minutos = Math.floor(totalSegundos / 60);
  const segundos = totalSegundos % 60;

  const strtoken =
    "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJoZWxsbyI6IndvcmxkIiwibWVzc2FnZSI6IlRoYW5rcyBmb3IgdmlzaXRpbmcgbm96emxlZ2Vhci5jb20hIiwiaXNzdWVkIjoxNTU3MjU4ODc3NTI2fQ.NXd7lC3rFLiNHXwefUu3OQ-R203pGfB87-dIrk2S-vqfaygIWFwZKzmGHr6pzYkl2a0HkY0fdwa38yLWu8Zdhg";

  const cabecalho = useMemo(() => {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Charset': 'utf-8',
    };
  }, []);

  const handlerCnpjBase = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    let cnpjs: BaseCnpj[] = [];
    let dadosCnpjs: BaseCnpj[] = [];
    const arquivo = e.target.files?.[0];
    if (arquivo) {
      setProcessando(true);
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
          dispatch({ type: "complete", payload: dadosCnpjs });
          SaveAsCnpj(dadosCnpjs);
          setProcessando(false);
        },
        error: (error) => {
          alert("Erro ao analisar o CSV: " + error.message);
        },
      });
    }
  };

  const SaveAsCnpj = async (cnpjs: BaseCnpj[]) => {
    setProcessando(true);
    try {
      await api.post("/api/base/", cnpjs).then((response) => {
        const resp = response.data;
        console.log("response-base-page:", response.status);
        if (response.status === 200) {
          ShowToast.showToast("Dados Salvos com sucesso!", "success");
          console.log(JSON.stringify(response.data));
        }
        setProcessando(false);
        return resp;
      });
    } catch (error) {
      setProcessando(false);
      ShowToast.showToast("Erro ao salvar os dados!", "error");
    }
  };

  async function onEnviarToken() {
    if (inputToken.trim() === "") {
      return;
    }
    const response = await api.post("/api/cnpj", {
      token: inputToken,
    });
  }

  function getInputToken(e: React.ChangeEvent<HTMLTextAreaElement>) {
    e.preventDefault();
    if (inputToken.trim() === "") return;
    console.log(inputToken);
  }

  const removeCnpjBase = useCallback(async (id: string) => {
    setProcessando(true);
    try {
      const response = await api.delete("/api/cnpj/", { data: { id } });
      if (response.status === 200) {
        console.log("CNPJ removido com sucesso!", response.status);

        setProcessando(false);
        return response.status;
      }
    } catch (error) {
      console.log("Erro ao remover o cnpj!", error);
      setProcessando(false);
    }
  }, []);

  const showDataClienteAll = useCallback(async () => {
    setProcessando(true);
    const response = await api.get("/api/cliente");
    if (response.status === 200) {
      setClientes(response.data);
      setProcessando(false);
    } else {
      ShowToast.showToast("Erro ao buscar os dados dos clientes!", "error");
    }
  }, []);


  const saveCustomer = useCallback(async (strCnpj: string, idCnpj?: string) => {
    try {
      const response = await api.post("/api/cnpj", { cnpj: strCnpj }, { headers: cabecalho });
      if (response.status === 200) {
        if (idCnpj) {
          removeCnpjBase(idCnpj);
          dispatch({ type: "remove", id: idCnpj });
        }
        ShowToast.showToast("Cliente Salvo com Sucesso!", "success");
        setClientes([...clientes, response.data.result]);
      } else if (response.status === 201) {
        ShowToast.showToast(`O cnpj ${strCnpj} já existe na base de dados`, "error");
      }
    } catch (error) {
      ShowToast.showToast(error.toString(), "error");
    }
  }, [cabecalho, removeCnpjBase, clientes]);

  const getDataCustomer = useCallback(async () => {
    if (inputCnpjUnico.trim() === "") {
      const cnpjsBase = state.filter((cnpj, idx) => idx < 3);
      cnpjsBase.map((item) => {
        const strCnpj = ValidaCnpj(item.cnpj);
        const idCnpj = item.id;
        if (strCnpj) {
          saveCustomer(strCnpj, idCnpj);
        }
      });
    } else {
      const strCnpj = ValidaCnpj(inputCnpjUnico);
      if (strCnpj) {
        saveCustomer(strCnpj);
      }
    }
  }, [inputCnpjUnico, state, saveCustomer]);

  const startTemporizador = useCallback(async () => {
    if (!isRunning) {
      await getDataCustomer();
    }
    setIsRunning(true);

    if (totalSegundos === 0) {
      await getDataCustomer();
      setTotalSegundos(120);
    } else {
      setTimeout(() => {
        setTotalSegundos(totalSegundos - 1);
      }, 1000);
      setIsRunning(true);
    }
  }, [getDataCustomer, isRunning, totalSegundos]);


  useEffect(() => {
    if (isRunning) {
      startTemporizador();
    } else {
      setTotalSegundos(120);
    }
  }, [totalSegundos, isRunning, startTemporizador]);


  // ...Mostrar os dados da Base Cnpj

  useEffect(() => {
    setInputToken(strtoken);
  }, [inputToken]);

  function detalhesDoCliente(cliente: Customer) {
    setCliente(cliente);
    setVisivel('formcli');
  }

  //busca dados cnpj Base mongodb

  const showCnpjAll = useCallback(async () => {
    let xbase: TBaseCnpj[] = [];
    setProcessando(true);
    await api.get("/api/base").then((res) => {
      const data = res.data;
      if (res.status === 200) {
        xbase = data.dados;
        dispatch({ type: "complete", payload: data.dados });
        setProcessando(false);
        return res.data;
      } else {
        ShowToast.showToast("Não existe registro na Base de Dados!", "error");
      }
    }).catch((error) => {
      ShowToast.showToast("Erro ao buscar os dados na base de dados!", "error");
      console.log(error);
      setProcessando(false);
    });

  }, []);

  useEffect(() => {
    showCnpjAll();
  }, [state, showCnpjAll]);

  useEffect(() => {
    showDataClienteAll();
  }, [clientes, showDataClienteAll]);

  const stopRequestCnpj = () => {
    setIsRunning(false);
  };

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-col min-w-full min-h-max lg:max-h-[calc(100vh-9.5rem)] 2xl:min-h-[calc(100vh-9.2rem)] bg-slate-700 p-4 relative">
        <Header>
          <label htmlFor="selecao-arquivo" className="botao botao-orange cursor-pointer">
            Selecionar um arquivo csv &#187;
          </label>
          <input
            id="selecao-arquivo"
            accept=".csv"
            type="file"
            onChange={handlerCnpjBase} />

          <div className="flex h-[5rem] bg-orange-500 p-1 border border-slate-700 rounded-sm gap-3 items-center">
            <textarea
              id="token"
              name="token"
              style={{ resize: "none" }}
              cols={40}
              rows={3}
              placeholder="Insira o Token..."
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              className="border border-gray-400 bg-gray-100 rounded-md py-2 px-4 focus:outline-none focus:bg-white"
            ></textarea>
            <button onClick={onEnviarToken} className="botao botao-blue ml-3">
              Enviar Token
            </button>
          </div>
          <div className="flex h-[5rem] bg-orange-500 p-1 border-slate-700 rounded-sm gap-3 items-center">
            <input
              type="text"
              onChange={(e) => setCnpjUnico(e.target.value)}
              value={inputCnpjUnico}
              className="border border-gray-400 bg-gray-100 rounded-md py-2 px-4 focus:outline-none focus:bg-white"
              placeholder="Digite o Cnpj..."
            />
            <button
              id="btn-enviar-individual"
              onClick={() => startTemporizador()}
              className="botao botao-blue ml-3"
            >
              Enviar Cnpj
            </button>
            <button
              id="btn-stop"
              onClick={() => stopRequestCnpj()}
              className="botao botao-blue ml-3"
            >
              Interromper
            </button>
          </div>
          <div className="flex h-[5rem] w-auto bg-orange-500 p-1 border-slate-700 rounded-sm gap-3 items-center">

            <h1 className="text-white text-2xl">{`${minutos.toString().padStart(2, "0")} : ${segundos.toString().padStart(2, "0")}`}</h1>

          </div>
        </Header>

        {visivel === 'tabcli' ? (
          <div className={`grid grid-cols-4
                         gap-4 
                         sm:grid-cols-1 md:grid-cols-1 
                         lg:grid-cols-4 xl:grid-cols-4 
                         2xl:grid-cols-4`}>
            <div className="flex w-full text-sm">
              <TableCnpjBase data={state || null} />
            </div>
            <div className="flex flex-col col-span-3 w-full max-h-[48rem]">
              <ClientesTable data={clientes} onDetalhesCliente={detalhesDoCliente} />
            </div>
          </div>
        ) : (
          <div className={`grid grid-cols-4
                         gap-4
                         sm:grid-cols-1 md:grid-cols-1 
                         lg:grid-cols-4 xl:grid-cols-4 
                         2xl:grid-cols-4`}>
            <div className="flex w-full text-sm p-3">
              <TabelaCnpjBase base={state} />
            </div>
            <div className="flex flex-col col-span-3 w-full">
              <div className="tableContainer">
                <FormularioDadosCliente clientes={cliente} onDetalhesCliente={detalhesDoCliente} onFechar={() => setVisivel('tabcli')} />
              </div>

            </div>

          </div>
        )}
      </div >
    </Suspense>
  );
}
