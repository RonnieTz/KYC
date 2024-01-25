import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  time: { start: number; end: number };
  fullLoading: boolean;
  selectedTables: string[];
  gridData: { columns: string[]; data: {}[]; checkedColumns: string[] };
  tableData: {
    collapse: boolean;
    columns: {
      column: string;
      checked: boolean;
    }[];
    name: string;
  }[];
} = {
  fullLoading: false,
  tableData: [],
  selectedTables: [],
  gridData: { columns: [], data: [], checkedColumns: [] },
  time: {
    start: new Date('2020-01-01 00:00').getTime(),
    end: new Date().getTime(),
  },
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setFullLoading: (state, action) => {
      state.fullLoading = action.payload;
    },

    setTableData: (state, action) => {
      state.tableData = action.payload;
    },
    setCollapse: (state, action) => {
      console.log(action.payload);
      state.tableData[action.payload].collapse =
        !state.tableData[action.payload].collapse;
    },

    checkColumn: (state, action) => {
      const {
        index,
        columnIndex,
        checked,
      }: { index: number; columnIndex: number; checked: boolean } =
        action.payload;

      state.tableData[index].columns[columnIndex].checked = checked;
    },

    checkTable: (state, action) => {
      const { index, checked }: { index: number; checked: boolean } =
        action.payload;

      state.tableData[index].columns.forEach((column) => {
        column.checked = checked;
      });
    },
    unCheckAllTables: (state) => {
      state.tableData.forEach((table) => {
        table.columns.forEach((column) => {
          column.checked = false;
        });
      });
    },
    setSelectedTables: (state, action) => {
      state.selectedTables = action.payload;
    },
    setGridData: (state, action) => {
      state.gridData.data = action.payload;
    },
    setGridDataColumns: (state, action) => {
      state.gridData.columns = action.payload;
    },
    checkGridDataColumn: (state, action) => {
      state.gridData.checkedColumns = action.payload;
    },
    removeGridColumns: (state, action) => {
      const {
        columns,
        checkedColumns,
      }: { columns: string[]; checkedColumns: string[] } = action.payload;
      const newColumns = columns.map((column) => column.toLowerCase());
      checkedColumns.forEach((column) => {
        const index = newColumns.indexOf(column.toLowerCase());
        if (index !== -1) {
          newColumns.splice(index, 1);
        }
      });
      state.gridData.columns = newColumns;
      state.gridData.checkedColumns = [];
    },
    setTimeStart: (state, action) => {
      state.time.start = action.payload;
    },
    setTimeEnd: (state, action) => {
      state.time.end = action.payload;
    },
  },
  extraReducers: (_builder) => {},
});

export const {
  setFullLoading,
  setTableData,
  setCollapse,
  checkColumn,
  checkTable,
  setSelectedTables,
  setGridData,
  setGridDataColumns,
  checkGridDataColumn,
  removeGridColumns,
  unCheckAllTables,
  setTimeStart,
  setTimeEnd,
} = appSlice.actions;
export default appSlice.reducer;
