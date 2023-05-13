import { useRef, useState } from 'react';
import { PoweroffOutlined, CheckOutlined } from '@ant-design/icons';
import { useQueryClient, useMutation } from 'react-query';
import { useGetSocialGroups } from '../../../../screens/private/social-network/socialNetworkService';
import { role } from '../../../../constants/environment/environment.dev';
import { RoleChip } from '../../../../components/shared/element/Chip';
import { defaultAction } from '../../../../constants/table/action';
import { activateUser, deactivateUser } from '../accountService';
import { notifyService } from '../../../../services/notifyService';
import useToggle from '../../../../components/hooks/useToggle';
import environment from '../../../../constants/environment/environment.dev';
import AdminTable from '../../../../components/shared/antd/Table/Table';
import BooleanRow from '../../../../components/shared/element/BooleanRow';
import DateTimeFormat from '../../../../components/shared/element/DateTimeFormat';
import AssignButton from '../../../../components/shared/element/Button/AssignButton';
import ElementWithPermission from '../../../../components/shared/element/ElementWithPermission';
import AddEditUser from './AddEditUser';
import AssignUserModal from './AssignUserModal';
import ToolTipWrapper from '../../../../components/shared/antd/ToolTipWrapper';

export default function UserManagement(props) {
  const { defaultFilter } = props;

  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData('userData');

  const firstRender = useRef(true);
  const { data } = useGetSocialGroups(firstRender.current);
  firstRender.current = false;

  const [selectedRows, setSelectedRows] = useState([]);
  function getSelectedRows(rows) {
    setSelectedRows(rows);
  }

  const [openAssign, toggleOpenAssign] = useToggle(false);
  function handleAssignUser() {
    toggleOpenAssign(true);
  }

  let formatRole = role;
  if (userData?.role !== 'ADMIN') {
    formatRole = role.filter((item) => item.label !== 'Admin');
  }

  let apiGetData = environment.user;
  if (userData?.role === 'OWNER') {
    apiGetData += '/all';
  }

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      required: true,
      fixed: true,
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      filter: {
        filterType: 'Boolean',
      },
      render: (record) => {
        return <BooleanRow active={record} />;
      },
      onCell: () => ({
        className: 'text-center',
      }),
      sort: false,
      resizeable: false,
      width: 100,
    },
    {
      title: 'Role',
      dataIndex: 'role.roleName',
      sort: false,
      filter: {
        filterType: 'Dropdown',
        options: formatRole,
      },
      render: (record) => {
        return <RoleChip currentRole={record} />;
      },
      onCell: () => ({
        className: 'text-center',
      }),
    },
    {
      title: 'User Name',
      dataIndex: 'userName',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
    },
    {
      title: 'Date Created',
      dataIndex: 'createdAt',
      render: (record) => {
        return <DateTimeFormat dateTime={record} />;
      },
      filter: {
        filterType: 'DateTime',
      },
			onCell: () => ({
				className: "text-center",
			}),
    },
    {
      title: 'Date Modified',
      dataIndex: 'updatedAt',
      render: (record) => {
        return <DateTimeFormat dateTime={record} />;
      },
      filter: {
        filterType: 'DateTime',
      },
			onCell: () => ({
				className: "text-center",
			}),
    },
  ];

  const permission = {
    table: 'table-user',
    new: 'create-user',
    ...(userData?.role === 'OWNER' && { import: 'import-user' }),
    export: 'export-user',
    edit: 'update-user',
    delete: 'remove-user',
  };

  const importColumns = [
    {
      title: 'Email',
      dataIndex: 'email',
      required: true,
    },
    {
      title: 'Password',
      dataIndex: 'password',
      required: true,
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
    },
    {
      title: 'User Name',
      dataIndex: 'userName',
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
    },
  ];

  const dumpImportData = [
    {
      email: 'user1@gmail.com',
      password: 'secret-password',
    },
    {
      email: 'user2@gmail.com',
      password: 'secret-password',
    },
    {
      email: 'user3@gmail.com',
      password: 'secret-password',
    },
    {
      email: 'user4@gmail.com',
      password: 'secret-password',
    },
    {
      email: 'user5@gmail.com',
      password: 'secret-password',
    },
  ];

  const customToolbar = (
    <>
      {userData?.role === 'OWNER' && (
        <ElementWithPermission permission="assign-user">
          <ToolTipWrapper tooltip="Select users/rows first to assign">
            <div>
              <AssignButton
                onClick={handleAssignUser}
                disabled={!selectedRows?.length}
              />
            </div>
          </ToolTipWrapper>
        </ElementWithPermission>
      )}
    </>
  );

  const useActivateUser = useMutation(activateUser, {
    onSuccess: (resp) => {
      if (resp) {
        notifyService.showSucsessMessage({
          description: 'Activate successfully',
        });
      }
    },
  });

  const useDeactivateUser = useMutation(deactivateUser, {
    onSuccess: (resp) => {
      if (resp) {
        notifyService.showSucsessMessage({
          description: 'Deactivate successfully',
        });
      }
    },
  });

  let additionalList = [
    ...defaultAction.filter((item) => {
      if (userData?.role === 'ADMIN') {
        return item?.label !== 'Delete';
      } else {
        return item;
      }
    }),
    {
      icon: <CheckOutlined />,
      label: 'Activate',
    },
    {
      icon: <PoweroffOutlined />,
      label: 'Deactivate',
    },
  ];
  if (!userData?.permissions?.includes('activate-user')) {
    additionalList = additionalList?.filter(
      (item) => item?.label !== 'Activate'
    );
  }
  if (!userData?.permissions?.includes('deactivate-user')) {
    additionalList = additionalList?.filter(
      (item) => item?.label !== 'Deactivate'
    );
  }

  function handleActionClick(action, data) {
    if (action === 'Activate') {
      useActivateUser.mutate(data?.id);
    } else if (action === 'Deactivate') {
      useDeactivateUser.mutate(data?.id);
    }
    return true;
  }

  return (
    <>
      <AdminTable
        apiGetData={apiGetData}
        apiImport={`${environment.user}/import`}
        apiExport={`${environment.user}/export`}
        apiDeleteOne={`${environment.user}/remove`}
        keyProps="id"
        columns={columns}
        importColumns={importColumns}
        dumpImportData={dumpImportData}
        addEditComponent={<AddEditUser />}
        permission={permission}
        defaultFilter={defaultFilter}
        customToolbar={customToolbar}
        actionList={[...additionalList]}
        handleActionClick={handleActionClick}
        getSelectedRows={getSelectedRows}
        scroll={{ x: 2000 }}
      />

      {openAssign && (
        <AssignUserModal
          open={openAssign}
          close={() => {
            toggleOpenAssign(false);
          }}
          userList={selectedRows}
          socialList={data}
        />
      )}
    </>
  );
}
