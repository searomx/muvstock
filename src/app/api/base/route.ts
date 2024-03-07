import { NextRequest, NextResponse } from 'next/server'
import { findCnpjAll } from "@/lib/services";
import prisma from "@/lib/db";

type TCnpj = {
  id: string | null;
  cnpj: string | null;
}

type TBase = {
  id?: string;
  cnpj?: string;
}
type TBasex = {
  id?: string;
  cnpj?: string;
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

export async function POST(req: NextRequest, resp: NextResponse) {
  const cnpj: TBase[] = await req.json();
  let cnpjValido: TBase[] = [];
  let cnpjInValido: TBasex[] = [];
  if (cnpj) {
    for (const item of cnpj) {
      let cnpjx = item.cnpj;
      const res = await prisma.base.findFirst({
        where: {
          cnpj: cnpjx,
        },
      });

      if (res === null) {
        await prisma.base.create({
          data: {
            cnpj: cnpjx,
          },
        }).then((data) => {
          cnpjValido.push({ id: data.id.toString(), cnpj: cnpjx });
          return NextResponse.json(cnpjValido, { status: 200 });
        });
      } else {
        const resp = await prisma.basex.findFirst({
          where: {
            cnpj: cnpjx,
          },
        });
        if (resp === null) {
          await prisma.basex.create({
            data: {
              id: res.id,
              cnpj: cnpjx,
            },
          }).then((dados) => {
            cnpjInValido.push({ id: dados.id, cnpj: cnpjx });

          });

        }
        return NextResponse.json(cnpjInValido, { status: 201 });
      }
    }
  }
  return NextResponse.json(cnpjValido, { status: 200 });
}
