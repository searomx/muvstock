interface BotaoProps {
  className?: string;
  cor?: 'gren' | 'blue' | 'gray';
  children: any;
  onClick?: () => void;
}
export default function Botao(props: BotaoProps) {
  const cor = props.cor ?? 'blue';
  return (
    <button onClick={props.onClick}
      className={`bg-gradiente-to-r from-${cor}-400 to-${cor}-700 text-white px-4 py-2 rounded-md
            ${props.className}`}>
      {props.children}
    </button>
  )
}
