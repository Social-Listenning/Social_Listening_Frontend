import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Card } from 'antd';
import BasicAvatar from '../../../components/shared/antd/BasicAvatar';
import EmptyPlacehoder from '../../../components/shared/antd/EmptyPlaceholder';
import './socialNetwork.scss';

const { Meta } = Card;

export default function PageCard(props) {
  const { id, wallpaper, avt, name, type } = props;
  return (
    <Card
      className="page-card"
      cover={
        <>
          {wallpaper ? (
            <img
              className="wall-container"
              alt="wallpaper"
              src={wallpaper}
            />
          ) : (
            <div>
              <EmptyPlacehoder description="Empty wallpaper" />
            </div>
          )}
        </>
      }
      actions={[
        <SettingOutlined key="setting" />,
        <EditOutlined key="edit" />,
        <EllipsisOutlined key="ellipsis" />,
      ]}
    >
      <Meta
        avatar={<BasicAvatar src={avt} name={name} />}
        title={name}
        description={`Social type: ${type}`}
      />
    </Card>
  );
}
