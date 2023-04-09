import {
  PauseOutlined,
  PoweroffOutlined,
  SettingOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import { Card } from 'antd';
import { useMutation } from 'react-query';
import { customHistory } from '../../../routes/CustomRouter';
import { disconnectFacebook } from './socialNetworkService';
import BasicAvatar from '../../../components/shared/antd/BasicAvatar';
import ToolTipWrapper from '../../../components/shared/antd/ToolTipWrapper';
import emptyImage from '../../../assets/images/image_not_available.png';

const { Meta } = Card;

export default function PageCard(props) {
  const { socialNetworkId, pageData, type } = props;

  function redirectToPage(id) {
    if (type === 'Facebook') {
      window.open(`https://fb.com/${id}`, '_blank');
    }
  }

  const useDisconnect = useMutation(disconnectFacebook, {
    onSuccess: (resp) => {
      // call api to BE
      console.log(resp);
    },
  });

  return (
    <Card
      onClick={() => {
        customHistory.push(
          `/social-network/${socialNetworkId}`,
          pageData
        );
      }}
      className="page-card"
      cover={
        <>
          <img
            className="wall-container"
            alt="wallpaper"
            src={pageData?.wallpaperUrl}
            onError={(e) => {
              e.currentTarget.src = emptyImage;
              e.currentTarget.className += ' empty-wall';
            }}
          />
        </>
      }
      actions={[
        // <ToolTipWrapper tooltip="Pause this page">
        //   <PauseOutlined />
        // </ToolTipWrapper>,
        <ToolTipWrapper tooltip="Disconnect this page">
          <PoweroffOutlined
            onClick={(e) => {
              e.stopPropagation();
              useDisconnect.mutate({
                appId: 594535438672562,
                pageId: pageData?.id,
                accessToken: pageData?.accessToken,
              });
            }}
          />
        </ToolTipWrapper>,
        <ToolTipWrapper tooltip="Go to this page">
          <LoginOutlined
            onClick={(e) => {
              e.stopPropagation();
              redirectToPage(pageData?.id);
            }}
          />
        </ToolTipWrapper>,
        // <SettingOutlined />,
      ]}
    >
      <Meta
        avatar={
          <BasicAvatar
            size={44}
            src={pageData?.pictureUrl}
            name={pageData?.name}
          />
        }
        title={pageData?.name}
        description={`Social type: ${type}`}
      />
    </Card>
  );
}
