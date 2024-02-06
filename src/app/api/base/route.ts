import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { findCnpjByIdBase } from "@/lib/services";

type TBase = {
  id?: string;
  cnpj?: string;
}
type TBasex = {
  id?: string;
  cnpj?: string;
}

// export const GET = async (req: NextRequest, res: Response) => {
//   const id: string = req.url.split("/base")[1] as string;
//   const idx = id.split("=")[1];
//   const dados = await findCnpjByIdBase(idx);
//   return Response.json({ message: { dados } }, { status: 200 });
// }
export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  try {
    if (id) {
      const dados = await findCnpjByIdBase(id);
      console.log("cnpj-enviado: ", id);
      return Response.json({ dados }, { status: 200 });
    }
  } catch (error) {
    return Response.json({ error: "Cliente não encontrado!" }, { status: 400 });
  }

}
export async function POST(req: NextRequest, resp: NextResponse) {
  const cnpj: TBase[] = await req.json();
  console.log("cnpj-router: ", cnpj);
  let cnpjValido: TBase[] = [] as TBase[];
  let cnpjInValido: TBasex[] = [] as TBasex[];
  if (cnpj) {
    for (let i = 0; i < cnpj.length; i++) {
      let cnpjx = cnpj[i].cnpj as TBase["cnpj"];
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
          cnpjValido.push({ id: data.id.toString(), cnpj: cnpj[i].toString() });
          return data;
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
