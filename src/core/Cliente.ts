export default class Cliente {
    public id?: string;
    public nome?: string;
    public cnpj?: string;
    public municipio?: string;
    public uf?: string;

    constructor(nome: string, cnpj: string, municipio: string, uf: string, id: string = null) {
        this.id = id;
        this.nome = nome;
        this.cnpj = cnpj;
        this.municipio = municipio;
        this.uf = uf;
    }
    static vazio(): Cliente {
        return new Cliente("", "", "", "");
    }
    getId(): string {
        return this.id;
    }

    getNome(): string {
        return this.nome;
    }

    getCnpj(): string {
        return this.cnpj;
    }

    getMunicipio(): string {
        return this.municipio;
    }

    getUf(): string {
        return this.uf;
    }

    toString(): string {
        return `Cliente: ${this.id} -${this.nome} - CNPJ: ${this.cnpj} - Município: ${this.municipio} - UF: ${this.uf}`;
    }

}