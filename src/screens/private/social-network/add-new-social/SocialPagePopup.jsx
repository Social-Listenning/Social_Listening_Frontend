import { useRef } from 'react';
import { Button, Card, Modal } from 'antd';
import { useMutation } from 'react-query';
import { notifyService } from '../../../../services/notifyService';
import {
  connectPageToSystem,
  useGetSocialGroups,
} from '../socialNetworkService';
import Title from '../../../../components/shared/element/Title';
import BasicAvatar from '../../../../components/shared/antd/BasicAvatar';
import ToolTipWrapper from '../../../../components/shared/antd/ToolTipWrapper';

export default function SocialPagePopup(props) {
  const {
    open,
    close,
    type,
    listPage = [],
    listPageConnected = [],
  } = props;
  const listConnected = useRef([]);
  const currentConnected = useRef(null);
  const getAllSocialConnected = useRef(false);
  listConnected.current = listPageConnected;

  useGetSocialGroups(getAllSocialConnected.current);
  getAllSocialConnected.current = false;

  const useConnectPageToSystem = useMutation(connectPageToSystem, {
    onSuccess: (resp) => {
      if (resp) {
        getAllSocialConnected.current = true;
        listConnected.current?.push(currentConnected.current);
        notifyService.showSucsessMessage({
          description: 'Connect successfully',
        });
      }
    },
  });

  return (
    <Modal
      open={open}
      onCancel={close}
      footer={null}
      maskClosable={false}
      className="social-page-popup"
      destroyOnClose
    >
      <Title>Your pages</Title>
      {listPage?.map((item, index) => (
        <ToolTipWrapper
          key={index}
          tooltip={
            listConnected.current?.includes(item?.id) &&
            'This page is already connected'
          }
          // placement="left"
        >
          <Card className="social-page-container">
            <div className="flex-center social-page-wrapper">
              <div className="flex-center left-section">
                <BasicAvatar
                  size={56}
                  src={item?.pictureUrl}
                  name={item?.name}
                />
                <span className="social-page-name">{item?.name}</span>
              </div>
              {!listConnected.current?.includes(item?.id) ? (
                <Button
                  type="primary"
                  onClick={() => {
                    currentConnected.current = item?.id;

                    useConnectPageToSystem.mutate({
                      socialType: type,
                      name: item?.name,
                      extendData: JSON.stringify(item),
                    });
                  }}
                >
                  Connect
                </Button>
              ) : (
                <Button type="primary">Manage page</Button>
              )}
            </div>
          </Card>
        </ToolTipWrapper>
      ))}
    </Modal>
  );
}
