export default class CnpjBase {
    public id: string;
    public cnpj: string;

    constructor(cnpj: string, id: string = null) {
        this.id = id;
        this.cnpj = cnpj;
    }
    static vazio(): CnpjBase {
        return new CnpjBase("");
    }
    getId(): string {
        return this.id;
    }
    getCnpj(): string {
        return this.cnpj;
    }
    toString(): string {
        return `CnpjBase: ${this.id} -${this.cnpj}`;
    }
}