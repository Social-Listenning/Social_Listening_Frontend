import { useLocation } from 'react-router-dom';
import { Tabs } from 'antd';
import {
  TeamOutlined,
  CommentOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import MessageManagePage from './message-management/MessageManagePage';
import SettingManagePage from './setting-mangement/SettingManagePage';
import '../socialNetwork.scss';

export default function SocialMangePage() {
  const location = useLocation();

  function formatTab(icon, label) {
    return (
      <>
        {icon}
        <span>{label}</span>
      </>
    );
  }

  const items = [
    // {
    //   key: 1,
    //   label: formatTab(<TeamOutlined />, 'Member'),
    //   children: `Content of Tab Pane 1`,
    // },
    {
      key: 2,
      label: formatTab(<CommentOutlined />, 'Message'),
      children: (
        <MessageManagePage
          pageId={location.state?.socialId}
          socialPage={location.state.socialPage}
        />
      ),
    },
    {
      key: 3,
      label: formatTab(<SettingOutlined />, 'Setting'),
      children: (
        <SettingManagePage pageId={location.state?.socialId} />
      ),
    },
  ];

  return (
    <Tabs
      // centered
      className="social-tab"
      defaultActiveKey={location.state?.tab ?? 2}
      items={items}
    />
  );
}
