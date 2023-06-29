import 'react-data-grid/lib/styles.css';

import DataGrid from 'react-data-grid';

const columns = [
  { key: 'id', name: 'ID' },
  { key: 'title', name: 'Title' }
];

const rows = [
  { id: 0, title: 'Example' },
  { id: 1, title: 'Demo' }
];

export const ExpTableMain=()=> {
  return <DataGrid columns={columns} rows={rows} />;
}