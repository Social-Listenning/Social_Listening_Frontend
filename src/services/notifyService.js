import { notification } from 'antd';
import { HourglassOutlined } from '@ant-design/icons';

notification.config({
  maxCount: 5,
  duration: 3,
  placement: 'bottomRight',
});

const showSucsessMessage = (config) => {
  const { title, description, ...other } = config;

  notification.open({
    message: title ?? 'Success',
    description: description,
    style: {
      backgroundColor: 'var(--success-color)',
    },
    ...other,
  });
};

const showErrorMessage = (config) => {
  const { title, description, ...other } = config;

  notification.open({
    message: title ?? 'Error',
    description: description,
    style: {
      backgroundColor: 'var(--error-color)',
    },
    ...other,
  });
};

const showWarningMessage = (config) => {
  const { title, description, isProcessing, ...other } = config;

  notification.open({
    ...(isProcessing && {
      icon: <HourglassOutlined style={{ color: '#fff' }} />,
    }),
    message: isProcessing
      ? title ?? 'Processing...'
      : title ?? 'Warning',
    description: description,
    style: {
      backgroundColor: 'var(--warning-color)',
    },
    ...other,
  });
};

export const notifyService = {
  showErrorMessage,
  showWarningMessage,
  showSucsessMessage,
};
