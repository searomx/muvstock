import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { cnpjMask } from "@/lib/utils/cnpjMask";

type TDadosCustomer = {
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
      nome: string;
      qual: string;
      pais_origem: string;
      nome_rep_legal: string;
      qual_rep_legal: string;
    }
  ];
};

export async function POST(req: NextRequest, resp: NextResponse) {
  const { cnpj } = await req.json();
  const xcnpj: string = cnpjMask(cnpj);
  try {
    if (cnpj) {
      const resultado = await prisma.customer.findFirst({
        where: {
          cnpj: xcnpj,
        },
      });
      if (!resultado) {
        const result: TDadosCustomer[] = await obterDados(cnpj);
        return NextResponse.json({ result }, { status: 200 });
      } else {
        return NextResponse.json({ message: `O cnpj: ${resultado.cnpj} já está cadastrado` }, { status: 201 });
      }
    } else {
      NextResponse.json({ message: "Não foi enviado nenhum cnpj!" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Erro no Servidor" }, { status: 500 });
  }
}

const obterDados = async (cnpjValue: string) => {
  try {
    const response = await fetch(
      `https://www.receitaws.com.br/v1/cnpj/${cnpjValue}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
    );
    const json: TDadosCustomer = await response.json();
    const dados: TDadosCustomer = await prisma.customer.create({
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
    }).then((res) => {
      return res;
    }).catch((error) => {
      return error;
    });
    return dados;
  } catch (error) {
    console.log("Ocorreu o erro: ", error);
    return error;
  }
};
//excluir cnpj da base

export async function DELETE(req: NextRequest, resp: NextResponse) {
  const { id } = await req.json();
  try {
    if (id) {
      const resultado = await prisma.base.delete({
        where: {
          id,
        },
      });
      if (resultado) {
        return NextResponse.json({ message: `O cnpj: ${resultado.cnpj} foi excluído` }, { status: 200 });
      }
    } else {
      NextResponse.json({ message: "Não foi enviado nenhum cnpj!" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Erro no Servidor" }, { status: 500 });
  }
  return NextResponse.json({ message: "OK--Deletou" }, { status: 200 });
}
