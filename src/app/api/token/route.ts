import { getToken, postToken } from "@/lib/services";
import { NextRequest, NextResponse } from "next/server";

const getTokens = async () => {
  const gettoken = await getToken();
  return gettoken;
}

export async function POST(req: NextRequest, resp: NextResponse) {
  const token = await req.json();
  const tokens = await getTokens();
  if (tokens === null) {
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
  return NextResponse.json({ message: "Token já cadastrado" }, { status: 402 });
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
