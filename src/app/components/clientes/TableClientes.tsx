import { useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from 'material-react-table';

import {
  MenuItem,
} from '@mui/material';
import { Customer } from '@prisma/client';
import { MRT_Localization_PT_BR } from 'material-react-table/locales/pt-BR';
import ColunasCliente from './ColunasCliente';

interface TableClientesProps {
  data: Customer[];
  onDetalhesCliente?: (cliente: Customer) => void;
}

const TableClientes = (props: TableClientesProps) => {
  const { data } = props as { data: Customer[] };
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!data.length) {
  //       setIsLoading(true);
  //     } else {
  //       setIsRefetching(true);
  //     }
  //   };
  //   try {
  //     setRowCount(data.length);
  //   } catch (error) {
  //     setIsError(true);
  //     console.error(error);
  //     return;
  //   }
  //   setIsError(false);
  //   setIsLoading(false);
  //   setIsRefetching(false);

  //   fetchData();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [
  //   columnFilters, //re-fetch when column filters change
  //   globalFilter, //re-fetch when global filter changes
  //   pagination.pageIndex, //re-fetch when page index changes
  //   pagination.pageSize, //re-fetch when page size changes
  //   sorting, //re-fetch when sorting changes
  // ]);


  const columns = useMemo<MRT_ColumnDef<Customer>[]>(
    () => ColunasCliente,
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    getRowId: (row) => row.id,
    enableColumnFilterModes: true,
    initialState: {
      showColumnFilters: true, showGlobalFilter: true, columnVisibility: {
        id: false,
        situacao: false,
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
    onPaginationChange: setPagination,//hoist pagination state to your state when it changes internally
    state: { pagination },
    paginationDisplayMode: 'pages',
    enableRowActions: true,
    enableHiding: false,
  });
  return <MaterialReactTable table={table} />;
};
export default TableClientes;
