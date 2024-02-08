
interface ShowDataFormProps {
  tipo: 'text' | 'number' | 'date' | 'password';
  texto: string;
  name?: string;
  alinhaTexto?: 'left' | 'center' | 'right';
  corTexto?: string;
  valor?: any;
  somenteLeitura?: boolean;
  className?: string;
  tamanho?: number;
  onChange?: (valor: any) => void;
}

export default function ShowDataForm({ tipo, texto, name, corTexto, alinhaTexto, valor, somenteLeitura, className, tamanho, onChange }: ShowDataFormProps) {
  const alinhamento = alinhaTexto ?? 'left';
  const corDoTexto = corTexto ?? 'black';
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="mb-1">
        {texto}
      </label>
      <input
        type={tipo}
        name={name}
        value={valor}
        readOnly={somenteLeitura}
        size={tamanho}
        style={{ textAlign: alinhamento, color: corDoTexto }}
        onChange={e => onChange?.(e.target.value)}
        className={`border border-gray-400
         bg-gray-100 rounded-md
          py-2 px-4 focus:outline-none
          ${somenteLeitura ? '' : 'focus:bg-white'}`} />
    </div>
  )
}
