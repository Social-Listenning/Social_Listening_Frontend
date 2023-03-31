import {
  HomeOutlined,
  UsergroupDeleteOutlined,
  SettingOutlined,
  GlobalOutlined,
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
        key: 'account/user',
        label: 'User',
        permission: 'table-user',
      },
      {
        key: 'account/role',
        label: 'Role',
        permission: 'get-role',
      },
      {
        key: 'account/permission',
        label: 'Permission',
        permission: 'table-permission',
      },
    ],
  },
  {
    key: 'social-network',
    label: 'Social Network',
    icon: <GlobalOutlined />,
  },
  {
    key: 'setting',
    label: 'Setting',
    icon: <SettingOutlined />,
  },
];
