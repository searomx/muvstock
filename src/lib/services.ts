import prisma from "@/lib/db";
import { NextResponse } from "next/server";

const customer = prisma?.customer.fields;

/*Script para tratar o cnpj*/

export const criarBaseCnpj = async (cnpj: string) => {
  const res = await prisma.base.create({
    data: {
      cnpj: cnpj,
    },
  }).then((res) => {
    return NextResponse.json({ res }, { status: 201 });
  }).catch((err) => {
    console.log(err);
    return NextResponse.json({ err }, { status: 500 });
  });
}

export const getToken = async () => {
  const res = await prisma.token.findFirst({
    select: {
      token: true,
    },
  });
  return res;
}

export const findCnpjAll = async () => {
  const res = await prisma.base.findMany({
    select: {
      id: true,
      cnpj: true,
    },
  });
  return res;
}

export const findClienteBase = async () => {
  return await prisma.unique
    .findMany({
      orderBy: {
        cnpj: "asc",
      },
      select: {
        id: true,
        cnpj: true,
      },
    })
    .then((res) => {
      return res;
    });
};
export const findCnpjByIdBase = async (id: string) => {
  return await prisma.base
    .findUnique({
      where: {
        id: id,
      },
    })
    .then((res) => {
      return res;
    });
};

export const findCliente = async () => {
  return await prisma.customer
    .findMany({
      orderBy: {
        nome: "asc",
      },
      select: {
        id: true,
        nome: true,
        cnpj: true,
        municipio: true,
        uf: true,
      },
    })
    .then((res) => {
      return res;
    });
};

export const getAllClientes = () => {
  return prisma.customer.findMany({
    where: {
      situacao: "ATIVA",
    },
    orderBy: {
      nome: "asc",
    },
  });
};

export const getByCnpj = async (cnpj: string) => {
  try {
    const dados = await prisma.customer.findFirst({
      where: {
        cnpj,
      },
    });
    return dados;
  } catch (error) {
    console.log(error);
  }
};

export const postToken = async (token: string) => {
  try {
    const dados = await prisma.token.create({
      data: {
        token,
      },
    });
    return dados;
  } catch (error) {
    console.log(error);
  }
}

export const getById = async (id: string) => {
  try {
    const dados = await prisma.customer.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        nome: true,
        cnpj: true,
        municipio: true,
        uf: true,
      },
    });
    return dados;
  } catch (error) {
    console.log(error);
  }
};

export const updateById = async (id: string) => {
  try {
    const dados = await prisma.customer.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        nome: true,
      },
    });
    return dados;
  } catch (error) {
    console.log(error);
  }
};

export const deleteCnpjById = async (id: string) => {
  try {
    const dados = await prisma.base.findUnique({
      where: {
        id,
      },
    }).then(async (res) => {
      return await prisma.base.delete({
        where: { id },
      });
    });
    return dados;
  } catch (error) {
    console.log(error);
  }
};
