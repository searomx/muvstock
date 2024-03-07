// Import the 'prisma' module
import prisma from "@/lib/db";
import { getAllClientes } from "@/lib/services";
import { NextResponse } from "next/server";

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
