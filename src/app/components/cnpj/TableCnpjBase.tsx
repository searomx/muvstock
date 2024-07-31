import { useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  MRT_PaginationState,
} from 'material-react-table';
import { Box, Card, Chip, Stack } from '@mui/material';
import { MRT_Localization_PT_BR } from 'material-react-table/locales/pt-BR';


type TBaseCnpj = {
  id?: string;
  cnpj?: string;
};
interface TableCnpjBaseProps {
  data: Array<TBaseCnpj>;
}

export default function ClientesTable(props: Readonly<TableCnpjBaseProps>) {
  const { data } = props as { data: TBaseCnpj };
  const [globalFilter, setGlobalFilter] = useState('');
  const numCnpj: number = props.data.length;

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
    positionToolbarAlertBanner: 'top',
    muiCircularProgressProps: {
      color: 'secondary',
      thickness: 5,
      size: 55,
    },
    muiSkeletonProps: {},
    editDisplayMode: 'modal',
    createDisplayMode: 'modal',
    enableRowSelection: false,
    muiTableHeadCellProps: {
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
        '& tr:nth-of-type(odd)': {
          backgroundColor: '#f5f5f5',
        },
      },
    },
    getRowId: (row) => row.id,
    enableColumnFilterModes: true, //turn off client-side filtering
    //hoist internal global state to your state
    autoResetPageIndex: false,
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Card>
          <Stack direction="row" alignItems="center" spacing={3} p={2} useFlexGap>
            <Stack direction="row" spacing={1} useFlexGap>
              <Chip
                size="small"
                label={`Total de Cnpjs: ${numCnpj}`}
                color="primary"
              />
            </Stack>
          </Stack>
        </Card>
      </Box>
    ),
    onPaginationChange: setPagination,
    state: { isLoading: false, pagination, globalFilter },
    paginationDisplayMode: 'pages', //disable expand all button
    muiDetailPanelProps: () => ({
      sx: (theme) => ({
        backgroundColor:
          theme.palette.mode === 'dark'
            ? 'rgba(255,210,244,0.1)'
            : 'rgba(0,0,0,0.1)',
      }),
    }),
    //custom expand button rotation

    initialState: {
      showColumnFilters: true, density: 'compact', showGlobalFilter: false,
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
