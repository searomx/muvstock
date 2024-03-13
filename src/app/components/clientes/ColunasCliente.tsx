const ColunasCliente = [
  {
    accessorKey: 'id',
    size: 50,
    header: 'Código',
    enableHiding: false,

  },
  {
    accessorKey: 'situacao',
    size: 10,
    header: 'Situação',
  },
  {
    accessorKey: 'tipo',
    size: 50,
    header: 'tipo',
  },
  {
    accessorKey: 'nome',
    header: 'Nome',
    filterFn: 'startsWith',
    minSize: 100,
    maxSize: 200,
    size: 180,
  },

  {
    accessorKey: 'cnpj',
    filterFn: 'startsWith',
    header: 'CNPJ',
    minSize: 50,
    maxSize: 100,
    size: 80,
  },
  {
    accessorKey: 'atv_principal',
    filterFn: 'startsWith',
    size: 50,
    header: 'Atividade Principal',
  },
  {
    accessorKey: 'porte',
    size: 50,
    header: 'Porte',
  },
  {
    accessorKey: 'natureza_juridica',
    size: 80,
    header: 'Natureza',
  },
  {
    accessorKey: 'logradouro',
    size: 180,
    header: 'Logradouro',
  },
  {
    accessorKey: 'numero',
    size: 50,
    header: 'Número',
  },
  {
    accessorKey: 'complemento',
    size: 180,
    header: 'Complemento',
  },
  {
    accessorKey: 'bairro',
    size: 180,
    header: 'Bairro',
  },
  {
    accessorKey: 'municipio',
    filterFn: 'startsWith',
    header: 'Municipio',
  },
  {
    accessorKey: 'uf',
    size: 50,
    filterFn: 'equals',
    header: 'Estado',
  },
  {
    accessorKey: 'cep',
    size: 50,
    header: 'CEP',
  },
  {
    accessorKey: 'telefone',
    size: 50,
    header: 'Telefone',
  },
  {
    accessorKey: 'email',
    size: 50,
    header: 'E-mail',
  },
  {
    accessorKey: 'data_situacao',
    size: 50,
    header: 'Data Situação',
  },
  {
    accessorKey: 'ultima_atualizacao',
    size: 50,
    header: 'Última Atualização',
  },
  {
    accessorKey: 'status',
    size: 50,
    header: 'Status',
  },
  {
    accessorKey: 'fantasia',
    size: 50,
    header: 'Fantasia',
  },
  {
    accessorKey: 'capital_social',
    size: 50,
    header: 'Capital Social',
  },
];
export default ColunasCliente;

