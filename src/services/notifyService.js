import { notification } from 'antd';

const showSucsessMessage = (content) => {
  notification.success({
    message: content,
    duration: 3,
  });
};

const showErrorMessage = (content) => {
  notification.error({
    message: content,
    duration: 3,
  });
};

const showWarningMessage = (content) => {
  notification.warning({
    message: content,
    duration: 3,
  });
};

export const notifyService = {
  showErrorMessage,
  showWarningMessage,
  showSucsessMessage,
};
