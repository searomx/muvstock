import { NextRequest, NextResponse } from 'next/server'
import { criarBaseCnpj, findCnpjAll } from "@/lib/services";

type TCnpj = {
  id?: string | null;
  cnpj?: string | null;
}

type TBase = {
  cnpj?: string;
}

export const GET = async (req: NextRequest, resp: NextResponse) => {
  try {
    const dados: TCnpj[] = await findCnpjAll();
    if (dados.length > 0) {
      return NextResponse.json({ dados }, { status: 200 });
    } else {
      return NextResponse.json({ dados }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error!" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, resp: NextResponse) {
  const cnpjEnviado: TBase[] = await req.json();
  try {
    const res = await criarBaseCnpj(cnpjEnviado);
    if (res !== null) {
      return NextResponse.json({ status: 201 });
    } else {
      return NextResponse.json({ message: "Erro ao cadastrar CNPJ!" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error!" }, { status: 500 });
  }
}
