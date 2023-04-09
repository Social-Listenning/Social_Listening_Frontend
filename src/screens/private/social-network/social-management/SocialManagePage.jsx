import { useParams, useLocation } from 'react-router-dom';
import { Tabs } from 'antd';
import { TeamOutlined, CommentOutlined } from '@ant-design/icons';
import MessageManagePage from './message-management/MessageManagePage';
import '../socialNetwork.scss';

export default function SocialMangePage() {
  const { id } = useParams();
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
        <MessageManagePage pageId={id} socialPage={location?.state} />
      ),
    },
  ];

  return (
    <Tabs
      // centered
      className="social-tab"
      defaultActiveKey={2}
      items={items}
    />
  );
}
