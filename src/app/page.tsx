'use client';
import React, { Suspense, memo, useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { api } from "./services/server";
import { Customer } from "@prisma/client";
import Papa from "papaparse";
import CompleteString from "@/lib/utils/CompleteString";
import ValidaCnpj from "@/lib/utils/validacnpj";
import ShowToast from "@/lib/utils/showToast";
import Header from "./components/navigation/navbar/header";
import TableCnpjBase from "./components/cnpj/TableCnpjBase";
import ClientesTable from "./components/clientes/ClientesTable";
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import SignalWifiBadSharpIcon from '@mui/icons-material/SignalWifiBadSharp';
import { ToastContainer, Bounce } from "react-toastify";
import InputFileUpload from "./components/InputFileUpload";
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import PlayIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

type BaseCnpj = {
  id?: string;
  cnpj?: string;
}
type TBaseCnpj = {
  id?: string;
  cnpj?: string;
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

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
  const intervaloTimer = useRef<NodeJS.Timeout | null>(null);
  const [isPlay, setIsPlay] = useState<boolean>(false);

  const soundRef = useRef<HTMLAudioElement | undefined>(null);
  const MAX: number = 20;

  const toggleAudio = useCallback(() => {
    if (isPlay) {
      soundRef.current?.pause();
      setIsPlay(false);
    } else {
      void soundRef.current?.play();
      setIsPlay(true);
    }
    setIsPlay(!isPlay);
  }, [isPlay]);

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
        } else if (response.status === 402) {
          ShowToast.showToast("Token já está cadastrado!", "info");
        }
      }).catch(() => {
        ShowToast.showToast("Erro ao enviar o token!", "error");
      });
    }
  }, [inputToken]);

  useEffect(() => {
    if (inputToken.length === 0)
      onEnviarToken();
  }, [inputToken, onEnviarToken]);

  const showDataClienteAll = async () => {
    setProcessando(true);
    try {
      await api.get("/api/cliente").then((response) => {
        dispatchCliente({ type: "complete", payload: response.data });
        setProcessando(false);
      }).catch((error) => {
        ShowToast.showToast("Erro ao buscar os dados dos clientes!", "error");
        return;
      });
    } catch (error) {
      ShowToast.showToast("Erro ao buscar os dados dos clientes!", "error");
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
      });
    } else {
      const strCnpj = ValidaCnpj(inputCnpjUnico);
      const idCnpj = state.filter((cnpj) => cnpj.cnpj === strCnpj);
      if (strCnpj) {
        setIsRunning(false);
        await saveCustomer(strCnpj, idCnpj[0].id);
      }
    }
  }, [inputCnpjUnico, saveCustomer, state]);

  const startTemporizador = async () => {
    await getDataCustomer();
    setIsRunning(true);
  };

  useEffect(() => {
    if (isRunning) {
      intervaloTimer.current = setTimeout(async () => {
        setTotalSegundos(totalSegundos - 1);
        if (totalSegundos === 0) {
          await getDataCustomer();
          clearTimeout(intervaloTimer.current);
          setTotalSegundos(60);
          setIsRunning(true);
        }
      }, 1000);
    }
    return () => {
      if (intervaloTimer.current) {
        clearTimeout(intervaloTimer.current);
      }
    };
  }, [getDataCustomer, isRunning, totalSegundos]);

  //busca dados cnpj Base mongodb

  const showCnpjAll = async () => {
    setProcessando(true);
    await api.get("/api/base").then((res) => {
      const data: TBaseCnpj[] = res.data; // Update the type of data to be an array of TBaseCnpj
      if (res.status === 200) {
        dispatch({ type: "complete", payload: res.data.dados });
        //setTotalBaseCnpj(data.length);
        setProcessando(false);

      } else if (res.status === 404) {
        ShowToast.showToast("Não existe registro na Base de Dados!", "error");
        return;
      }
    }).catch((error) => {
      ShowToast.showToast("Erro ao buscar os dados de cnpj!", "error");
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

  useEffect(() => {
    if ((state.length === 0) && (isRunning)) {
      stopRequestCnpj();
      ShowToast.showToast("Processo Finalizado", "info");
      void soundRef.current?.play();
      setIsPlay(true);
    }
  }, [state, toggleAudio, isRunning, stateCliente.length]);

  return (
    <>
      <div className="Content">
        <Suspense fallback={<p className="font-bold text-2xl">Loading...</p>}>
          <Header>
            <InputFileUpload fn={handlerCnpjBase} />
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
              <button
                onClick={toggleAudio}
                type="button"
                className="m-auto w-20 rounded-full p-2 text-white shadow-sm"
              >
                {!isPlay ? (
                  <PlayIcon className="h-12 w-12" aria-hidden="true" />
                ) : (
                  <PauseIcon className="h-12 w-12" aria-hidden="true" />
                )}
              </button>
            </div>
            <div className="flex h-[5rem] w-auto bg-orange-500 p-1 border-slate-700 rounded-sm gap-3 items-center">
              <h1 className="text-white text-2xl">{`${minutos.toString().padStart(2, "0")} : ${segundos.toString().padStart(2, "0")}`}</h1>
            </div>
          </Header>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Item>
                  {state && (
                    <TableCnpjBase data={state || null} />
                  )}
                </Item>
              </Grid>
              <Grid item xs={8}>
                <Item>
                  {stateCliente && (
                    <ClientesTable data={stateCliente} />
                  )}
                </Item>
              </Grid>

            </Grid>
          </Box>
        </Suspense>
        <audio ref={soundRef} loop src="/message.mp3" />
      </div >
      <ToastContainer transition={Bounce} />
    </>
  );
}
