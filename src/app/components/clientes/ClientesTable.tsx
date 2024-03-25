import { useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  MRT_PaginationState,
} from 'material-react-table';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { Box, Button, Typography } from '@mui/material';
import { Customer } from '@prisma/client';
import ColunasCliente from './ColunasCliente';
import { MRT_Localization_PT_BR } from 'material-react-table/locales/pt-BR';


interface ClientesTableProps {
  data: Customer[];
}
const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});

export default function ClientesTable(props: Readonly<ClientesTableProps>) {
  const { data } = props as { data: Customer[] };
  const [globalFilter, setGlobalFilter] = useState('');

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

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
    positionToolbarAlertBanner: 'top',
    muiCircularProgressProps: {
      color: 'secondary',
      thickness: 5,
      size: 55,
    },
    muiSkeletonProps: {}, // Declare and initialize muiSkeletonProps with an empty object
    editDisplayMode: 'modal',
    createDisplayMode: 'modal',
    enableRowSelection: true,
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
        '& tr:nth-of-type(odd)': {
          backgroundColor: '#f5f5f5',
        },
      },
    },
    getRowId: (row) => row.id,
    enableColumnFilterModes: true, //turn off client-side filtering
    onGlobalFilterChange: setGlobalFilter, //hoist internal global state to your state
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
        <Button
          onClick={handleExportData}
          startIcon={<FileDownloadIcon />}
        >
          Exportar todos
        </Button>
      </Box>
    ),
    onPaginationChange: setPagination,
    state: { isLoading: false, pagination, globalFilter },
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
      onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }),
      sx: {
        transform: row.getIsExpanded() ? 'rotate(180deg)' : 'rotate(-90deg)',
        transition: 'transform 0.2s',
      },
    }),

    renderDetailPanel: ({ row }) =>
      row.original.id ? (
        <div className='grid grid-cols-2 gap-1'>
          <Box
            sx={{
              display: 'grid',
              gridAutoColumns: '1fr',
              margin: 'auto',
              bgcolor: 'background.paper',
              gridTemplateColumns: '1fr',
              width: '100%',
              minHeight: '100%',
              boxShadow: 1,
              borderRadius: 2,
              p: 1,
            }}
          >
            <Typography>Cliente: {row.original.nome}</Typography>
            <Typography>Cnpj: {row.original.cnpj}</Typography>
            <Typography>Endereço: {row.original.logradouro} </Typography>
            <Typography>Número: {row.original.numero} </Typography>
            <Typography>Bairro: {row.original.bairro} </Typography>
            <Typography>Cep: {row.original.cep} </Typography>
            <Typography>Cidade: {row.original.municipio} </Typography>
            <Typography>Estado: {row.original.uf} </Typography>
            <Typography>Telefone: {row.original.telefone} </Typography>
            <Typography>Email: {row.original.email} </Typography>
          </Box>

          <div className='flex w-full h-full p-1'>
            <Box
              sx={{
                display: 'grid',
                gridAutoColumns: '1fr',
                margin: 'auto',
                bgcolor: 'background.paper',
                gridTemplateColumns: '1fr',
                width: '100%',
                minHeight: '100%',
                boxShadow: 1,
                borderRadius: 2,
                p: 1,
                scrollbarWidth: 'thin',
                overflowY: 'auto',
              }}
            >
              <Typography variant='subtitle1'>Atividade Principal: {row.original.atividade_principal[0].code + " - " + row.original.atividade_principal[0].text}</Typography>
              <Typography variant='subtitle1'>Atividades Secundárias:</Typography>
              {row.original.atividades_secundarias.map((ats, i) => (
                <Typography key={+i} className={`px-1 ${i % 2 === 0 ?
                  'bg-gray-200' : 'bg-gray-400'}`}>
                  {ats.code} - {ats.text}
                </Typography>
              ))
              }
            </Box>
          </div>
        </div>
      ) : null,
    initialState: {
      showColumnFilters: true, density: 'compact', showGlobalFilter: true, columnVisibility: {
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
      showRowsPerPage: true,
      variant: 'outlined',
    },
  });


  return <MaterialReactTable table={table} />;
};
