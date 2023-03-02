import { Layout, Menu, Tooltip } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useToggle from '../../hooks/useToggle';
import { Getter } from '../../utils/dataGetter';
import { Converter } from '../../utils/dataConverter';
import { menuSidebar } from '../../constants/menu/sidebar';
import { menuUserHeader } from '../../constants/menu/header';
import Title from '../../components/shared/element/Title';
import ClassicDropdown from '../../components/shared/antd/Dropdown/Classic';
import BasicAvatar from '../../components/shared/antd/BasicAvatar';
import '../route.scss';

const { Header, Content, Sider } = Layout;
export default function PrivateLayout(props) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useToggle(false);

  const listPath = Getter.getPathNameUrl();
  const currentPath = listPath.pop();

  let openKey = Getter.getOpenKeyForMenu(
    menuSidebar,
    Converter.convertStringToTitleCase(currentPath)
  );

  function handleMenuHeader(e) {
    console.log(e);
  }

  return (
    <Layout className="private-layout">
      <Sider
        // trigger={null}
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
          items={menuSidebar}
          selectedKeys={[
            Converter.convertStringToTitleCase(currentPath),
          ]}
          {...(currentPath &&
            !collapsed && { defaultOpenKeys: [openKey] })}
        />
      </Sider>

      <Layout>
        <Header className="private-header flex-center">
          <Tooltip
            title={!collapsed ? 'Collapse Menu' : 'Open Menu'}
            placement="right"
            className="colapse-btn"
            onClick={() => setCollapsed()}
          >
            {collapsed ? (
              <MenuUnfoldOutlined />
            ) : (
              <MenuFoldOutlined />
            )}
          </Tooltip>

          <ClassicDropdown
            list={menuUserHeader}
            handleItemClick={handleMenuHeader}
          >
            <div className="header-menu flex-center">
              <BasicAvatar name="Thắng" />
              <span>Thắng ngoo</span>
              <DownOutlined />
            </div>
          </ClassicDropdown>
        </Header>

        <Content className="private-content">
          <Title>{currentPath ? currentPath : 'Home'}</Title>

          <div className="body">{props.children}</div>
        </Content>
      </Layout>
    </Layout>
  );
}
