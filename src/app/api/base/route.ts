import { findCnpjAll } from "@/lib/services";
type TCnpj = {
  id: string;
  cnpj: string;
}

export const GET = async (req: Request) => {
  try {
    const dados: TCnpj[] = await findCnpjAll();
    if (dados.length > 0) {
      console.log("Dados Routes: ", dados);
      return Response.json({ dados }, { status: 200 });
    } else {
      return Response.json({ dados: "Nenhum dado encontrado!" }, { status: 400 });

    }
  } catch (error) {
    return Response.json({ error: "Cnpj não encontrado!" }, { status: 400 });
  }

}
