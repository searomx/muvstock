interface HeaderProps {
  children: any;
}

export default function Header(props: Readonly<HeaderProps>) {
  return (
    <div className="flex w-full h-24 bg-sky-600 px-4 py-6 mb-1 gap-5 items-center rounded-md">
      {props.children}
    </div>
  );
}
