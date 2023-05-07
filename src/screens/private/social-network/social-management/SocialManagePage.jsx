import { useLocation } from 'react-router-dom';
import { Tabs } from 'antd';
import {
  FormOutlined,
  CommentOutlined,
  SettingOutlined,
  RobotOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import ElementWithPermission from '../../../../components/shared/element/ElementWithPermission';
import MessageManagePage from './message-management/MessageManagePage';
import PostManagePage from './post-management/PostManagePage';
import SettingManagePage from './setting-mangement/SettingManagePage';
import BotFlowManagePage from './bot-flow-management/BotFlowManagePage';
import BotManagePage from './bot-management/BotManagePage';
import ChatManagePage from './chat-management/ChatManagePage';
import '../socialNetwork.scss';

export default function SocialMangePage() {
  const location = useLocation();

  function formatTab(icon, label, permission) {
    const tabFormatted = (
      <>
        {icon}
        <span>{label}</span>
      </>
    );

    return permission ? (
      <ElementWithPermission permission={permission}>
        {tabFormatted}
      </ElementWithPermission>
    ) : (
      tabFormatted
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
          socialPage={location.state?.socialPage}
        />
      ),
    },
    {
      key: 3,
      label: formatTab(<FormOutlined />, 'Chat'),
      children: (
        <ChatManagePage
          pageId={location.state?.socialId}
          socialPage={location.state?.socialPage}
        />
      ),
    },
    {
      key: 4,
      label: formatTab(
        <PlayCircleOutlined />,
        'Design Bot Flow',
        'table-workflow'
      ),
      children: (
        <BotFlowManagePage
          pageId={location.state?.socialId}
          socialPage={location.state?.socialPage}
        />
      ),
    },
    {
      key: 5,
      label: formatTab(<RobotOutlined />, 'Bots', 'table-workflow'),
      children: (
        <BotManagePage
          pageId={location.state?.socialId}
          socialPage={location.state?.socialPage}
        />
      ),
    },
    {
      key: 9,
      label: formatTab(
        <SettingOutlined />,
        'Setting',
        'get-social-setting'
      ),
      children: (
        <SettingManagePage pageId={location.state?.socialId} />
      ),
    },
  ];

  return (
    <Tabs
      // centered
      destroyInactiveTabPane
      className="social-tab"
      defaultActiveKey={location.state?.tab ?? 4}
      items={items}
      key={location.state?.socialId}
    />
  );
}
