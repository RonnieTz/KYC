import styles from './container.module.css';
import DataTable from './dataTable/DataTable';
import DisplayedData from './dataTable/displayedData/DisplayedData';
const { container } = styles;

const Container = () => {
  return (
    <div className={container}>
      <DataTable />
      <DisplayedData />
    </div>
  );
};
export default Container;
