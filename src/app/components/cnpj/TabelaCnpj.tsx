import CnpjBase from "@/core/CnpjBase";

interface TabelaCnpjBaseProps {
    cnpj: CnpjBase[];
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
        return props.cnpj?.map((cnpj, i) => {
            return (
                <tr key={cnpj.id} className={`${i % 2 === 0 ? 'bg-slate-300' : 'bg-slate-200'}`}>
                    <td className="text-left p-4">{cnpj.id}</td>
                    <td className="text-left p-4">{cnpj.cnpj}</td>
                </tr>
            )
        });
    }

    return (

        <table className="w-full">
            <thead className="bg-amber-500 p-4">
                {renderizarCabecalho()}
            </thead>
            <tbody>
                {renderizarDados()}
            </tbody>
        </table>

    )
}
