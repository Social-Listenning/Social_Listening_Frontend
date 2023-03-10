import {
  SafetyOutlined,
  SettingOutlined,
  UserOutlined,
  CrownOutlined,
} from '@ant-design/icons';

// automatic add key = label => label must be unique
export const menuSidebar = [
  {
    key: 'admin',
    label: 'Admin',
    icon: <SafetyOutlined />,
    children: [
      { label: 'Users', icon: <UserOutlined /> },
      { label: 'Roles' },
    ],
  },
  {
    key: 'owner',
    label: 'Owner',
    icon: <CrownOutlined />,
  },
  {
    key: 'setting',
    label: 'Setting',
    icon: <SettingOutlined />,
  },
]
