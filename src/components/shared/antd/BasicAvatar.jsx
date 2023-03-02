import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

export default function BasicAvatar({ name = '', src = '' }) {
  return (
    <Avatar
      {...(!name && { icon: <UserOutlined /> })}
      alt={name ?? 'default-avt'}
      src={src}
    >
      {name?.charAt(0)}
    </Avatar>
  );
}
