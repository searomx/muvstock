import { getToken, postToken } from "@/lib/services";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, resp: NextResponse) {
  const { token } = await req.json();
  try {
    if (token) {
      const result = await postToken(token);
      return NextResponse.json({ result }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Erro no Servidor" }, { status: 500 });
  }
  return;
}

export async function GET(req: NextRequest, resp: NextResponse) {
  const { token } = await getToken();
  try {
    if (token) {
      return NextResponse.json({ token }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Token não encontrado" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Erro no Servidor" }, { status: 500 });
  }
}
