import {
  HomeOutlined,
  UsergroupDeleteOutlined,
  SettingOutlined,
} from '@ant-design/icons';

// automatic add key = label => label must be unique
export const menuSidebar = [
  {
    key: 'home',
    label: 'Home',
    icon: <HomeOutlined />,
  },
  {
    key: 'account',
    label: 'Account',
    icon: <UsergroupDeleteOutlined />,
    children: [
      {
        key: 'account/admin',
        label: 'Admin',
        role: 'ADMIN',
      },
      {
        key: 'account/role',
        label: 'Role',
        role: 'ADMIN',
      },
      {
        key: 'account/permission',
        label: 'Permission',
        role: 'ADMIN',
      },
      {
        key: 'account/owner',
        label: 'Owner',
        role: 'OWNER',
      },
    ],
  },
  {
    key: 'setting',
    label: 'Setting',
    icon: <SettingOutlined />,
  },
];
