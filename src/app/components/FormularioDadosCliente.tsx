import ShowInputForm from "./ShowInputForm";
import { Customer } from "@prisma/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { PiAtFill } from "react-icons/pi";

interface FormularioDadosClienteProps {
  clientes?: Customer;
  onFechar?: () => void;
  onDetalhesCliente?: (cliente: Customer) => void;
}
type AtividadesSecundarias = {
  code?: String;
  text?: String
}

export default function FormularioDadosCliente(props: FormularioDadosClienteProps) {
  const listaAtvSecundaria = props?.clientes.atividades_secundarias.map((atv, index) => {
    return (
      <li key={index} className={`text-xl px-2 py-1 
                                ${index % 2 === 0 ?
          'bg-gray-200' : 'bg-gray-400'}`}>{atv.code + " - " + atv.text}</li>
    )
  });
  const listaSocios = props?.clientes.qsa.map((qsa, index) => {
    return (
      <li key={index} className={`text-xl px-2 py-1 
                                ${index % 2 === 0 ?
          'bg-gray-200' : 'bg-gray-400'}`}>{qsa.nome + " - " + qsa.qual}</li>
    )
  });
  return (
    <>
      <div className={`flex flex-col min-w-screen-md lg:min-h-full xl:min-h-full p-4 gap-4 bg-zinc-200 
                      border border-zinc-400 rounded-md shadow-md`}>
        <div className="flex w-full p-4 relative">
          <button onClick={props.onFechar} className={`flex items-center 
          justify-center rounded-lg 
          absolute right-0 -top-2 
          w-7 h-7 `}>
            <FaWindowClose size={24} className="text-red-500" />
          </button>
        </div>
        <div className="flex flex-col justify-start gap-2 flex-wrap p-2 border border-zinc-400 rounded-md">
          <span className="shadow-title font-semibold text-2xl">Dados Principais</span>
          <div className="flex justify-start gap-2 flex-wrap p-4 bg-slate-700 text-zinc-700 border border-zinc-400 rounded-md overflow-hidden">
            <ShowInputForm name="nome" className="text-white" tipo="text" texto="Nome:" tamanho={50} valor={props?.clientes.nome} />
            <ShowInputForm name="fantasia" className="text-white" tipo="text" texto="Fantasia:" tamanho={30} valor={props?.clientes.fantasia} />
            <ShowInputForm name="cnpj" className="text-white" tipo="text" texto="Cnpj:" tamanho={10} valor={props?.clientes.cnpj} />
            <ShowInputForm name="endereco" className="text-white" tipo="text" texto="Endereço:" tamanho={40} valor={props?.clientes.logradouro} />
            <ShowInputForm name="numero" className="text-white" tipo="text" texto="Numero:" tamanho={5} valor={props?.clientes.numero} />
            <ShowInputForm name="bairro" className="text-white" tipo="text" texto="Bairro:" tamanho={30} valor={props?.clientes.bairro} />
            <ShowInputForm name="cep" className="text-white" tipo="text" texto="Cep:" tamanho={10} valor={props?.clientes.cep} />
            <ShowInputForm name="municipio" className="text-white" tipo="text" texto="Municipio:" tamanho={50} valor={props?.clientes.municipio} />
            <ShowInputForm name="uf" className="text-white" alinhaTexto="center" tipo="text" texto="Estado:" tamanho={3} valor={props?.clientes.uf} />
            <ShowInputForm name="telefone" className="text-white" tipo="text" texto="Telefone:" tamanho={10} valor={props?.clientes.telefone} />
            <ShowInputForm name="email" className="text-white" tipo="text" texto="Email:" tamanho={30} valor={props?.clientes.email} />

          </div>
          <span className="shadow-title font-semibold text-2xl">Dados Complementares</span>
          <div className="flex justify-start gap-2 flex-wrap p-4 bg-slate-700 border-zinc-400 rounded-md overflow-hidden">
            <ShowInputForm name="situacao" className="text-white" tipo="text" texto="Situação:" tamanho={5} valor={props?.clientes.situacao} />
            <ShowInputForm name="abertura" className="text-white" tipo="text" texto="Data Abertura:" tamanho={10} valor={props?.clientes.abertura} />
            <ShowInputForm name="natjuridica" className="text-white" tipo="text" texto="Natureza Juridica:" tamanho={10} valor={props?.clientes.natureza_juridica} />
            <ShowInputForm name="capsocial" className="text-white" tipo="text" texto="Capital Social:" tamanho={10} valor={props?.clientes.capital_social} />
            <ShowInputForm name="tipo" className="text-white" tipo="text" texto="Tipo:" tamanho={10} valor={props?.clientes.tipo} />
            <ShowInputForm name="porte" className="text-white" tipo="text" texto="Porte:" tamanho={10} valor={props?.clientes.porte} />
            <ShowInputForm name="ultatualizacao" className="text-white" tipo="text" texto="Ultima Atualização:" tamanho={10} valor={props?.clientes.ultima_atualizacao} />
          </div>
          <span className="shadow-title font-semibold text-2xl">Atividades - Cnae</span>
          <div className="flex justify-start gap-2 flex-wrap p-4 bg-slate-700 border-zinc-400 rounded-md overflow-hidden">
            <ShowInputForm name="atvprincipal" className="text-white" tipo="text" texto="Ativ.Principal:" tamanho={40} valor={props?.clientes.atividade_principal[0].text} />
            <ShowInputForm name="codatvprincipal" className="text-white" alinhaTexto="center" tipo="text" texto="Codigo Ativ.Principal:" tamanho={10} valor={props?.clientes.atividade_principal[0].code} />
            <ShowInputForm name="atvsecundaria" className="text-white" tipo="text" texto="Ativ.Secundaria:" tamanho={40} valor={props?.clientes.atividades_secundarias[0].text} />
            <ShowInputForm name="codatvsecundaria" className="text-white" alinhaTexto="center" tipo="text" texto="Codigo Ativ.Secundaria:" tamanho={10} valor={props?.clientes.atividades_secundarias[0].code} />
            <div className="flex flex-col max-w-full gap-2 p-2 bg-neutral-400 border border-zinc-900 rounded-md overflow-y-visible">
              <span className="flex w-full p-2 bg-slate-100">Atividades Secudárias:</span>
              <ul>
                {listaAtvSecundaria}
              </ul>
            </div>
            <div className="flex flex-col max-w-full gap-2 p-2 bg-neutral-400 border border-zinc-900 rounded-md overflow-y-visible">
              <span className="flex w-full p-2 bg-slate-100">Lista de Sócios:</span>
              <ul>
                {listaSocios}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
