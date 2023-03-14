import { notification } from 'antd';

notification.config({
  maxCount: 5,
});

const showSucsessMessage = (content) => {
  notification.success({
    message: content,
    duration: 1.5,
  });
};

const showErrorMessage = (content) => {
  notification.error({
    message: content,
    duration: 1.5,
  });
};

const showWarningMessage = (content) => {
  notification.warning({
    message: content,
    duration: 1.5,
  });
};

export const notifyService = {
  showErrorMessage,
  showWarningMessage,
  showSucsessMessage,
};
