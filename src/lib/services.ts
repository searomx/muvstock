import prisma from "@/lib/db";

const customer = prisma?.customer.fields;
let token = [];

/*Script para tratar o cnpj*/

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
  console.log("id-serviço: ", id);
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

export const deleteCnpjById = (id: string) => {
  try {
    const dados = prisma.base.findUnique({
      where: {
        id,
      },
    });
    return dados.then((res) => {
      if (res) {
        return prisma.base.delete({
          where: {
            id,
          },
        });
      }
      return res;
    });
  } catch (error) {
    console.log(error);
  }
};
