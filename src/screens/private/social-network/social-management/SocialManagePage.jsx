import { useLocation } from 'react-router-dom';
import { Tabs } from 'antd';
import {
  FormOutlined,
  CommentOutlined,
  SettingOutlined,
  RobotOutlined,
  PlayCircleOutlined,
  TeamOutlined,
  ProjectOutlined,
} from '@ant-design/icons';
import ElementWithPermission from '../../../../components/shared/element/ElementWithPermission';
import MessageManagePage from './message-management/MessageManagePage';
import SettingManagePage from './setting-mangement/SettingManagePage';
import BotFlowManagePage from './bot-flow-management/BotFlowManagePage';
import BotManagePage from './bot-management/BotManagePage';
import MemberManagePage from './member-management/MemberManagePage';
import SummaryManagePage from './summary-management/SummaryManagePage';
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
    {
      key: 1,
      label: formatTab(<ProjectOutlined rotate={180} />, 'Summary'),
      children: (
        <SummaryManagePage
          pageId={location.state?.socialId}
          socialPage={location.state?.socialPage}
        />
      ),
    },
    {
      key: 2,
      label: formatTab(
        <CommentOutlined />,
        'Comment',
        'table-comment'
      ),
      children: (
        <MessageManagePage
          pageId={location.state?.socialId}
          socialPage={location.state?.socialPage}
          type="Comment"
        />
      ),
    },
    {
      key: 3,
      label: formatTab(<FormOutlined />, 'Chat', 'table-message'),
      children: (
        <MessageManagePage
          pageId={location.state?.socialId}
          socialPage={location.state?.socialPage}
          type="Message"
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
      key: 6,
      label: formatTab(
        <TeamOutlined />,
        'Member',
        'table-user-in-tab'
      ),
      children: (
        <MemberManagePage
          pageId={location.state?.socialId}
          socialPage={location.state?.socialPage}
        />
      ),
    },
    // {
    //   key: 9,
    //   label: formatTab(
    //     <SettingOutlined />,
    //     'Setting',
    //     'get-social-setting'
    //   ),
    //   children: (
    //     <SettingManagePage pageId={location.state?.socialId} />
    //   ),
    // },
  ];

  return (
    <Tabs
      // centered
      destroyInactiveTabPane
      className="social-tab"
      defaultActiveKey={location.state?.tab ?? 1}
      items={items}
      key={location.state?.socialId}
    />
  );
}
