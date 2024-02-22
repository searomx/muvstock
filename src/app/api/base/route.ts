import { NextRequest, NextResponse } from 'next/server'
import { findCnpjAll } from "@/lib/services";
type TCnpj = {
  id: string | null;
  cnpj: string | null;
}

export const GET = async (request: NextRequest, response: NextResponse) => {
  try {
    const dados: TCnpj[] = await findCnpjAll();
    if (dados.length > 0) {
      return NextResponse.json({ dados }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Não existe Cnpjs Cadastrados' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error!" }, { status: 500 });
  }

}
