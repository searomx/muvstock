import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { cnpjMask } from "@/lib/utils/cnpjMask";
import { getToken } from "@/lib/services";

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
    },
  ];
  atv_principal: string;
  atividades_secundarias: [
    {
      text: string;
      code: string;
    },
  ];
  qsa: [
    {
      nome: string;
      qual: string;
      pais_origem: string;
      nome_rep_legal: string;
      qual_rep_legal: string;
    },
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
        select: {
          id: true,
          cnpj: true,
        },
      });
      console.log("RESULTADO: ", resultado);
      if (!resultado) {
        const result: TDadosCustomer[] = await obterDados(cnpj);
        return NextResponse.json({ result }, { status: 200 });
      } else {
        return NextResponse.json(
          { message: `O cnpj: ${resultado.cnpj} já está cadastrado` },
          { status: 402 },
        );
      }
    } else {
      NextResponse.json(
        { message: "Não foi enviado nenhum cnpj!" },
        { status: 404 },
      );
    }
  } catch (error) {
    return NextResponse.json({ message: "Erro no Servidor" }, { status: 500 });
  }
}

const obterDados = async (cnpjValue: string) => {
  const receitaws_token = await getToken();
  try {
    const response = await fetch(
      `https://www.receitaws.com.br/v1/cnpj/${cnpjValue}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          // 'Authorization': 'Bearer ' + receitaws_token,
        },
      },
    );
    const json: TDadosCustomer = await response.json();
    const dados: TDadosCustomer = await prisma.customer
      .create({
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
          atv_principal: json.atividade_principal[0].code,
          atividades_secundarias: json.atividades_secundarias,
          qsa: json.qsa,
        },
      })
      .then((res) => {
        removeCnpj(cnpjValue);
        return res;
      })
      .catch((error) => {
        return error;
      });
    return dados;
  } catch (error) {
    console.log("Ocorreu o erro: ", error);
    return error;
  }
};
//excluir cnpj da base

const removeCnpj = async (cnpj: string) => {
  const getcnpj = await prisma.base.findFirst({
    where: {
      cnpj: cnpj,
    },
    select: {
      id: true,
      cnpj: true,
    },
  });
  try {
    if (getcnpj) {
      const resultado = await prisma.base.delete({
        where: {
          id: getcnpj.id, // Replace with the actual id value
        },
      });
      if (resultado) {
        console.log("CNPJ-REMOVIDO-ROUTE-DB-REMOVE: ", resultado.id);
        return NextResponse.json(
          { message: `O cnpj: ${resultado.cnpj} foi excluído` },
          { status: 200 },
        );
      }
    } else {
      NextResponse.json(
        { message: "Não foi enviado nenhum cnpj!" },
        { status: 404 },
      );
    }
  } catch (error) {
    return NextResponse.json({ message: "Erro no Servidor" }, { status: 500 });
  }
};
