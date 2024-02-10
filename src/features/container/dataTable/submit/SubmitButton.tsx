import { Alert, Button, Snackbar } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../redux/store';
import {
  setGridDataColumns,
  setGridData,
  setGridDataLoading,
  setGridDataNotification,
} from '../../../../redux/appSlice';
import { nanoid } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import axios from 'axios';

const SubmitButton = () => {
  const dispatch = useDispatch();
  const { tableData, time, fullLoading, gridData } = useSelector(
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
      dispatch(setGridDataLoading(true));
      const res = await axios.post(
        // 'http://192.168.1.119:8080/tables',
        'http://localhost:8080/tables',
        data
      );
      dispatch(
        setGridData(res.data.map((item: any) => ({ ...item, id: nanoid() })))
      );
      dispatch(
        setGridDataNotification({
          show: true,
          message: 'Data loaded successfully',
          type: 'success',
        })
      );
      console.log(res.data);
    } catch (e: any) {
      console.log(e);
      dispatch(
        setGridDataNotification({
          show: true,
          message: 'Error: ' + e.message,
          type: 'error',
        })
      );
    } finally {
      dispatch(setGridDataLoading(false));
    }
  };

  const handleClose = () => {
    dispatch(
      setGridDataNotification({ ...gridData.notification, show: false })
    );
  };

  return (
    <>
      <Button
        disabled={
          tableData.every((table) =>
            table.columns.every((column) => !column.checked)
          ) || gridData.loading
        }
        sx={{ paddingTop: 1, borderRadius: 0 }}
        variant="contained"
        onClick={postData}
      >
        {gridData.loading ? 'LOADING...' : 'LOAD'}
      </Button>
      <Snackbar
        open={gridData.notification.show}
        autoHideDuration={
          gridData.notification.type === 'success' ? 2000 : 5000
        }
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={
            gridData.notification.type === 'success' ? 'success' : 'error'
          }
          variant="filled"
          sx={{ width: '100%' }}
        >
          {gridData.notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};
export default SubmitButton;
