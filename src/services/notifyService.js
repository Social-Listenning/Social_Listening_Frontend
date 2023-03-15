import { notification } from 'antd';

notification.config({
  maxCount: 5,
  duration: 3,
  placement: 'bottomRight',
});

const showSucsessMessage = (title, description) => {
  notification.open({
    message: title ?? 'Success',
    description: description,
    style: {
      backgroundColor: 'var(--success-color)',
    }
  });
};

const showErrorMessage = (title, description) => {
  notification.open({
    message: title ?? 'Error',
    description: description,
    style: {
      backgroundColor: 'var(--error-color)',
    }
  });
};

const showWarningMessage = (title, description) => {
  notification.open({
    message: title ?? 'Warning',
    description: description,
    style: {
      backgroundColor: 'var(--warning-color)',
    }
  });
};

export const notifyService = {
  showErrorMessage,
  showWarningMessage,
  showSucsessMessage,
};
