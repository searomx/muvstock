'use client';
import TabelaCliente from "./components/clientes/TabelaCliente";
import TabelaCnpjBase from "./components/cnpj/TabelaCnpjBase";
import FormularioDadosCliente from "./components/FormularioDadosCliente";
import { useCallback, useEffect, useRef, useState, useReducer } from "react";
import { api } from "./services/server";
import { Customer } from "@prisma/client";
import Papa from "papaparse";
import CompleteString from "@/lib/utils/CompleteString";
import ValidaCnpj from "@/lib/utils/validacnpj";
import ShowToast from "@/lib/utils/showToast";
import Header from "./components/navigation/navbar/header";
import AbortController from 'abort-controller';

type BaseCnpj = {
  id: string;
  cnpj: string;
}

type TClientes = {
  id: string;
  nome: string;
  cnpj: string;
  municipio: string;
  uf: string;
}
const initialState: TClientes[] = []
type Action = | { type: "complete", payload: TClientes[] }

function reducer(state: TClientes[], action: Action): TClientes[] {
  switch (action.type) {
    case "complete":
      console.log(action.payload);
      return action.payload;
    default:
      return state;
  }

}

export default function Home() {
  const [dadosBase, setDadosBase] = useState<BaseCnpj[]>([]);
  const [clientes, setClientes] = useState<Customer[] | null>([]);
  const [cliente, setCliente] = useState<Customer | null>(null);
  const [visivel, setVisivel] = useState<'tabcli' | 'formcli'>('tabcli');
  const [isLoading, setIsLoading] = useState(false);
  const [idCnpj, setIdCnpj] = useState<string[]>([]);

  const [inputCnpjUnico, setCnpjUnico] = useState<string>("");
  const [inputToken, setInputToken] = useState<string>("");
  const [state, dispatch] = useReducer(reducer, initialState);

  const strtoken =
    "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJoZWxsbyI6IndvcmxkIiwibWVzc2FnZSI6IlRoYW5rcyBmb3IgdmlzaXRpbmcgbm96emxlZ2Vhci5jb20hIiwiaXNzdWVkIjoxNTU3MjU4ODc3NTI2fQ.NXd7lC3rFLiNHXwefUu3OQ-R203pGfB87-dIrk2S-vqfaygIWFwZKzmGHr6pzYkl2a0HkY0fdwa38yLWu8Zdhg";
  const statusRef = useRef<number>(0);


  const afterSomeTime = (time: any) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });

  const callAfterSomeTime = useCallback(async (callback: any, time: any) =>
    afterSomeTime(time).then(() => callback())
    , []);

  const SaveAsCnpj = async (cnpjs: BaseCnpj[]) => {
    setIsLoading(true);
    await api.post("/api/base/1", cnpjs, {
    }).then((response) => {
      if (response.status === 200) {
        showCnpjAll();

        // resp.map((item: any) => {
        //   setIdCnpj(prevDados => [...prevDados, item.id]);
        // });
      }
      getMensagemResponse(response.status, response.data.cnpj);
      return response;
    });
    setIsLoading(false);
    // idCnpj.map((item: any) => {
    //   console.log("item-id:", item);
    // });
    return;
  }

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

  async function enviarCnpjUnico() {
    if (inputCnpjUnico.trim() === "") {
      return;
    }
    const cnpj_validado = ValidaCnpj(inputCnpjUnico);
    if (cnpj_validado) {
      await api.post("/api/unique", { cnpj: cnpj_validado });
      ShowToast.showToast("CNPJ salvo com sucesso!", "success");
      console.log("CNPJ Validado:", cnpj_validado);
    } else {
      ShowToast.showToast("CNPJ inválido!", "error");
    }
  }

  const handlerCnpjBase = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    let cnpjs: BaseCnpj[] = [];
    let dadosCnpjs: BaseCnpj[] = [];
    let status: number = 0;
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
          // setDadosBase(dadosCnpjs);
          SaveAsCnpj(dadosCnpjs);

        },
        error: (error) => {
          getMensagemResponse(status);
        },
      });


      // callAfterSomeTime(() => showCnpjAll(), 2000);
    }
  };


  useEffect(() => {
    const showDataClienteAll = async () => {
      setIsLoading(true);
      const response = await api.get("/api/cliente");
      setClientes(response.data);
      setIsLoading(false);
    };

    showDataClienteAll();
  }, [clientes]);

  useEffect(() => {
    setInputToken(strtoken);
  }, [inputToken]);

  function detalhesDoCliente(cliente: Customer) {
    setCliente(cliente);
    setVisivel('formcli');
  }

  //busca dados cnpj Base mongodb
  const getMensagemResponse = useCallback(async (resp: number = 0, cnpj?: string) => {
    let resResp: number = resp;
    let cnpjResp: string = cnpj;
    switch (resResp) {
      case 200:
        statusRef.current = resResp;
        ShowToast.showToast("CNPJs Salvos com sucesso!", "success");
        break;
      case 201:
        ShowToast.showToast(`O CNPJ: ${cnpjResp} já existe na base de dados!`, "error");
        break;
      case 404:
        ShowToast.showToast("Não foram encontrados registros na base de dados!", "error");
        break;
      case 500:
        ShowToast.showToast("Ocorreu erro no servidor!", "error");
        break;
      default:
        ShowToast.showToast("Erro ao salvar os dados!", "error");
        break;
    }
  }, []);

  const showCnpjAll = useCallback(async () => {
    let cnpjs: BaseCnpj[] = [];
    let xbase = [];
    let status: number = 0;
    setIsLoading(true);
    try {
      await api.get("/api/base").then((response) => {
        const data = response.data;
        status = response.status;
        if (response.status === 200) {
          xbase = data.dados as BaseCnpj[];
          // xbase.map((item: any) => {
          //   cnpjs.push({
          //     id: item.id.toString(),
          //     cnpj: item.cnpj.toString(),
          //   });
          // });
          setDadosBase(xbase);

          setIsLoading(false);
          return response;
        } else {
          getMensagemResponse(status);
          return;
        }
      }).catch((error) => {
        getMensagemResponse(status);
        return;
      });

    } catch (error) {
      getMensagemResponse(status);
      return;
    }
  }, [getMensagemResponse]);

  useEffect(() => {
    showCnpjAll();
  }, [showCnpjAll]);

  return (
    <>
      <div className="flex flex-col min-w-full lg:max-h-[calc(100vh-9.5rem)] 2xl:min-h-[calc(100vh-9.2rem)] bg-slate-700 p-4 relative">
        <Header>
          <label htmlFor="selecao-arquivo" className="botao botao-orange cursor-pointer">
            Selecionar um arquivo csv &#187;
          </label>
          <input
            id="selecao-arquivo"
            accept=".csv"
            type="file"
            onChange={handlerCnpjBase} />

          <div className="flex bg-orange-500 p-1 border border-slate-700 rounded-sm gap-3 items-center">
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
          <div className="flex bg-orange-500 p-1 border border-slate-700 rounded-sm gap-3 justify-center items-center">
            <input
              type="text"
              onChange={(e) => setCnpjUnico(e.target.value)}
              value={inputCnpjUnico}
              className="border border-gray-400 bg-gray-100 rounded-md py-2 px-4 focus:outline-none focus:bg-white"
              placeholder="Digite o Cnpj..."
            />
            <button
              id="btn-enviar-individual"
              onClick={enviarCnpjUnico}
              className="botao botao-blue ml-3"
            >
              Enviar Cnpj Individual
            </button>
          </div>
        </Header>
        {visivel === 'tabcli' ? (
          <div className={`grid grid-cols-4 justify-items-center
                         gap-4 
                         sm:grid-cols-1 md:grid-cols-1 
                         lg:grid-cols-4 xl:grid-cols-4 
                         2xl:grid-cols-4`}>
            <div className="flex w-full">
              <TabelaCnpjBase base={dadosBase} />
            </div>
            <div className="flex flex-col col-span-3 w-full">
              <TabelaCliente clientes={clientes} onDetalhesCliente={detalhesDoCliente} />
            </div>
          </div>
        ) : (
          <div className={`grid grid-cols-4 justify-items-center
                         gap-4
                         sm:grid-cols-1 md:grid-cols-1 
                         lg:grid-cols-4 xl:grid-cols-4 
                         2xl:grid-cols-4`}>
            <div className="flex w-full">
              <TabelaCnpjBase base={dadosBase} />
            </div>
            <div className="flex flex-col col-span-3 w-full">
              <div className="tableContainer">
                <FormularioDadosCliente clientes={cliente} onDetalhesCliente={detalhesDoCliente} onFechar={() => setVisivel('tabcli')} />
              </div>

            </div>

          </div>
        )}

      </div >
    </>
  );
}

