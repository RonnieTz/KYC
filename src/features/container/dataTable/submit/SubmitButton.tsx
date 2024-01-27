import { Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { setGridDataColumns, setGridData } from '../../../../redux/appSlice';
import { nanoid } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import axios from 'axios';

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

  const postData = async () => {
    const data = {
      from: !fullLoading
        ? dayjs(new Date(time.start)).format('YYYY-MM-DD HH:mm:ss')
        : null,
      to: !fullLoading
        ? dayjs(new Date(time.end)).format('YYYY-MM-DD HH:mm:ss')
        : null,
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
    const columns = tableData
      .map((table) =>
        table.columns
          .filter((column) => column.checked)
          .map((column) => column.column)
      )
      .flat();
    dispatch(setGridDataColumns(columns));
    console.log(data);

    try {
      const res = await axios.post(
        // 'http://192.168.1.119:8080/tables',
        'http://localhost:8080/tables',
        data
      );
      dispatch(
        setGridData(res.data.map((item: any) => ({ ...item, id: nanoid() })))
      );
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
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
