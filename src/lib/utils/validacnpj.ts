export default function ValidaCnpj(strcnpj: string) {
  const cnpjx: string = strcnpj.replace(/[^0-9]/g, "");
  return cnpjx;
}
