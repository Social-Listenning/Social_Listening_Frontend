import AdminTable from '../../components/shared/antd/Table/Table';
import { defaultAction } from '../../constants/table/action';

export default function AdminPage() {
  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
    },
    {
      title: 'Column 1',
      dataIndex: 'address',
    },
    {
      title: 'Column 2',
      dataIndex: 'address',
    },
    {
      title: 'Column 3',
      dataIndex: 'address',
    },
    {
      title: 'Column 4',
      dataIndex: 'address',
    },
    {
      title: 'Column 5',
      dataIndex: 'address',
    },
    {
      title: 'Column 6',
      dataIndex: 'address',
    },
    {
      title: 'Column 7',
      dataIndex: 'address',
    },
    {
      title: 'Column 8',
      dataIndex: 'address',
    },
  ];
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      key: i,
      name: `Edrward ${i}`,
      age: 32,
      address: `London Park no. ${i}`,
    });
  }

  return (
    <AdminTable
      data={data}
      columns={columns}
      actionList={defaultAction}
    />
  );
}
