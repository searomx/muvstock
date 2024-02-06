import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { deleteById, getByCnpj, getById, updateById } from "@/lib/services";

type DadosClientesProps = {
  id: string;
  nome: string;
  cnpj: string;
  municipio: string;
  uf: string
}
export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const cnpj = searchParams.get("cnpj");
  try {
    if (cnpj) {
      const dados = await getByCnpj(cnpj);
      console.log("cnpj-enviado: ", cnpj);
      return Response.json({ dados }, { status: 200 });
    }
  } catch (error) {
    return Response.json({ error: "Cliente não encontrado!" }, { status: 400 });
  }



  // try {
  //   const cnpj = req.url.split("/base/")[1];
  //   const dados = await getByCnpj(cnpj);
  //   if (!dados) {
  //     return NextResponse.json(
  //       { message: "Cliente não foi Localizado!" },
  //       { status: 404 }
  //     );
  //   } else {
  //     return NextResponse.json(dados, { status: 200 });
  //   }
  // } catch (error) {
  //   return NextResponse.json(
  //     { message: "Erro no Servidor", error },
  //     { status: 500 }
  //   );
  // }
};

// export const GET = async (req: Request) => {
//   try {
//     const id = req.url.split("/cliente/")[1];
//     const dados = await getById(id);
//     if (!dados) {
//       return NextResponse.json(
//         { message: "Cliente não foi Localizado!" },
//         { status: 404 }
//       );
//     } else {
//       return NextResponse.json(dados, { status: 200 });
//     }
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Erro no Servidor", error },
//       { status: 500 }
//     );
//   }
// };

export const PUT = async (req: Request, context: any) => {
  const param = context.params;
  console.log("param-Interno: ", param);
  try {
    const id = param; //req.url.split("/cliente/")[1];
    const { nome, cnpj, municipio, uf } = await req.json() as DadosClientesProps;
    const idCliente = await updateById(id);

    if (!idCliente) {
      return NextResponse.json(
        { message: "Cliente não foi Localizado!" },
        { status: 404 }
      );
    } else {
      const cliente = await prisma.customer.update({
        where: {
          id,
        },
        data: {
          nome,
          cnpj,
          municipio,
          uf,
        },
      });
      return NextResponse.json(
        { message: `Dados do cliente ${nome} Alterados!!` },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Erro no Servidor", error },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: Request, context: any) => {
  // const id = context.params as string;
  // console.log("param-Interno-Delete: ", id);
  try {
    const id = req.url.split("/cliente/")[1];
    const dados = await deleteById(id);
    const dadosCliente = await getById(id);

    if (!dados) {
      return NextResponse.json(
        { message: "Cliente não foi Localizado!" },
        { status: 404 }
      );
    } else {
      const cliente = await prisma.customer.delete({
        where: {
          id: id,
        },
      });
      return NextResponse.json(
        { message: `Cliente: ${dadosCliente?.nome} Excluido!!` },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Erro no Servidor", error },
      { status: 500 }
    );
  }
};
