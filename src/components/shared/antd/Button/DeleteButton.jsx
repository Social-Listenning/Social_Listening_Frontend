import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

export default function DeleteButton(props) {
  return (
    <Button icon={<DeleteOutlined />} {...props}>
      Delete
    </Button>
  );
}
