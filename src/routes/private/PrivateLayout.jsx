import { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { decodeToken } from 'react-jwt';
import { Getter } from '../../utils/dataGetter';
import { Converter } from '../../utils/dataConverter';
import { apiService } from '../../services/apiService';
import { notifyService } from '../../services/notifyService';
import { menuSidebar } from '../../constants/menu/sidebar';
import { menuUserHeader } from '../../constants/menu/header';
import { useSocket } from '../../components/contexts/socket/SocketProvider';
import useEffectOnce from '../../components/hooks/useEffectOnce';
import useUpdateEffect from '../../components/hooks/useUpdateEffect';
import useToggle from '../../components/hooks/useToggle';
import Title from '../../components/shared/element/Title';
import ToolTipWrapper from '../../components/shared/antd/ToolTipWrapper';
import ClassicDropdown from '../../components/shared/antd/Dropdown/Classic';
import BasicAvatar from '../../components/shared/antd/BasicAvatar';
import '../route.scss';

const { Header, Content, Sider } = Layout;
export default function PrivateLayout(props) {
  const [collapsed, setCollapsed] = useToggle(false);
  const navigate = useNavigate();
  const { socket, connect, disconnect } = useSocket();

  const path = Getter.getPathName(); // also the key of the menu sidebar
  const listPath = path?.split('/');
  const currentPath = listPath[listPath?.length - 1];

  const openKey = Getter.getOpenKeyForMenu(
    menuSidebar,
    Converter.convertStringToTitleCase(currentPath)
  );

  const token = localStorage.getItem('token');
  const decodedToken = decodeToken(token);

  const [availableMenu, setAvailableMenu] = useState(menuSidebar);

  useEffectOnce(
    () => {
      connect();
    },
    // onDestroy function
    () => {
      disconnect();
    }
  );

  useUpdateEffect(() => {
    socket.on('sendNotification', (payload) => {
      if (payload) {
        setTimeout(() => {
          notifyService.showSucsessMessage({
            title: payload.title,
            description: payload.body,
            duration: 0,
          });
        }, 1000);

        // push receive back to server
        socket.emit('receiveNotification', payload.id?.toString());
      }
    });
  }, [socket]);

  function handleMenuHeader(e) {
    // logout option
    if (menuUserHeader[e.key] === 'Logout') {
      apiService.post('/auth/log-out').then((resp) => {
        if (resp?.result) {
          disconnect();
          localStorage.removeItem('token');
          navigate('/login');
          notifyService.showSucsessMessage({
            description: 'Logout successfully',
          });
        }
      });
    }
    // profile option
    else if (menuUserHeader[e.key] === 'Profile') {
      navigate('/profile');
    }
  }

  return (
    <Layout className="private-layout">
      <Sider
        collapsible
        trigger={null}
        width={240}
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        {/* icon */}
        <div
          style={{
            height: 32,
            margin: 16,
            background: 'rgba(255, 255, 255, 0.2)',
          }}
        />
        <Menu
          onSelect={(e) => {
            navigate(`/${Converter.toLowerCaseFirstLetter(e.key)}`);
          }}
          theme="dark"
          mode="inline"
          items={availableMenu ?? menuSidebar}
          selectedKeys={[path]}
          {...(currentPath &&
            !collapsed && { defaultOpenKeys: [openKey] })}
        />
      </Sider>

      <Layout>
        <Header className="private-header flex-center">
          <ToolTipWrapper
            title={!collapsed ? 'Collapse menu' : 'Open menu'}
            placement="right"
            className="colapse-btn"
            onClick={() => setCollapsed()}
          >
            {collapsed ? (
              <MenuUnfoldOutlined />
            ) : (
              <MenuFoldOutlined />
            )}
          </ToolTipWrapper>

          <ClassicDropdown
            list={menuUserHeader}
            handleItemClick={handleMenuHeader}
          >
            <div className="header-menu flex-center">
              <BasicAvatar name={decodedToken?.userName} />
              <span>{decodedToken?.userName}</span>
              <DownOutlined />
            </div>
          </ClassicDropdown>
        </Header>

        <Content className="private-content">
          <Title>{listPath?.join(' / ')}</Title>

          <div className="body">{props.children}</div>
        </Content>
      </Layout>
    </Layout>
  );
}
