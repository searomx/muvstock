import { useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  MRT_ColumnFiltersState,
  MRT_SortingState,
  MRT_PaginationState,
} from 'material-react-table';
import { Box, Typography } from '@mui/material';
import { Customer } from '@prisma/client';
import ColunasCliente from './ColunasCliente';
import { MRT_Localization_PT_BR } from 'material-react-table/locales/pt-BR';


interface ClientesTableProps {
  data: Customer[];
  onDetalhesCliente?: (cliente: Customer) => void;
}

const ClientesTable = (props: ClientesTableProps) => {
  const { data } = props as { data: Customer[] };
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  //table state
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useMemo<MRT_ColumnDef<Customer>[]>(
    () => ColunasCliente,
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    onPaginationChange: setPagination,
    state: { pagination },
    paginationDisplayMode: 'pages',
    enableExpandAll: false, //disable expand all button
    muiDetailPanelProps: () => ({
      sx: (theme) => ({
        backgroundColor:
          theme.palette.mode === 'dark'
            ? 'rgba(255,210,244,0.1)'
            : 'rgba(0,0,0,0.1)',
      }),
    }),
    //custom expand button rotation
    muiExpandButtonProps: ({ row, table }) => ({
      onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }), //only 1 detail panel open at a time
      sx: {
        transform: row.getIsExpanded() ? 'rotate(180deg)' : 'rotate(-90deg)',
        transition: 'transform 0.2s',
      },
    }),
    //conditionally render detail panel
    renderDetailPanel: ({ row }) =>
      row.original.nome ? (
        <Box
          sx={{
            display: 'grid',
            margin: 'auto',
            gridTemplateColumns: '1fr 1fr',
            width: '100%',
          }}
        >
          <Typography>Cliente: {row.original.nome}</Typography>
          <Typography>Cnpj: {row.original.cnpj}</Typography>
          <Typography>Cidade: {row.original.municipio}</Typography>
          <Typography>Estado: {row.original.uf}</Typography>
        </Box>
      ) : null,
    initialState: {
      showColumnFilters: true, showGlobalFilter: true, columnVisibility: {
        id: false,
        tipo: false,
        porte: false,
        natureza_juridica: false,
        atividade_principal: false,
        atividade_secundaria: false,
        qsa: false,
        abertura: false,
        logradouro: false,
        numero: false,
        bairro: false,
        complemento: false,
        cep: false,
        telefone: false,
        email: false,
        data_situacao: false,
        ultima_atualizacao: false,
        status: false,
        fantasia: false,
        capital_social: false,
      },
    },
    filterFns: {
      customFilterFn: (row, id, filterValue) => {
        return row.getValue(id) === filterValue;
      },
    },

    localization: {
      ...MRT_Localization_PT_BR,
      filterCustomFilterFn: 'Custom Filter Fn',
    } as any,
    muiPaginationProps: {
      color: 'primary',
      shape: 'rounded',
      showRowsPerPage: false,
      variant: 'outlined',
    },

  });

  return <MaterialReactTable table={table} />;
};

export default ClientesTable;
