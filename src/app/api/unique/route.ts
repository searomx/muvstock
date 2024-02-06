import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { findCnpjByIdBase } from "@/lib/services";

interface ParamsCnpjProps {
  cnpj: string;
}
type Idados = {
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
};

export const POST = async (req: Request, res: Response) => {
  const { cnpj }: ParamsCnpjProps = await req.json();
  console.log("cnpj: ", cnpj);

  if (cnpj) {
    const res = await prisma.customer.findFirst({
      where: {
        cnpj: cnpj.trim(),
      },
    });
    if (!res) {
      const cnpjLimpo = ("00000000000000" + cnpj).slice(-14);
      const response = await fetch(
        `https://www.receitaws.com.br/v1/cnpj/${cnpjLimpo}`
      );
      const json = await response.json();
      console.log("json: ", json);
      try {
        const dados = await prisma.customer.create({
          data: {
            cnpj: json.cnpj,
            nome: json.nome,
            abertura: json.abertura,
            email: json.email,
            telefone: json.telefone,
            situacao: json.situacao,
            bairro: json.bairro,
            logradouro: json.logradouro,
            numero: json.numero,
            cep: json.cep,
            municipio: json.municipio,
            uf: json.uf,
            fantasia: json.fantasia,
            capital_social: json.capital_social,
            atividade_principal: json.atividade_principal,
            atividades_secundarias: json.atividades_secundarias,
            qsa: json.qsa,
          },
        });
        return NextResponse.json({ message: "dados:", dados }, { status: 201 });
      } catch (error) {
        console.log("Ocorreu o erro: ", error);
      }
      return NextResponse.json({ message: "OK", json }, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "CNPJ já cadastrado!" },
        { status: 200 }
      );
    }
  }
};

export const GET = async (req: Request, res: Response) => {
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
};
