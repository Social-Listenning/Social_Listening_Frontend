import { useState, useRef } from 'react';
import { Form } from 'antd';
import { useMutation, useQueryClient } from 'react-query';
import { notifyService } from '../../../../services/notifyService';
import {
  assignPermission,
  getPermissionByScreens,
  getScreens,
} from '../accountService';
import useEffectOnce from '../../../../components/hooks/useEffectOnce';
import AddEditWrapper from '../../../../components/shared/antd/Table/Drawer/AddEditWrapper';
import ToolTipWrapper from '../../../../components/shared/antd/ToolTipWrapper';
import ClassicSelect from '../../../../components/shared/antd/Select/Classic';
import Hint from '../../../../components/shared/element/Hint';

export default function AddEditPermissions(props) {
  const { open, onClose, data, action } = props;

  const [addEditPermissionForm] = Form.useForm();
  const queryClient = useQueryClient();
  const roleData = queryClient.getQueryData('allRole');

  // #region get all screens
  const [screens, setScreens] = useState([]);
  const useGetScreens = useMutation(getScreens, {
    onSuccess: (resp) => {
      if (resp) {
        setScreens(
          resp?.map((item) => {
            return {
              label: item.screen,
              value: item.screen,
            };
          })
        );
      }
    },
  });
  useEffectOnce(() => {
    useGetScreens.mutate();
  });
  // #endregion

  // #region get permission by screen
  const screenSelected = useRef([]);
  function handleSelectScreen(e) {
    screenSelected.current = e;
  }
  const [permissionList, setPermissionList] = useState([]);
  const useGetPermission = useMutation(getPermissionByScreens, {
    onSuccess: (resp) => {
      if (resp) {
        setPermissionList(
          resp?.map((item) => {
            return {
              label: item.displayName,
              value: item.id,
            };
          })
        );
      }
    },
  });
  function getPermissionsByScreen() {
    if (screenSelected.current?.length > 0) {
      useGetPermission.mutate({
        screen: screenSelected.current,
      });
    }
  }
  // #endregion

  const useAssignPermission = useMutation(assignPermission, {
    onSuccess: (resp) => {
      if (resp) {
        notifyService.showSucsessMessage({
          description: 'Assign permissions successfully',
        });
        onClose();
      }
    },
  });
  async function handleFinish(value) {
    if (action === 'Add') {
      delete value.screen;
      useAssignPermission.mutate(value);
    } else if (action === 'Edit') {
    }
  }

  return (
    <AddEditWrapper
      open={open}
      onClose={onClose}
      form={addEditPermissionForm}
    >
      <Hint message="You have to choose screens to get permissions" />
      <br />
      <Form
        form={addEditPermissionForm}
        name="add-edit-user-form"
        layout="vertical"
        autoComplete="off"
        onFinish={handleFinish}
      >
        <Form.Item
          label="Role"
          name="roleId"
          rules={[
            {
              required: true,
              message: 'Role is required',
            },
          ]}
        >
          <ClassicSelect
            placeholder="Select role..."
            options={roleData?.map((item) => {
              return { label: item.roleName, value: item.id };
            })}
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

        <ToolTipWrapper
          tooltip="You have to choose screens to get permissions"
          placement="left"
        >
          <Form.Item
            label="Permissions"
            name="listPermission"
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
              loading={useGetPermission.isLoading}
            />
          </Form.Item>
        </ToolTipWrapper>
      </Form>
    </AddEditWrapper>
  );
}
