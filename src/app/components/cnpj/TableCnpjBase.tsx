import { useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';

import { Base } from '@prisma/client';
import { MRT_Localization_PT_BR } from 'material-react-table/locales/pt-BR';

interface TableCnpjBaseProps {
  data: any[] | null;
}

const TableCnpjBase = (props: TableCnpjBaseProps) => {
  const { data } = props as { data: any | null };
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});
  const columns = useMemo<MRT_ColumnDef<Base>[]>(
    () => [
      {
        accessorKey: 'id', //normal, all filter modes are enabled
        header: 'ID',
      },
      {
        accessorKey: 'cnpj',
        enableColumnFilterModes: false, //disable changing filter mode for this column
        filterFn: 'startsWith', //even though changing the mode is disabled, you can still set the default filter mode
        header: 'Cnpj',
      },

    ],
    [],
  );
  const table = useMaterialReactTable({
    columns,
    data,
    getRowId: (row) => row.id,
    enableColumnFilterModes: true, //enable changing filter mode for all columns unless explicitly disabled in a column def
    initialState: { showColumnFilters: true, density: 'compact' }, //show filters by default
    filterFns: {
      customFilterFn: (row, id, filterValue) => {
        return row.getValue(id) === filterValue;
      },
    },

    localization: {
      ...MRT_Localization_PT_BR,
      filterCustomFilterFn: 'Custom Filter Fn',
    } as any,

  });

  return <MaterialReactTable table={table} />;
};

export default TableCnpjBase;
