import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { api } from "@/lib/api";

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

export async function POST(req: NextRequest, resp: NextResponse) {
  //const controller = new AbortController();
  const { cnpj } = await req.json();
  try {
    console.log("cnpj-router: ", cnpj);
    if (cnpj) {
      const res = await prisma.customer.findFirst({
        where: {
          cnpj: cnpj,
        },
      });
      obterDados(cnpj);
    } else {
      return NextResponse.json({ message: "CNPJ Já está cadastrado!" }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Erro no Servidor" }, { status: 500 });
  }
}

const obterDados = async (cnpj: string) => {
  const controller = new AbortController();
  const signal = controller.signal;
  console.log("cnpj-obter: ", cnpj);
  try {
    const resultado = await api.get(`https://www.receitaws.com.br/v1/cnpj/${cnpj}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal,
    });
    const json: Idados = await resultado.data;
    console.log("json: ", json);
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
    return NextResponse.json({ message: "dados do Cliente:", dados }, { status: 200 });
  } catch (error) {
    console.log("Ocorreu o erro: ", error);
    controller.abort();
  }
};