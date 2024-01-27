import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../redux/store';
import {
  setFullLoading,
  setTimeStart,
  setTimeEnd,
} from '../../../../redux/appSlice';
import { DateTimePicker, MobileDateTimePicker } from '@mui/x-date-pickers';

export default function DatePickerValue() {
  const dispatch = useDispatch();
  const { fullLoading, time } = useSelector((state: RootState) => state.app);

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      gap={2}
      width={'100%'}
      boxShadow={'0 0 30px 0 lightgrey inset'}
    >
      <FormControlLabel
        sx={{ marginLeft: 2 }}
        control={
          <Checkbox
            value={fullLoading}
            onChange={(e) => dispatch(setFullLoading(e.target.checked))}
          />
        }
        label="Full Loading"
      />
      <Typography
        color={fullLoading ? 'lightgrey' : 'black'}
        textAlign={'center'}
        variant={'caption'}
      >
        Date Range
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MobileDateTimePicker
          defaultValue={dayjs(new Date(time.start))}
          label="From"
          disabled={fullLoading}
          onChange={(e) => {
            dispatch(setTimeStart(new Date(e?.toDate()!).getTime()));
          }}
          maxDateTime={dayjs(new Date(time.end))}
        />
      </LocalizationProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MobileDateTimePicker
          defaultValue={dayjs()}
          label="To"
          disabled={fullLoading}
          onChange={(e) => {
            dispatch(setTimeEnd(new Date(e?.toDate()!).getTime()));
          }}
          disableFuture
          minDateTime={dayjs(new Date(time.start))}
        />
      </LocalizationProvider>
    </Box>
  );
}
