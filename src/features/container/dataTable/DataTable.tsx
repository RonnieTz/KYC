import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Alert,
  Checkbox,
  CircularProgress,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Snackbar,
} from '@mui/material';
import styles from './dataTable.module.css';
import { Fragment, useEffect, useState } from 'react';
import BasicDatePicker from './datePicker/DatePicker';
import SubmitButton from './submit/SubmitButton';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import {
  setTableData,
  setCollapse,
  checkColumn,
  checkTable,
} from '../../../redux/appSlice';
import axios from 'axios';
const {} = styles;

const DataTable = () => {
  const [open, setOpen] = useState({
    open: false,
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { tableData } = useSelector((state: RootState) => state.app);

  useEffect(() => {
    type ResType = {
      data: { name: string; columns: string[] }[];
    };
    const fetchData = async () => {
      try {
        setLoading(true);
        const res: ResType = await axios.get('http://localhost:8080/tables');
        dispatch(
          setTableData(
            res.data.map((table) => ({
              ...table,
              collapse: false,
              columns: table.columns.map((column) => ({
                column,
                checked: false,
              })),
            }))
          )
        );
      } catch (error: any) {
        console.log(error.message);
        setOpen({ open: true, message: error.message });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleClose = () => {
    setOpen({ open: false, message: '' });
  };

  return (
    <div className={styles.data_table}>
      <List
        sx={{
          width: '100%',
          maxWidth: 360,
          bgcolor: 'background.paper',
          overflowY: 'scroll',
          flexGrow: 1,
        }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            List Items
          </ListSubheader>
        }
      >
        {loading && (
          <CircularProgress sx={{ margin: '50% 0 0 50%', translate: '-50%' }} />
        )}
        {tableData.map((table, index) => (
          <Fragment key={table.name}>
            <ListItem>
              <Checkbox
                indeterminate={
                  table.columns.some((column) => column.checked) &&
                  !table.columns.every((column) => column.checked)
                }
                onChange={(e) => {
                  dispatch(checkTable({ index, checked: e.target.checked }));
                }}
                checked={table.columns.every((column) => column.checked)}
              />
              <ListItemText primary={table.name} />
              {table.collapse ? (
                <ExpandLess
                  sx={{ cursor: 'pointer' }}
                  onClick={() => dispatch(setCollapse(index))}
                />
              ) : (
                <ExpandMore
                  sx={{ cursor: 'pointer' }}
                  onClick={() => dispatch(setCollapse(index))}
                />
              )}
            </ListItem>
            <Collapse in={table.collapse} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {table.columns.map((column, columnIndex) => (
                  <ListItem key={column.column} sx={{ paddingLeft: 4 }}>
                    <Checkbox
                      checked={column.checked}
                      onChange={(e) => {
                        dispatch(
                          checkColumn({
                            index,
                            columnIndex,
                            checked: e.target.checked,
                          })
                        );
                      }}
                    />
                    <ListItemText primary={column.column} />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </Fragment>
        ))}
      </List>

      <BasicDatePicker />
      <SubmitButton />
      <Snackbar open={open.open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {open.message}
        </Alert>
      </Snackbar>
    </div>
  );
};
export default DataTable;
