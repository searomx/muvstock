import { useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  MRT_PaginationState,
} from 'material-react-table';
import { Base } from '@prisma/client';
import { MRT_Localization_PT_BR } from 'material-react-table/locales/pt-BR';

type TBaseCnpj = {
  id?: string;
  cnpj?: string;
};
interface TableCnpjBaseProps {
  data: Array<TBaseCnpj>;
}

export default function TableCnpjBase(props: Readonly<TableCnpjBaseProps>) {
  const { data } = props as { data: TBaseCnpj };
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });


  const columns = useMemo<MRT_ColumnDef<TBaseCnpj>[]>(
    () => [{
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'cnpj',
      header: 'Cnpj',
    }],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: data as TBaseCnpj[],
    muiTableHeadCellProps: {
      //easier way to create media queries, no useMediaQuery hook needed.
      sx: {
        fontSize: {
          xs: '10px',
          sm: '11px',
          md: '12px',
          lg: '13px',
          xl: '14px',
        },
      },
    },

    muiTableBodyProps: {
      sx: {
        '& td:nth-of-type(odd)': {
          backgroundColor: '#f5f5f5',
        },
      },
    },
    muiTableBodyCellProps: {
      sx: {
        borderRight: '2px solid #e0e0e0', //add a border between columns
      },
    },
    getRowId: (row) => row.id,
    enableColumnFilterModes: true, //turn off client-side filtering
    onGlobalFilterChange: setGlobalFilter, //hoist internal global state to your state
    autoResetPageIndex: false,
    onPaginationChange: setPagination,
    state: { pagination, globalFilter },
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

    initialState: {
      showColumnFilters: true, density: 'compact', showGlobalFilter: true,
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
      showRowsPerPage: true,
      variant: 'outlined',
    },
  });

  return <MaterialReactTable table={table} />;
};
