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
  Tooltip,
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
  const [notification, setNotification] = useState({
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
        const res: ResType = await axios.get(
          // 'http://192.168.1.119:8080/tables'
          'http://localhost:8080/tables'
        );
        if (!res.data.length) throw new Error('Server connection error');
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
        setNotification({ open: true, message: error.message });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleClose = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <div className={styles.data_table}>
      <List
        sx={{
          width: '100%',
          maxWidth: 360,
          bgcolor: 'background.paper',
          overflowY: 'auto',
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
            <ListItem sx={{ borderTop: '2px solid black' }}>
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
              <Checkbox
                disableRipple
                indeterminate={
                  table.columns.some((column) => column.checked) &&
                  !table.columns.every((column) => column.checked)
                }
                onChange={(e) => {
                  dispatch(checkTable({ index, checked: e.target.checked }));
                }}
                checked={table.columns.every((column) => column.checked)}
              />
              <Tooltip
                placement="top-start"
                title={table.name.length > 13 ? table.name : null}
                arrow
              >
                <ListItemText
                  primary={
                    table.name.length > 13
                      ? table.name.slice(0, 10) + '...'
                      : table.name
                  }
                />
              </Tooltip>
            </ListItem>
            <Collapse in={table.collapse} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {table.columns.map((column, columnIndex) => (
                  <ListItem key={column.column} sx={{ paddingLeft: 6 }}>
                    <Checkbox
                      disableRipple
                      size="small"
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
                    <Tooltip
                      placement="top-start"
                      title={column.column.length > 13 ? column.column : null}
                      arrow
                    >
                      <ListItemText
                        primary={
                          column.column.length > 13
                            ? column.column.slice(0, 10) + '...'
                            : column.column
                        }
                      />
                    </Tooltip>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </Fragment>
        ))}
      </List>

      <BasicDatePicker />
      <SubmitButton />
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};
export default DataTable;
