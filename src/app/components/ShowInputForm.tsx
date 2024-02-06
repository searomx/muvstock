
interface ShowDataFormProps {
  tipo: 'text' | 'number' | 'date' | 'password';
  texto: string;
  alinhaTexto?: 'left' | 'center' | 'right';
  valor: any;
  somenteLeitura?: boolean;
  className?: string;
  tamanho: number
  onChange?: (valor: any) => void;
}

export default function ShowDataForm({ tipo, texto, alinhaTexto, valor, somenteLeitura, className, tamanho, onChange }: ShowDataFormProps) {
  const alinhamento = alinhaTexto ?? 'left';
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="mb-1">
        {texto}
      </label>
      <input
        type={tipo}
        value={valor}
        readOnly={somenteLeitura}
        size={tamanho}
        style={{ textAlign: alinhamento }}
        onChange={e => onChange?.(e.target.value)}
        className={`border border-gray-400
         bg-gray-100 rounded-md
          py-2 px-4 focus:outline-none
          ${somenteLeitura ? '' : 'focus:bg-white'}`} />
    </div>
  )
}
