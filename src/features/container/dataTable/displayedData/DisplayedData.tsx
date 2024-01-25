import './displayedData.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-enterprise';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { useEffect, useState } from 'react';
import { FormControlLabel, Checkbox, Button, Box } from '@mui/material';
import {
  checkGridDataColumn,
  removeGridColumns,
} from '../../../../redux/appSlice';

const DisplayedData = () => {
  const { gridData } = useSelector((state: RootState) => state.app);
  const [colDefs, setColDefs] = useState<ColDef[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    setColDefs(
      gridData.columns.map((column) => ({
        field: column,
        cellRenderer: (e: any) => {
          if (column === 'avatar') {
            return <img height={35} src={e.value} />;
          }
          return e.value;
        },

        headerComponent: (p: any) => {
          return (
            <FormControlLabel
              control={
                <Checkbox
                  checked={gridData.checkedColumns.includes(p.displayName)}
                  onChange={() => {
                    if (gridData.checkedColumns.includes(p.displayName)) {
                      dispatch(
                        checkGridDataColumn(
                          gridData.checkedColumns.filter(
                            (column) => column !== p.displayName
                          )
                        )
                      );
                    } else {
                      dispatch(
                        checkGridDataColumn([
                          ...gridData.checkedColumns,
                          p.displayName,
                        ])
                      );
                    }
                  }}
                />
              }
              label={p.displayName}
            />
          );
        },
      }))
    );
  }, [gridData]);

  return (
    <div className="grid_container ag-theme-alpine">
      {gridData.columns.length > 0 && (
        <Button
          disabled={gridData.checkedColumns.length === 0}
          variant="text"
          color="error"
          onClick={() => {
            dispatch(
              removeGridColumns({
                checkedColumns: gridData.checkedColumns,
                columns: gridData.columns,
              })
            );
          }}
        >
          Remove Selected Columns
        </Button>
      )}

      <Box height={'95%'}>
        <AgGridReact
          rowSelection="multiple"
          columnDefs={colDefs}
          rowData={gridData.data || []}
          getRowId={(data) => data.data.id}
        />
      </Box>
    </div>
  );
};
export default DisplayedData;
