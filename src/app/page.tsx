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
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import SignalWifiBadSharpIcon from '@mui/icons-material/SignalWifiBadSharp';
import { ToastContainer, Bounce } from "react-toastify";
import { styled } from "@mui/material/styles";

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

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

// const startIntervalo = () => {
//   let totalSegundos = 2 * 60;
//   const intervalo = setInterval(() => {
//     totalSegundos--;
//     if (totalSegundos === 0) {
//       clearInterval(intervalo);
//     }
//   }, 1000);
// }


export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [stateCliente, dispatchCliente] = useReducer(reducerCliente, initialStateCliente);
  const [inputCnpjUnico, setCnpjUnico] = useState<string>("");
  const [inputToken, setInputToken] = useState<string>("");
  const [processando, setProcessando] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  let [totalSegundos, setTotalSegundos] = useState<number>(60);
  const minutos = Math.floor(totalSegundos / 60);
  const segundos = totalSegundos % 60;
  const intervalo = useRef<NodeJS.Timeout | null>(null);
  const [totalBaseCnpj, setTotalBaseCnpj] = useState<number>(0);
  const [totalClientes, setTotalClientes] = useState<number>(0);

  const SaveAsCnpj = useCallback(async (cnpjs: BaseCnpj[]) => {
    setProcessando(true);
    try {
      await api.post("/api/base/", cnpjs).then(async (response) => {
        const resp = response.data;
        if (response.data === 200 || 201) {
          await showCnpjAll();
          ShowToast.showToast("Dados base-cnpj salvos com sucesso!", "success");
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
  }, []);

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
        token: inputToken.trim(),
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
    onEnviarToken();
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
      cnpjsBase.map(async (item, indice) => {
        const strCnpj = ValidaCnpj(item.cnpj);
        const idCnpj = item.id as string;
        await saveCustomer(strCnpj, idCnpj);
        if (totalSegundos === 0) {
          setTotalSegundos(60);
        }

      });
    } else {
      const strCnpj = ValidaCnpj(inputCnpjUnico);
      const idCnpj = state.filter((cnpj) => cnpj.cnpj === strCnpj);
      if (strCnpj) {
        setIsRunning(false);
        await saveCustomer(strCnpj, idCnpj[0].id);
      }
    }
  }, [inputCnpjUnico, saveCustomer, state, totalSegundos]);

  const startTemporizador = async () => {
    await getDataCustomer();
    setIsRunning(true);
  };

  useEffect(() => {
    if (isRunning) {
      intervalo.current = setTimeout(async () => {
        setTotalSegundos(totalSegundos - 1);
        if (totalSegundos === 0) {
          await getDataCustomer();
        }
      }, 1000);
    }
    return () => {
      if (intervalo.current) {
        clearTimeout(intervalo.current);
      }
    };
  }, [isRunning, totalSegundos, getDataCustomer]);

  //busca dados cnpj Base mongodb

  const showCnpjAll = async () => {
    setProcessando(true);
    await api.get("/api/base").then((res) => {
      const data: TBaseCnpj[] = res.data; // Update the type of data to be an array of TBaseCnpj
      if (res.status === 200) {
        dispatch({ type: "complete", payload: res.data.dados });
        setTotalBaseCnpj(data.length);
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
    setTotalSegundos(60);
  };
  useEffect(() => {
    stopRequestCnpj();
  }, []);


  return (
    <>

      {/* <div className="flex flex-col min-w-full min-h-max lg:max-h-[calc(100vh-9.5rem)] 2xl:min-h-[calc(100vh-9.2rem)] bg-slate-700 p-4 relative"> */}

      <div className="Content">
        <Suspense fallback={<p className="font-bold text-2xl">Loading...</p>}>
          <Header>
            <Button
              component="label"
              id="selecao-arquivo"
              htmlFor="selecao-arquivo"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Selecione um arquivo .csv
              <VisuallyHiddenInput type="file" accept=".csv" />
            </Button>
            {/* <label htmlFor="selecao-arquivo" className="botao botao-orange cursor-pointer">
              Selecionar um arquivo csv &#187;
            </label>
            <input
              id="selecao-arquivo"
              accept=".csv"
              type="file"
              onChange={handlerCnpjBase} /> */}

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
              <Button id="btn-enviarToken" variant="contained" endIcon={<SendIcon />} name="btn-enviarToken" onClick={() => onEnviarToken()}>
                Enviar Token
              </Button>
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
              <Button
                id="btn-enviar-individual"
                name="btn-enviar-individual"
                onClick={() => startTemporizador()}
                variant="contained" endIcon={<SendIcon />}

              >
                Enviar Cnpj
              </Button>
              <Button
                id="btn-stop"
                name="btn-stop"
                onClick={() => stopRequestCnpj()}
                variant="contained" endIcon={<SignalWifiBadSharpIcon />}
              >
                Interromper
              </Button>
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
        </Suspense>
      </div >
      <ToastContainer transition={Bounce} />
    </>
  );
}
