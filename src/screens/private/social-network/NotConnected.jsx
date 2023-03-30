import { useEffect } from 'react';
import { Button } from 'antd';
import {
  FacebookFilled,
  TwitterSquareFilled,
} from '@ant-design/icons';
import Hint from '../../../components/shared/element/Hint';
import './socialNetwork.scss';

export default function NotConnected({ connect }) {
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        // This is App ID
        appId: '594535438672562',
        cookie: true,
        xfbml: true,
        version: 'v14.0',
      });

      window.FB.AppEvents.logPageView();

      window.FB.getLoginStatus(function (response) {
        console.log(response);
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

  const onFacebookLogin = () => {
    window.FB.login(
      function (response) {
        console.log(response);
      },
      {
        config_id: '3405322813086507', // configuration ID goes here
      }
    );
  };

  return (
    <div className="not-connected flex-center">
      <Hint message="You are not connected to any social medias. You can connect to following social medias." />
      <Button
        className="flex-center"
        type="primary"
        icon={<FacebookFilled />}
        onClick={onFacebookLogin}
      >
        Login with Facebook
      </Button>
      <Button
        className="flex-center"
        type="primary"
        icon={<TwitterSquareFilled />}
      >
        Login with Twitter
      </Button>
    </div>
  );
}
