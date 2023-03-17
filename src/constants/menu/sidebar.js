import {
  HomeOutlined,
  SafetyOutlined,
  CrownOutlined,
  SmileOutlined,
  KeyOutlined,
  UserSwitchOutlined,
  SettingOutlined,
  UserOutlined,
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
    icon: <SafetyOutlined />,
    children: [
      {
        key: 'account/admin',
        label: 'Admin',
        icon: <CrownOutlined />,
        permissions: 'ADMIN',
      },
      {
        key: 'account/role',
        label: 'Role',
        icon: <UserSwitchOutlined />,
        permissions: 'ADMIN',
      },
      {
        key: 'account/permission',
        label: 'Permission',
        icon: <KeyOutlined />,
        permissions: 'ADMIN',
      },
      {
        key: 'account/owner',
        label: 'Owner',
        icon: <SmileOutlined />,
        permissions: 'OWNER',
      },
    ],
  },
  // {
  //   key: 'setting',
  //   label: 'Setting',
  //   icon: <SettingOutlined />,
  // },
];
