import { notification } from 'antd';

const showSucsessMessage = (content) => {
  notification.success({
    message: content,
    // description: content,
  });
};

const showErrorMessage = (content) => {
  notification.error({
    // message: 'Error',
    description: content,
  });
};

const showWarningMessage = (content) => {
  notification.warning({
    // message: 'Warning',
    description: content,
  });
};

export const notifyService = {
  showErrorMessage,
  showWarningMessage,
  showSucsessMessage,
};
