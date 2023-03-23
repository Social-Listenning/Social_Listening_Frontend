import { useState, useRef } from 'react';
import { Form, Input } from 'antd';
import { role } from '../../../../constants/profile/profile';
import { apiService } from '../../../../services/apiService';
import { notifyService } from '../../../../services/notifyService';
import useEffectOnce from '../../../../components/hooks/useEffectOnce';
import AddEditWrapper from '../../../../components/shared/antd/Table/Drawer/AddEditWrapper';
import ToolTipWrapper from '../../../../components/shared/antd/ToolTipWrapper';
import ClassicSelect from '../../../../components/shared/antd/Select/Classic';

export default function AddEditPermissions(props) {
  const { open, onClose, data, action } = props;

  const [addEditPermissionForm] = Form.useForm();

  async function handleFinish(data) {
    // toggleLoading(true);
    setTimeout(() => {
      
      console.log(data);
    }, 5000);
    // toggleLoading(false);
  }

  // #region get all screens
  const [screens, setScreens] = useState([]);
  useEffectOnce(() => {
    try {
      apiService.post('/permission/get-screens').then((resp) => {
        if (resp?.result) {
          setScreens(
            resp.result.map((item) => {
              return {
                label: item.screen,
                value: item.screen,
              };
            })
          );
        }
      });
    } catch (ex) {
      notifyService.showErrorMessage({
        description: ex.message,
      });
    }
  });
  // #endregion

  // #region get permission by screen
  const screenSelected = useRef([]);
  function handleSelectScreen(e) {
    screenSelected.current = e;
  }
  const [permissionList, setPermissionList] = useState([]);
  async function getPermissionsByScreen() {
    if (screenSelected.current?.length > 0) {
      await apiService
        .post('/permission/find-permission', {
          screen: screenSelected.current,
        })
        .then((resp) => {
          if (resp?.result) {
            setPermissionList(
              resp.result.map((item) => {
                return {
                  label: item.displayName,
                  value: item.id,
                };
              })
            );
          }
        });
    }
  }
  // #endregion

  return (
    <AddEditWrapper
      open={open}
      onClose={onClose}
      form={addEditPermissionForm}
    >
      <Form
        form={addEditPermissionForm}
        name="add-edit-user-form"
        layout="vertical"
        autoComplete="off"
        onFinish={handleFinish}
      >
        <Form.Item
          label="Role"
          name="role"
          rules={[
            {
              required: true,
              message: 'Role is required',
            },
          ]}
        >
          <ClassicSelect
            placeholder="Select role..."
            options={role}
          />
        </Form.Item>

        <Form.Item
          label="Screens"
          name="screen"
          rules={[
            {
              required: true,
              message: 'Screen(s) is required',
            },
          ]}
        >
          <ClassicSelect
            multiple
            placeholder="Select screens..."
            options={screens}
            onChange={handleSelectScreen}
            onBlur={getPermissionsByScreen}
          />
        </Form.Item>

        <Form.Item
          label="Permissions"
          name="permission"
          rules={[
            {
              required: true,
              message: 'Permission(s) is required',
            },
          ]}
        >
          <ClassicSelect
            multiple
            filterLabel
            placeholder="Select permissions..."
            options={permissionList}
          />
        </Form.Item>
      </Form>
    </AddEditWrapper>
  );
}
