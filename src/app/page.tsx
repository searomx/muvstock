'use client';
import TabelaCliente from "./components/clientes/TabelaCliente";
import TabelaCnpjBase from "./components/cnpj/TabelaCnpjBase";
import FormularioDadosCliente from "./components/FormularioDadosCliente";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "./services/server";
import { Customer } from "@prisma/client";
import Papa from "papaparse";
import CompleteString from "@/lib/utils/CompleteString";
import ValidaCnpj from "@/lib/utils/validacnpj";
import ShowToast from "@/lib/utils/showToast";
import TableBaseCnpj from "./components/cnpj/TableBaseCnpj";
import Header from "./components/navigation/navbar/header";

type BaseCnpj = {
  id: string;
  cnpj: string;
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

  let status: number = 0;

  const strtoken =
    "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJoZWxsbyI6IndvcmxkIiwibWVzc2FnZSI6IlRoYW5rcyBmb3IgdmlzaXRpbmcgbm96emxlZ2Vhci5jb20hIiwiaXNzdWVkIjoxNTU3MjU4ODc3NTI2fQ.NXd7lC3rFLiNHXwefUu3OQ-R203pGfB87-dIrk2S-vqfaygIWFwZKzmGHr6pzYkl2a0HkY0fdwa38yLWu8Zdhg";
  const statusRef = useRef<number>(0);

  const headers = useMemo(() => {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }, []);

  const getMensagemResponse = useCallback(async (resp: number, cnpj: string) => {
    let resResp: number = resp;
    console.log("resResp:", resResp);
    let cnpjResp: string = cnpj;
    if (resResp === 200) {
      statusRef.current = resResp;
      ShowToast.showToast("CNPJs Salvos com sucesso!", "success");
    } else if (resResp === 201) {
      ShowToast.showToast(`O CNPJ: ${cnpjResp} já existe na base de dados!`, "error");
    }
    return;
  }, []);

  const SaveAsCnpj = useCallback(async (cnpjs: BaseCnpj[]) => {
    setIsLoading(true);
    const result = await api.post("/api/base/1", cnpjs, {
      headers,
    }).then((response) => {
      const resp = response.data;
      if (response.status === 200) {
        resp.map((item: any) => {
          setIdCnpj(prevDados => [...prevDados, item.id]);
          console.log("item-base:", item.id);
        })
      }
      getMensagemResponse(response.status, response.data);
      console.log("response-base:", response.status);
      return response;
    });
    setIsLoading(false);
    idCnpj.map((item: any) => {
      console.log("item-id:", item);
    });
    return;
  }, [getMensagemResponse, headers, idCnpj]);



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
          SaveAsCnpj(dadosCnpjs);
        },
        error: (error) => {
          alert("Erro ao analisar o CSV: " + error.message);
        },
      });
    }
  }, [SaveAsCnpj]);

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

  useEffect(() => {
    setInputToken(strtoken);
  }, [inputToken]);

  function detalhesDoCliente(cliente: Customer) {
    setCliente(cliente);
    setVisivel('formcli');
  }

  //busca dados cnpj Base mongodb

  const showCnpjAll = async () => {
    let cnpjs: BaseCnpj[] = [];
    let xbase = [];
    setIsLoading(true);
    await api.get("/api/base").then((res) => {
      const data = res.data;
      if (data.status === 200) {
        xbase = data.dados;
        xbase.map((item: any) => {
          cnpjs.push({
            id: item.id.toString(),
            cnpj: item.cnpj.toString(),
          });
        });
        setDadosBase(cnpjs);
        setIsLoading(false);
        return res;
      } else {
        ShowToast.showToast("Não existe registro na Base de Dados!", "error");
      }
    }).catch((error) => {
      ShowToast.showToast("Erro ao buscar os dados na base de dados!", "error");
      console.log(error);
      return;
    });

  };

  useEffect(() => {
    showCnpjAll();
  }, [dadosBase]);

  // const afterSomeTime = (time: any) =>
  //   new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve(true);
  //     }, time);
  //   });

  // const callAfterSomeTime = async (callback: any, time: any) =>
  //   afterSomeTime(time).then(() => callback());
  // callAfterSomeTime(() => ShowToast.showToast("Eu chamo a cada 2 segundos", "success"), 2000);

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
