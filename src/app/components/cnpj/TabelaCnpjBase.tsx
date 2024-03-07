
type BaseCnpj = {
  id?: string;
  cnpj: string;
}
interface TabelaCnpjBaseProps {
  base: BaseCnpj[] | null;
  //handleFiles: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TabelaCnpjBase(props: TabelaCnpjBaseProps) {
  function renderizarCabecalho() {
    return (
      <tr>
        <th className="text-left p-4">Código</th>
        <th className="text-left p-4">Cnpj</th>
      </tr>
    )
  }
  function renderizarDados() {
    return props.base?.map((item, index) => {
      return (
        <tr key={item.id} className={`${index % 2 === 0 ? 'bg-slate-300' : 'bg-slate-200'}`}>
          <td className="text-left p-4 w-16">{item.id}</td>
          <td className="text-left p-4">{item.cnpj}</td>
        </tr>
      )
    });
  }

  return (
    <div className={`2xl:max-h-[48rem] xl:max-h-[38rem] min-w-full 
    xl:text-sm pt-0 pb-3 px-1 
    border-solid border-slate-300 
    rounded-tr-none rounded-tl-md 
    rounded-bl-md rounded-br-none 
    overflow-auto`}>
      <table className="min-w-full min-h-full xl:text-sm">
        <thead className="bg-amber-500 p-4">
          {renderizarCabecalho()}
        </thead>
        <tbody>
          {renderizarDados()}
        </tbody>
      </table>
    </div>
  )
}
