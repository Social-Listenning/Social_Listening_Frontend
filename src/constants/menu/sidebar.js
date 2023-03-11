import {
  HomeOutlined,
  SafetyOutlined,
  CrownOutlined,
  SmileOutlined,
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
    label: 'Account Management',
    icon: <SafetyOutlined />,
    children: [
      {
        key: 'account/admin',
        label: 'Admin',
        icon: <CrownOutlined />,
        permissions: 'ADMIN',
      },
      {
        key: 'account/owner',
        label: 'Owner',
        icon: <SmileOutlined />,
        permissions: 'OWNER, ADMIN',
      },
    ],
  },
  // {
  //   key: 'setting',
  //   label: 'Setting',
  //   icon: <SettingOutlined />,
  // },
];
