import ShowInputForm from "./ShowInputForm";
import { Customer } from "@prisma/client";
import { FaWindowClose } from "react-icons/fa";

interface FormularioDadosClienteProps {
  clientes?: Customer;
  onFechar?: () => void;
  onDetalhesCliente?: (cliente: Customer) => void;
}

export default function FormularioDadosCliente(props: FormularioDadosClienteProps) {

  return (
    <>
      <div className={`flex flex-col min-w-screen-md lg:min-h-full xl:min-h-full p-4 bg-zinc-200 
                      border border-zinc-400 rounded-md z-50 shadow-md`}>
        <div className="flex flex-initial w-full p-4 relative">
          <button onClick={props.onFechar} className={`flex items-center 
          justify-center rounded-lg 
          absolute right-0 -top-2 
          w-7 h-7 `}>
            <FaWindowClose size={24} className="text-red-500" />
          </button>
        </div>
        <div className="flex justify-start gap-2 flex-wrap">
          <ShowInputForm tipo="text" texto="Nome:" tamanho={40} valor={props.clientes.nome} />
          <ShowInputForm tipo="text" texto="Cnpj:" tamanho={20} valor={props.clientes.cnpj} />

          <ShowInputForm tipo="text" texto="Endereço:" tamanho={20} valor={props.clientes.logradouro} />
          <ShowInputForm tipo="text" texto="Numero:" tamanho={10} valor={props.clientes.numero} />
          <ShowInputForm tipo="text" texto="Bairro:" tamanho={30} valor={props.clientes.bairro} />
          <ShowInputForm tipo="text" texto="Cep:" tamanho={10} valor={props.clientes.cep} />
          <ShowInputForm tipo="text" texto="Municipio:" tamanho={30} valor={props.clientes.municipio} />


          <ShowInputForm alinhaTexto="center" tipo="text" texto="Estado:" tamanho={5} valor={props.clientes.uf} />
          <ShowInputForm tipo="text" texto="Ativ.Principal:" tamanho={40} valor={props.clientes.atividade_principal[0].text} />
          <ShowInputForm alinhaTexto="center" tipo="text" texto="Codigo Ativ.Principal:" tamanho={10} valor={props.clientes.atividade_principal[0].code} />
        </div>
      </div>
    </>
  )
}
