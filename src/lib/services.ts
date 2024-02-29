import prisma from "@/lib/db";
import { NextResponse } from "next/server";

const customer = prisma?.customer.fields;
let token = [];

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
  return prisma.unique
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
  return prisma.customer
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
export async function deleteCnpj(id: string) {
  // const db = await connect();
  // try {
  //   return db.collection("baseCnpj").deleteOne({ _id: id });
  // } catch (e) {
  //   console.log(e);
  // }
}

export const getAllClientes = () => {
  return prisma.customer.findMany({
    orderBy: {
      nome: "asc",
    },
  });
};

export const getToken = () => {
  return prisma.customer.findMany({
    orderBy: {
      nome: "asc",
    },
    select: {
      id: true,
      nome: true,
    },
  });
};

export const getByCnpj = (cnpj: string) => {
  try {
    const dados = prisma.customer.findFirst({
      where: {
        cnpj,
      },
    });
    return dados.then((res) => {
      return res;
    });
  } catch (error) {
    console.log(error);
  }
};

export const getById = (id: string) => {
  try {
    const dados = prisma.customer.findUnique({
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
    return dados.then((res) => {
      return res;
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateById = (id: string) => {
  try {
    const dados = prisma.customer.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        nome: true,
      },
    });
    return dados.then((res) => {
      return res;
    });
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

/*const post = await prisma.post.delete({
    where: { id },
  })
  res.json(post)*/
