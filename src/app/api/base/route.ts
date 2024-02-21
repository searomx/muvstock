import { findCnpjAll } from "@/lib/services";
type TCnpj = {
  id: string | null;
  cnpj: string | null;
}

export const GET = async (req: Request) => {
  try {
    const dados: TCnpj[] = await findCnpjAll();
    if (dados !== null) {
      return Response.json({ dados }, { status: 200 });
    } else {
      return Response.json({ dados }, { status: 400 });

    }
  } catch (error) {
    return Response.json({ error: "Cnpj não encontrado!" }, { status: 400 });
  }

}
