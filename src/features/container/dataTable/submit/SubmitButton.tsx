import { Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { API } from '../../../../utilities/API';
import {
  setGridData,
  setGridDataColumns,
  unCheckAllTables,
} from '../../../../redux/appSlice';

const SubmitButton = () => {
  const dispatch = useDispatch();
  const { tableData, time, fullLoading } = useSelector(
    (state: RootState) => state.app
  );

  const selectedColumns: string[] = [];
  tableData.forEach((table) => {
    table.columns.forEach((column) => {
      if (column.checked) {
        selectedColumns.push(column.column);
      }
    });
  });

  const handleLoad = async () => {
    const response = await API.get('users?size=50');
    dispatch(setGridData(response.data));
    dispatch(unCheckAllTables());
    dispatch(setGridDataColumns(selectedColumns));
  };

  const postData = () => {
    const data = {
      from: time.start,
      to: time.end,
      tables: tableData
        .filter((table) => table.columns.some((column) => column.checked))
        .map((table) => ({
          name: table.name,
          columns: table.columns
            .filter((column) => column.checked)
            .map((column) => column.column),
        })),
      idFullLoadRequired: fullLoading,
    };
    console.log(data);
  };

  return (
    <Button
      disabled={tableData.every((table) =>
        table.columns.every((column) => !column.checked)
      )}
      sx={{ paddingTop: 1, borderRadius: 0 }}
      variant="contained"
      onClick={postData}
    >
      LOAD
    </Button>
  );
};
export default SubmitButton;
