import { useEffect, useRef } from 'react';
import { Card } from 'antd';
import { PlusOutlined, FacebookFilled } from '@ant-design/icons';
import { useMutation } from 'react-query';
import { notifyService } from '../../../../services/notifyService';
import { connectFacebook } from '../socialNetworkService';
import useToggle from '../../../../components/hooks/useToggle';
import SocialPagePopup from './SocialPagePopup';
import ClassicDropdown from '../../../../components/shared/antd/Dropdown/Classic';

const socialList = [
  { icon: <FacebookFilled />, label: 'Connect Fanpage' },
];

export default function AddNewPage(props) {
  const { listPageConnected } = props;
  const socialAuth = useRef(null);
  const socialType = useRef(null);
  const [open, toggleOpen] = useToggle(false);

  // #region facebook
  const listPage = useRef(null);
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        // This is App ID
        appId: '594535438672562',
        cookie: true,
        status: true,
        xfbml: true,
        version: 'v16.0',
      });

      window.FB.AppEvents.logPageView();

      window.FB.getLoginStatus(function (response) {
        socialAuth.current = response;
      });
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  });

  const useGetPageToken = useMutation(connectFacebook, {
    onSuccess: (resp) => {
      toggleOpen(true);
      listPage.current = resp?.data?.map((item) => {
        return {
          id: item.id,
          name: item.name,
          pictureUrl: item.picture?.data?.url,
          wallpaperUrl: item.cover?.source,
        };
      });
    },
  });

  function onFacebookLogin() {
    // if (socialAuth.current?.status === 'connected') {
    //   // do something when already connected
    // } else {
    window.FB.login(
      function (response) {
        console.log(response);
        socialAuth.current = response;
        if (response?.status === 'connected') {
          const userId = response?.authResponse?.userID;
          const userToken = response?.authResponse?.accessToken;

          if (userId && userToken) {
            useGetPageToken.mutate({
              userId: userId,
              userToken: userToken,
            });
          }
        }
        // else {
        //   notifyService.showErrorMessage({
        //     description: "Can't connect to your facebook account",
        //   });
        // }
      },
      {
        config_id: '3405322813086507', // configuration ID goes here
      }
    );
    // }
  }
  // #endregion

  function handleItemClick(e) {
    if (socialList[e.key]?.label === 'Connect Fanpage') {
      socialType.current = 'Facebook';
      onFacebookLogin();
    }
  }

  return (
    <>
      <Card className="page-card add-new">
        <div className="overlay flex-center">
          <ClassicDropdown
            list={socialList}
            handleItemClick={handleItemClick}
            clickTrigger
            hasIcon
          >
            <div className="connect-section flex-center">
              <PlusOutlined />
              <span>Connect new page(s)</span>
            </div>
          </ClassicDropdown>
        </div>
      </Card>

      <SocialPagePopup
        open={open}
        close={() => {
          toggleOpen(false);
        }}
        type={socialType.current}
        listPage={listPage.current}
        listPageConnected={listPageConnected}
      />
    </>
  );
}
