interface TabelaCnpjBaseProps {
  base: any[] | null;
  handleFiles: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
    return props.base?.map((cnpj, i) => {
      return (
        <tr key={cnpj.id} className={`${i % 2 === 0 ? 'bg-slate-300' : 'bg-slate-200'}`}>
          <td className="text-left p-4">{cnpj.id}</td>
          <td className="text-left p-4">{cnpj.cnpj}</td>
        </tr>
      )
    });
  }

  return (
    <>
      <div className="flex p-3 w-full h-20 overflow-hidden justify-center items-center">
        <label htmlFor="selecao-arquivo" className="btn btn-blue cursor-pointer">
          Selecionar um arquivo &#187;
        </label>
        <input
          id="selecao-arquivo"
          accept=".csv"
          type="file"
          onChange={props.handleFiles} />
      </div>
      <div className="flex flex-col min-w-full max-h-[calc(100vh-15.3rem)]">
        <div className="tableContainer">
          <table className="w-full">
            <thead className="bg-amber-500 p-4">
              {renderizarCabecalho()}
            </thead>
            <tbody>
              {renderizarDados()}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
