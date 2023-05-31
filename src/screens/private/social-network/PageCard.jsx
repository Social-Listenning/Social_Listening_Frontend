import {
  PoweroffOutlined,
  SettingOutlined,
  LoginOutlined,
  PlayCircleOutlined,
  RobotOutlined,
  CommentOutlined,
  FormOutlined
} from '@ant-design/icons';
import { Card } from 'antd';
import { useMutation } from 'react-query';
import { customHistory } from '../../../routes/CustomRouter';
import { disconnectFacebook } from './socialNetworkService';
import emptyImage from '../../../assets/images/image_not_available.png';
import BasicAvatar from '../../../components/shared/antd/BasicAvatar';
import ToolTipWrapper from '../../../components/shared/antd/ToolTipWrapper';
import ElementWithPermission from '../../../components/shared/element/ElementWithPermission';

const { Meta } = Card;

export default function PageCard(props) {
  const { socialNetworkData, type } = props;

  let pageData = null;
  if (socialNetworkData?.SocialNetwork?.extendData) {
    pageData = JSON.parse(
      socialNetworkData?.SocialNetwork?.extendData
    );
  }

  let forwardData = {
    socialId: socialNetworkData?.id,
    socialPage: pageData,
  };

  // function redirectToPage(id) {
  //   if (type === 'Facebook') {
  //     window.open(`https://fb.com/${id}`, '_blank');
  //   }
  // }

  // const useDisconnect = useMutation(disconnectFacebook, {
  //   onSuccess: (resp) => {
  //     // call api to BE
  //     console.log(resp);
  //   },
  // });

  return (
    <Card
      onClick={() => {
        customHistory.push(
          `/social-network/${socialNetworkData?.name}`,
          forwardData
        );
      }}
      className="page-card"
      cover={
        <>
          {pageData?.wallpaperUrl ? (
            <img
              className="wall-container"
              alt="wallpaper"
              src={pageData?.wallpaperUrl}
              onError={(e) => {
                e.currentTarget.src = emptyImage;
                e.currentTarget.className += ' empty-wall';
              }}
            />
          ) : (
            <img
              className="wall-container empty-wall"
              alt="wallpaper"
              src={emptyImage}
            />
          )}
        </>
      }
      actions={[
        <ToolTipWrapper tooltip="Comments">
          <CommentOutlined
            onClick={(e) => {
              e.stopPropagation();
              customHistory.push(
                `/social-network/${socialNetworkData?.name}`,
                {
                  ...forwardData,
                  tab: 2,
                }
              );
            }}
          />
        </ToolTipWrapper>,
        <ToolTipWrapper tooltip="Chats">
          <FormOutlined
            onClick={(e) => {
              e.stopPropagation();
              customHistory.push(
                `/social-network/${socialNetworkData?.name}`,
                {
                  ...forwardData,
                  tab: 3,
                }
              );
            }}
          />
        </ToolTipWrapper>,
        <ToolTipWrapper tooltip="Disconnect this page">
          <PoweroffOutlined
            onClick={(e) => {
              e.stopPropagation();
              // useDisconnect.mutate({
              //   appId: 594535438672562,
              //   pageId: pageData?.id,
              //   accessToken: pageData?.accessToken,
              // });
            }}
          />
        </ToolTipWrapper>,
        // <ElementWithPermission permission="get-social-setting">
        //   <ToolTipWrapper tooltip="Setting this page">
        //     <SettingOutlined
        //       onClick={(e) => {
        //         e.stopPropagation();
        //         customHistory.push(
        //           `/social-network/${socialNetworkData?.name}`,
        //           {
        //             ...forwardData,
        //             tab: 9,
        //           }
        //         );
        //       }}
        //     />
        //   </ToolTipWrapper>
        // </ElementWithPermission>,
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
