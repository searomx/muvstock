'use client';
import { Suspense, memo, useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { api } from "./services/server";
import { Customer } from "@prisma/client";
import Papa from "papaparse";
import CompleteString from "@/lib/utils/CompleteString";
import ValidaCnpj from "@/lib/utils/validacnpj";
import ShowToast from "@/lib/utils/showToast";
import Header from "./components/navigation/navbar/header";
import Loading from "./loading";
import TableCnpjBase from "./components/cnpj/TableCnpjBase";
import ClientesTable from "./components/clientes/ClientesTable";

import { ToastContainer, Bounce } from "react-toastify";

type BaseCnpj = {
  id?: string;
  cnpj?: string;
}
type TBaseCnpj = {
  id?: string;
  cnpj?: string;
}

const initialState: TBaseCnpj[] = [];
const initialStateCliente: Customer[] = [];

type Action = | { type: "complete"; payload: TBaseCnpj[] } | { type: "remove"; id: string };
type ActionCliente = | { type: "complete"; payload: Customer[] } | { type: "add"; customer: Customer };

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

function reducerCliente(stateCliente: Customer[], action: ActionCliente) {
  switch (action.type) {
    case "add":
      return [...stateCliente, action.customer];
    case "complete":
      return action.payload;
    default:
      return stateCliente;
  }
}

export default function Home() {
  const [clientes, setClientes] = useState<Customer[] | null>([]);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [stateCliente, dispatchCliente] = useReducer(reducerCliente, initialStateCliente);
  const [inputCnpjUnico, setCnpjUnico] = useState<string>("");
  const [inputToken, setInputToken] = useState<string>("");
  const [processando, setProcessando] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [totalSegundos, setTotalSegundos] = useState<number>(2 * 60);
  const minutos = Math.floor(totalSegundos / 60);
  const segundos = totalSegundos % 60;
  const intervalo = useRef<NodeJS.Timeout | null>(null);

  const strtoken =
    "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJoZWxsbyI6IndvcmxkIiwibWVzc2FnZSI6IlRoYW5rcyBmb3IgdmlzaXRpbmcgbm96emxlZ2Vhci5jb20hIiwiaXNzdWVkIjoxNTU3MjU4ODc3NTI2fQ.NXd7lC3rFLiNHXwefUu3OQ-R203pGfB87-dIrk2S-vqfaygIWFwZKzmGHr6pzYkl2a0HkY0fdwa38yLWu8Zdhg";

  const cabecalho = useMemo(() => {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Charset': 'utf-8',
    };
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const SaveAsCnpj = async (cnpjs: BaseCnpj[]) => {
    setProcessando(true);
    try {
      await api.post("/api/base/", cnpjs).then((response) => {
        const resp = response.data;
        console.log("response-status-page:", resp);
        console.log("response-data-page:", JSON.stringify(response.data));
        if (response.data === 200 || 201) {
          ShowToast.showToast("Dados base-cnpj salvos com sucesso!", "success");
          showCnpjAll();
        } else {
          ShowToast.showToast("Erro ao salvar os dados da Base Cnpj!", "error");
        }
        setProcessando(false);
        return resp;
      });
    } catch (error) {
      setProcessando(false);
      ShowToast.showToast("Erro ao salvar os dados da Base Cnpj!", "error");
    }
  };

  const handlerCnpjBase = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        complete: async (results) => {
          cnpjs = results.data as BaseCnpj[];
          cnpjs.map((item) => dadosCnpjs.push({
            cnpj: CompleteString.formatarPadString(item.cnpj.toString(), 14, "0"),
          }));
          SaveAsCnpj(dadosCnpjs);
          setProcessando(false);
        },
        error: (error) => {
          alert("Erro ao analisar o CSV: " + error.message);
        },
      });
    }
  }, [SaveAsCnpj]);

  const onEnviarToken = useCallback(async () => {
    if (inputToken.trim() === "") {
      return;
    } else {
      await api.post("/api/token", {
        token: inputToken,
      }).then((response) => {
        if (response.status === 200) {
          ShowToast.showToast("Token Enviado com Sucesso!", "success");
        }
      }).catch(() => {
        ShowToast.showToast("Erro ao enviar o token!", "error");
      });
    }
  }, [inputToken]);

  useEffect(() => {
    onEnviarToken;
  }, [onEnviarToken]);

  const showDataClienteAll = async () => {
    setProcessando(true);
    try {
      await api.get("/api/cliente").then((response) => {
        dispatchCliente({ type: "complete", payload: response.data });
        setProcessando(false);
      }).catch((error) => {
        console.log("Erro ao buscar os dados dos clientes!", error);
        return;
      });
    } catch (error) {
      console.log("Erro ao buscar os dados dos clientes!", error);
      return;
    };
  };

  useEffect(() => {
    showDataClienteAll();
  }, []);

  const saveCustomer = useCallback(async (strCnpj: string, idCnpj?: string) => {
    try {
      await api.post("/api/cnpj", { cnpj: strCnpj }).then((res) => {
        if (res.status === 200) {
          dispatch({ type: "remove", id: idCnpj });
          ShowToast.showToast("Cliente Salvo com Sucesso!", "success");
          dispatchCliente({ type: "add", customer: res.data.result });
          setCnpjUnico("");
          return res;
        } else if (res.status === 404) {
          ShowToast.showToast("Cnpj não encontrado!", "info");
          return;
        }
      });
    } catch (error) {
      ShowToast.showToast(error.toString(), "error");
      return;
    }
  }, [dispatchCliente, dispatch]);

  const getDataCustomer = useCallback(async () => {
    if (inputCnpjUnico.trim() === "") {
      setIsRunning(true);
      const cnpjsBase = state.filter((cnpj, idx) => idx < 3);
      cnpjsBase.map((item, idx) => {
        const strCnpj = ValidaCnpj(item.cnpj);
        const idCnpj = item.id as string;
        if (strCnpj) {
          saveCustomer(strCnpj, idCnpj);
        }
        if (idx === 2) {
          setIsRunning(false);
        }
      });
    } else {
      const strCnpj = ValidaCnpj(inputCnpjUnico);
      const idCnpj = state.filter((cnpj) => cnpj.cnpj === strCnpj);
      if (strCnpj) {
        setIsRunning(false);
        saveCustomer(strCnpj, idCnpj[0].id);
      }
    }
  }, [inputCnpjUnico, state, saveCustomer]);

  const startTemporizador = useCallback(async () => {
    if (!isRunning) {
      await getDataCustomer();
      // isRunning ? setTotalSegundos(2 * 60) : setTotalSegundos(0);
    } else {
      if (totalSegundos === 0) {
        await getDataCustomer();
        setTotalSegundos(2 * 60);
      } else {
        intervalo.current = setTimeout(() => {
          setTotalSegundos(totalSegundos - 1);
        }, 1000);
        setIsRunning(true);
      }
    }
  }, [getDataCustomer, isRunning, totalSegundos]);

  useEffect(() => {
    console.log("isRunning:", isRunning);
    if (isRunning) {
      return () => {
        startTemporizador();
      }
    }
  }, [isRunning, startTemporizador]);

  //busca dados cnpj Base mongodb

  const showCnpjAll = async () => {
    setProcessando(true);
    await api.get("/api/base", {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Charset': 'utf-8',
      }
    }).then((res) => {
      const data: TBaseCnpj[] = res.data; // Update the type of data to be an array of TBaseCnpj
      if (res.status === 200) {
        dispatch({ type: "complete", payload: res.data.dados });
        setProcessando(false);

      } else if (res.status === 404) {
        ShowToast.showToast("Não existe registro na Base de Dados!", "error");
        return;
      }
    }).catch((error) => {
      console.log("Erro ao buscar os dados!", error);
      setProcessando(false);
      return;
    });
    return;
  };
  useEffect(() => {
    showCnpjAll();
  }, []);

  const getToken = async () => {
    try {
      const response = await api.get("/api/token");
      if (response.status === 200) {
        setInputToken(JSON.stringify(response.data.token));
      }
    } catch (error) {
      console.log("Erro ao buscar o token!", error);
    }
  };

  useEffect(() => {
    if (inputToken.length === 0) {
      getToken();
    } else {
      return;
    }
  }, [inputToken]);

  const stopRequestCnpj = () => {
    setIsRunning(false);
    clearTimeout(intervalo.current);
  };
  useEffect(() => {
    return () => {
      stopRequestCnpj();
    };
  }, []);


  return (
    <>
      <Suspense fallback={<Loading />}>
        {/* <div className="flex flex-col min-w-full min-h-max lg:max-h-[calc(100vh-9.5rem)] 2xl:min-h-[calc(100vh-9.2rem)] bg-slate-700 p-4 relative"> */}

        <div className="Content">
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
              <button id="btn-enviarToken" name="btn-enviarToken" onClick={() => onEnviarToken()} className="botao botao-blue ml-3">
                Enviar Token
              </button>
            </div>
            <div className="flex h-[5rem] bg-orange-500 p-1 border-slate-700 rounded-sm gap-3 items-center">
              <input
                type="text"
                id="cnpj-unico"
                name="cnpj-unico"
                onChange={(e) => setCnpjUnico(e.target.value)}
                value={inputCnpjUnico}
                className="border border-gray-400 bg-gray-100 rounded-md py-2 px-4 focus:outline-none focus:bg-white"
                placeholder="Digite o Cnpj..."
              />
              <button
                id="btn-enviar-individual"
                name="btn-enviar-individual"
                onClick={() => startTemporizador()}
                className="botao botao-blue ml-3"
              >
                Enviar Cnpj
              </button>
              <button
                id="btn-stop"
                name="btn-stop"
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
          <div className={`grid grid-cols-4
                         gap-4 
                         sm:grid-cols-1 md:grid-cols-1 
                         lg:grid-cols-4 xl:grid-cols-4 
                         2xl:grid-cols-4`}>
            <div className="flex w-full text-sm">
              {state && (
                <TableCnpjBase data={state || null} />
              )}
            </div>
            <div className="flex flex-col col-span-3 w-full max-h-full">
              {stateCliente && (
                <ClientesTable data={stateCliente} />
              )}
            </div>
          </div>
        </div >
      </Suspense>
      <ToastContainer transition={Bounce} />
    </>
  );
}
