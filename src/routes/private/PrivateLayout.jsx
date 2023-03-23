import { useState, useRef } from 'react';
import { Badge, Layout, Menu, Tabs } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
  CheckCircleOutlined,
  BellOutlined,
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
import PieChartResult from '../../components/shared/antd/Chart/PieChartResult';
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
  console.log(decodedToken);
  // #region menu sidebar config with role
  const [availableMenu, setAvailableMenu] = useState(
    menuSidebar.map((x) => x)
  );
  function filterMenuSidebar(role) {
    const filtered = menuSidebar.map((item) => {
      if (item.children && item.children.length > 0) {
        const filteredChildren = item.children.filter(
          (child) => !child.role || child.role === role
        );
        return { ...item, children: filteredChildren };
      } else {
        return item;
      }
    });
    return filtered.filter(
      (item) => !item.role || item.role === role
    );
  }
  // #endregion

  const [notiList, setNotiList] = useState({});
  useEffectOnce(
    () => {
      // filter the menu sidebar
      setAvailableMenu(filterMenuSidebar(decodedToken.role));

      try {
        apiService
          .post('/notification', {
            offset: 0,
            size: 10,
            pageNumber: 1,
            totalElement: 10000,
            orders: [],
            filter: [],
          })
          .then((resp) => {
            if (resp?.result) {
              setNotiList(resp.result);
            }
          });
      } catch (ex) {
        notifyService.showErrorMessage({
          description: ex.message,
        });
      }

      connect(); // connect socket
    }
    // onDestroy function
    // () => {
    //   disconnect(); // disconnect socket
    // }
  );

  // #region chart notification
  const [openChart, setOpenChart] = useToggle(false);
  const title = useRef(null);
  const resultChart = useRef(null);
  function openChartResult(notificationId) {
    setOpenChart(true);
    socket.emit('clickNotification', notificationId);
  }

  useUpdateEffect(() => {
    socket.on('sendNotification', (payload) => {
      if (payload) {
        title.current = payload.title;
        if (payload.extendData) {
          resultChart.current = JSON.parse(payload.extendData);
        }

        setTimeout(() => {
          notifyService.showSucsessMessage({
            icon: <CheckCircleOutlined />,
            title: payload.title,
            description: (
              <div
                className="pointer"
                onClick={openChartResult(payload.id?.toString())}
              >
                {payload.body}
              </div>
            ),
            duration: 0,
          });
        }, 1000);

        // push receive back to server
        socket.emit('receiveNotification', payload.id?.toString());
      }
    });
  }, [socket]);
  // #endregion

  async function handleMenuHeader(e) {
    // logout option
    if (menuUserHeader[e.key] === 'Logout') {
      navigate('/login');
      notifyService.showSucsessMessage({
        description: 'Logout successfully',
      });

      try {
        await apiService.post('/auth/log-out').then((resp) => {
          if (resp?.result) {
            disconnect();
          }
        });
      } catch (ex) {
        notifyService.showErrorMessage({
          description: ex.message,
        });
      }

      localStorage.removeItem('token');
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

          <div className="header-right-wrapper flex-center">
            <ClassicDropdown
              clickTrigger
              list={notiList?.data?.map((item) => item.title)}
              dropdownRender={(menu) => {
                return (
                  <div className="notification-wrapper">
                    <Title>Notifications</Title>
                    <Tabs
                      // centered
                      items={[
                        {
                          key: 1,
                          label: `All`,
                          children: menu,
                        },
                        {
                          key: 2,
                          label: `Unread`,
                          children: menu,
                        },
                      ]}
                    />
                  </div>
                );
              }}
            >
              <ToolTipWrapper tooltip="Notifications">
                <Badge
                  color="var(--primary-color)"
                  count={notiList?.page?.totalElement}
                  overflowCount={99}
                >
                  <BellOutlined />
                </Badge>
              </ToolTipWrapper>
            </ClassicDropdown>

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
          </div>
        </Header>

        <Content className="private-content">
          <Title>{listPath?.join(' / ')}</Title>

          <div className="body">{props.children}</div>
        </Content>
      </Layout>

      <PieChartResult
        open={openChart}
        toggleOpen={setOpenChart}
        title={title.current}
        result={{
          total: resultChart.current?.totalImport,
          success: resultChart.current?.importSuccess,
          fail: resultChart.current?.totalImport,
        }}
      />
    </Layout>
  );
}
