import { Button } from 'antd';
import { UsergroupAddOutlined } from '@ant-design/icons';

export default function AssignButton(props) {
  return (
    <Button type="primary" icon={<UsergroupAddOutlined />} {...props}>
      Assign User
    </Button>
  );
}
