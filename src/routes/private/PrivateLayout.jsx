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
import { useMutation, useQueryClient } from 'react-query';
import { Getter } from '../../utils/dataGetter';
import { Converter } from '../../utils/dataConverter';
import { apiService } from '../../services/apiService';
import { notifyService } from '../../services/notifyService';
import { menuSidebar } from '../../constants/menu/sidebar';
import { menuUserHeader } from '../../constants/menu/header';
import { useSocket } from '../../components/contexts/socket/SocketProvider';
import { getAllNotification } from './privateService';
import { useGetSocialGroups } from '../../screens/private/social-network/socialNetworkService';
import { useGetAllSetting } from '../../screens/private/setting/settingService';
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [collapsed, setCollapsed] = useToggle(false);
  const { socket, disconnect } = useSocket();
  const userData = queryClient.getQueryData('userData');

  // #region menu sidebar setup
  const path = Getter.getPathName(); // also the key of the menu sidebar
  const listPath = path?.split('/');
  const currentPath = listPath[listPath?.length - 1];

  const [availableMenu, setAvailableMenu] = useState(menuSidebar);
  const openKey = Getter.getOpenKeyForMenu(
    availableMenu,
    Converter.convertStringToTitleCase(currentPath)
  );

  const canGetSocialGroups = useRef(true);
  const { data: socialGroups } = useGetSocialGroups(
    canGetSocialGroups.current
  );
  canGetSocialGroups.current = false;

  useUpdateEffect(() => {
    if (socialGroups?.length > 0) {
      setAvailableMenu([
        ...availableMenu?.map((item) => {
          if (item.key === 'social-network') {
            item.children = [
              ...item.children,
              ...socialGroups?.map((sg) => {
                return {
                  key: `social-network/${sg?.name}`,
                  label: sg?.name,
                  id: sg?.id,
                };
              }),
            ];
          }
          return item;
        }),
      ]);
    }
  }, [socialGroups]);

  function filterMenuSidebar(permission, role) {
    const filtered = menuSidebar.map((item) => {
      if (item.children && item.children.length > 0) {
        const filteredChildren = item.children.filter(
          (child) =>
            (!child.permission ||
              permission.includes(child.permission)) &&
            (!child.role || child.role?.includes(role))
        );
        return { ...item, children: filteredChildren };
      } else {
        return item;
      }
    });
    return filtered.filter(
      (item) =>
        (!item.permission || permission.includes(item.permission)) &&
        (!item.role || item.role?.includes(role))
    );
  }

  function handleItemSelect(e) {
    // #region handle social-network item
    let correctSocial = null;
    // get the social group data
    if (e.keyPath[0].includes('social-network')) {
      availableMenu.map((item) => {
        if (item.children?.length > 0) {
          item.children.map((childItem) => {
            if (childItem?.id) {
              correctSocial = socialGroups.filter(
                (social) => social?.id === childItem?.id
              )[0];
              return;
            }
          });
        }
      });
    }

    // format the social data
    let forwardData = null;
    if (correctSocial) {
      let pageData = null;
      if (correctSocial?.SocialNetwork?.extendData) {
        pageData = JSON.parse(correctSocial.SocialNetwork.extendData);
      }

      forwardData = {
        socialId: correctSocial?.id,
        socialPage: pageData,
      };
    }
    // #endregion

    navigate(`/${Converter.toLowerCaseFirstLetter(e.key)}`, {
      state: forwardData,
    });
  }
  // #endregion

  // #region notification
  const [notiList, setNotiList] = useState([]);
  const useGetAllNotification = useMutation(getAllNotification, {
    onSuccess: (resp) => {
      setNotiList(resp);
    },
  });
  // #endregion

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

  // #region get default data
  // get all setting and save it to local host
  // const getSetting = useRef(
  //   userData.permissions.includes('table-setting')
  // );
  // const { data: settingData } = useGetAllSetting(getSetting.current);
  // getSetting.current = false;
  // localStorage.setItem('allSetting', JSON.stringify(settingData));

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

      localStorage.clear();
    }
    // profile option
    else if (menuUserHeader[e.key] === 'Profile') {
      navigate('/profile');
    }
  }

  useEffectOnce(() => {
    if (!currentPath) {
      navigate('/home');
    }

    // filter the menu sidebar
    setAvailableMenu(
      filterMenuSidebar(userData.permissions, userData.role)
    );

    // get notification
    useGetAllNotification.mutate({
      offset: 0,
      size: 10,
      pageNumber: 1,
      totalElement: 10000,
      orders: [],
      filter: [],
    });
  });

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
          onSelect={handleItemSelect}
          theme="dark"
          mode="inline"
          items={availableMenu}
          selectedKeys={[path]}
          defaultOpenKeys={[openKey ? openKey : 'social-network']}
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
                        // {
                        //   key: 2,
                        //   label: `Unread`,
                        //   children: menu,
                        // },
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
                <BasicAvatar name={userData?.userName} />
                <span>{userData?.userName}</span>
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

      {openChart && (
        <PieChartResult
          open={openChart}
          toggleOpen={setOpenChart}
          title={title.current}
          result={{
            total: resultChart.current?.totalImport,
            success: resultChart.current?.importSuccess,
            fail: resultChart.current?.importFailure,
          }}
        />
      )}
    </Layout>
  );
}
