import { Modal } from 'antd';
import { Converter } from '../utils';

function openConfirmModal(props) {
  const { action, handleConfirm, handleCancel, ...other } = props;

  Modal.confirm({
    title: Converter.toUpperCaseFirstLetter(action),
    content: `Are you sure you want to ${action}?`,
    centered: true,
    onOk: handleConfirm,
    onCancel: handleCancel,
    ...other,
  });
}

function openInfoModal(props) {
  const { message, handleConfirm, handleCancel, ...other } = props;

  Modal.info({
    // title: ,
    content: message,
    centered: true,
    onOk: handleConfirm,
    onCancel: handleCancel,
    ...other,
  });
}

function openWarningModal(props) {
  const { message, handleConfirm, handleCancel, ...other } = props;

  Modal.warning({
    title: `Warning`,
    content: message,
    centered: true,
    onOk: handleConfirm,
    onCancel: handleCancel,
    ...other,
  });
}

function openSuccessModal(props) {
  const { action, handleConfirm, handleCancel, ...other } = props;

  Modal.success({
    title: `Success`,
    content: `${Converter.toUpperCaseFirstLetter(action)} successfully!`,
    centered: true,
    onOk: handleConfirm,
    onCancel: handleCancel,
    ...other,
  });
}

function openErrorModal(props) {
  const { message, handleConfirm, handleCancel, ...other } = props;

  Modal.error({
    title: `Error`,
    content: message,
    centered: true,
    onOk: handleConfirm,
    onCancel: handleCancel,
    ...other,
  });
}

export const modalService = {
  openConfirmModal,
  openWarningModal,
  openInfoModal,
  openSuccessModal,
  openErrorModal,
};
