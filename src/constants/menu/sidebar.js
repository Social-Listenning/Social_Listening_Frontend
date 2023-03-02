import {
  UsergroupAddOutlined,
  SettingOutlined,
} from '@ant-design/icons';

// automatic add key = label => label must be unique
export const menuSidebar = [
  {
    label: 'Account',
    icon: <UsergroupAddOutlined />,
    children: [
      { label: 'Admin' },
      { label: 'Employee' },
      { label: 'Customer' },
    ],
  },
  {
    label: 'Setting',
    icon: <SettingOutlined />,
  },
].map((item) => {
  if (item.children?.length > 0) {
    item.children = item.children.map((x) => {
      return {
        ...x,
        key: x.label,
      };
    });
  }
  return {
    ...item,
    key: item.label,
  };
});
