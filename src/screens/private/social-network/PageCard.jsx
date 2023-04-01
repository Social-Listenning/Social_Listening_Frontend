import {
  PauseOutlined,
  PoweroffOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Card } from 'antd';
import BasicAvatar from '../../../components/shared/antd/BasicAvatar';
import EmptyPlacehoder from '../../../components/shared/antd/EmptyPlaceholder';
import './socialNetwork.scss';

const { Meta } = Card;

export default function PageCard(props) {
  const { pageData, type } = props;
  return (
    <Card
      className="page-card"
      cover={
        <>
          {pageData?.wallpaperUrl ? (
            <img
              className="wall-container"
              alt="wallpaper"
              src={pageData?.wallpaperUrl}
            />
          ) : (
            <div>
              <EmptyPlacehoder description="Empty wallpaper" />
            </div>
          )}
        </>
      }
      actions={[
        <PauseOutlined />,
        <PoweroffOutlined />,
        <SettingOutlined />,
      ]}
    >
      <Meta
        avatar={<BasicAvatar size={44} src={pageData?.pictureUrl} name={pageData?.name} />}
        title={pageData?.name}
        description={`Social type: ${type}`}
      />
    </Card>
  );
}
