// Import the 'prisma' module
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAllClientes } from "@/lib/services";

type DadosClientesProps = {
  id: number;
  nome: string;
  cnpj: string;
  abertura: string;
  email: string;
  telefone: string;
  situacao: string;
  bairro: string;
  logradouro: string;
  numero: string;
  cep: string;
  municipio: string;
  uf: string;
  fantasia: string;
  capital_social: string;
  atividade_principal: [
    {
      text: string;
      code: string;
    }
  ];
  atividades_secundarias: [
    {
      text: string;
      code: string;
    }
  ];
  qsa: [
    {
      qual: string;
      nome: string;
      pais_origem: string;
      nome_rep_legal: string;
      qual_rep_legal: string;
    }
  ];
};


export const GET = async (req: Request, res: Response) => {
  try {
    const data = await getAllClientes();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Erro no Servidor" }, { status: 500 });
  }
};

export const POST = async (req: Request, res: Response) => {
  const { nome, cnpj, municipio, uf }: DadosClientesProps = await req.json();
  try {
    const cliente = await prisma.customer.create({
      data: {
        nome,
        cnpj,
        municipio,
        uf,
      },
    });
    return NextResponse.json({ message: "dados:", cliente }, { status: 200 });
  } catch (error) {
    console.log("O erro é: ", error);
  }
};

// export const PUT = async (req: Request, res: Response) => {
//   const { searchParams } = new URL(req.url);
//   const param = searchParams.get("id") as string;
//   console.log("param-route-externa: ", param);
//   const { id, nome, email, password }: DadosClientesProps = await req.json();
//   try {
//     const dados = await prisma.customer.update({
//       where: {
//         id,
//       },
//       data: {
//         nome,
//         email,
//         password,
//       },
//     });
//     return NextResponse.json(
//       { message: `dados alterados com sucesso!` },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(error, { status: 500 });
//   }
// };

// export const DELETE = async (req: Request, res: Response) => {
//   const { id } = await req.json();
//   try {
//     const dados = await prisma.customer.delete({
//       where: {
//         id,
//       },
//     });
//     return NextResponse.json(
//       { message: `Cliente: ${dados.nome} excluido com sucesso!` },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(error, { status: 500 });
//   }
// };

// export const PATCH = async (req: Request, res: Response) => {
//   const { id, nome, email, password }: DadosClientesProps = await req.json();
//   try {
//     const dados = await prisma.customer.update({
//       where: {
//         id,
//       },
//       data: {
//         nome,
//         email,
//         password,
//       },
//     });
//     return NextResponse.json(dados, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(error, { status: 500 });
//   }
// };

// export async function GET(request: Request) {}

// export async function HEAD(request: Request) {}

// export async function POST(request: Request) {}

// export async function PUT(request: Request) {}

// export async function DELETE(request: Request) {}

// export async function PATCH(request: Request) {}

// // If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and  set the appropriate Response `Allow` header depending on the other methods defined in the route handler.
// export async function OPTIONS(request: Request) {}

// export async function GET(req: NextRequest, context: any) {
//   const { params } = context;
//   console.log(params);
//   try {
//     const customer = await prisma.customer.findMany();
//     return NextResponse.json(customer, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(error, { status: 500 });
//   }
// }

// export async function POST(req: NextRequest) {
//   const { nome, email, password }: DadosClientesProps = await req.json();
//   try {
//     const dados = await prisma.customer.create({
//       data: {
//         nome,
//         email,
//         password,
//       },
//     });
//     return NextResponse.json(dados, { status: 201 });
//   } catch (error) {
//     return NextResponse.json(error, { status: 500 });
//   }
// }
// export async function DELETE(req: NextRequest) {
//   const { id } = await req.json();
//   try {
//     const dados = await prisma.customer.delete({
//       where: {
//         id,
//       },
//     });
//     return NextResponse.json(
//       { message: `Cliente: ${dados.nome} excluido com sucesso!` },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(error, { status: 500 });
//   }
// }

// export async function PUT(req: Request, res: Response) {
//   const { id, nome, email, password }: DadosClientesProps = await req.json();
//   try {
//     const dados = await prisma.customer.update({
//       where: {
//         id,
//       },
//       data: {
//         nome,
//         email,
//         password,
//       },
//     });
//     return NextResponse.json(dados, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(error, { status: 500 });
//   }
// }
