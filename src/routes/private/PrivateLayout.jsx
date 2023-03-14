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
import { localStorageService } from '../../services/localStorageService';
import { notifyService } from '../../services/notifyService';
import { menuSidebar } from '../../constants/menu/sidebar';
import { menuUserHeader } from '../../constants/menu/header';
import { useSocket } from '../../components/socket/SocketProvider';
import useEffectOnce from '../../hooks/useEffectOnce';
import useToggle from '../../hooks/useToggle';
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

  const token = localStorageService.getItem('token');
  const decodedToken = decodeToken(token);

  const [availableMenu, setAvailableMenu] = useState([]);
  function filterMenuByRole(menu, role) {
    return menu
      .map((item) => {
        if (item.children) {
          const children = filterMenuByRole(item.children, role);
          if (children.length > 0) {
            return { ...item, children };
          }
        }
        if (
          !item.permissions ||
          item.permissions
            .split(',')
            .map((p) => p.trim())
            .includes(role)
        ) {
          return item;
        }
        return null;
      })
      .filter(Boolean);
  }

  useEffectOnce(
    () => {
      // connect();
      setAvailableMenu(
        filterMenuByRole(menuSidebar, decodedToken?.role)
      );
    },
    // onDestroy function
    () => {
      disconnect();
    }
  );

  function handleMenuHeader(e) {
    // logout option
    if (menuUserHeader[e.key] === 'Logout') {
      apiService.post('/auth/log-out').then((resp) => {
        if (resp?.result) {
          localStorageService.clear('token');
          navigate('/login');
          notifyService.showSucsessMessage('Logout successfully');
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
        trigger={null}
        collapsible
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
