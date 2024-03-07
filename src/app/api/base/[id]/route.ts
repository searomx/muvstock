import { findCnpjByIdBase } from "@/lib/services";

type TBase = {
  id?: string;
  cnpj?: string;
}
type TBasex = {
  id?: string;
  cnpj?: string;
}

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  try {
    if (id) {
      const dados = await findCnpjByIdBase(id);
      return Response.json({ dados }, { status: 200 });
    }
  } catch (error) {
    return Response.json({ error: "Cliente não encontrado!" }, { status: 400 });
  }
}
