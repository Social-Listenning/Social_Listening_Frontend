import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { unassignUserFromTab } from '../../socialNetworkService';
import { RoleChip } from '../../../../../components/shared/element/Chip';
import { role } from '../../../../../constants/environment/environment.dev';
import environment from '../../../../../constants/environment/environment.dev';
import BooleanRow from '../../../../../components/shared/element/BooleanRow';
import DateTimeFormat from '../../../../../components/shared/element/DateTimeFormat';
import AdminTable from '../../../../../components/shared/antd/Table/Table';
import ElementWithPermission from '../../../../../components/shared/element/ElementWithPermission';
import ToolTipWrapper from '../../../../../components/shared/antd/ToolTipWrapper';
import AssignButton from '../../../../../components/shared/element/Button/AssignButton';
import { notifyService } from '../../../../../services/notifyService';

export default function MemberManagePage({ pageId, socialPage }) {
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData('userData');

  const columns = [
    {
      title: 'Email',
      dataIndex: 'user.email',
      required: true,
      fixed: true,
    },
    {
      title: 'Active',
      dataIndex: 'user.isActive',
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
        options: role?.filter((item) => item.label !== 'Admin'),
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
      dataIndex: 'user.userName',
    },
    {
      title: 'Gender',
      dataIndex: 'user.gender',
    },
    {
      title: 'Full Name',
      dataIndex: 'user.fullName',
    },
    {
      title: 'Phone',
      dataIndex: 'user.phoneNumber',
    },
    {
      title: 'Date Created',
      dataIndex: 'user.createdAt',
      render: (record) => {
        return <DateTimeFormat dateTime={record} />;
      },
      filter: {
        filterType: 'DateTime',
      },
      onCell: () => ({
        className: 'text-center',
      }),
    },
    {
      title: 'Date Modified',
      dataIndex: 'user.updatedAt',
      render: (record) => {
        return <DateTimeFormat dateTime={record} />;
      },
      filter: {
        filterType: 'DateTime',
      },
      onCell: () => ({
        className: 'text-center',
      }),
    },
  ];

  const permission = {
    table: 'table-user-in-tab',
  };

  const [selectedRows, setSelectedRows] = useState([]);
  function getSelectedRows(rows) {
    setSelectedRows(rows);
  }

  const useUnassignUser = useMutation(unassignUserFromTab, {
    onSuccess: (resp) => {
      if (resp) {
        notifyService.showSucsessMessage({
          description: 'Unassign users successfully',
        });

        document.getElementById('refresh-table')?.click();
      }
    },
  });

  const customToolbar = (
    <>
      <ElementWithPermission permission="assign-user">
        <ToolTipWrapper tooltip="Select users/rows first to unassign">
          <div>
            <AssignButton
              onClick={() => {
                if (
                  selectedRows?.length === 1 &&
                  selectedRows[0]?.user?.id === userData?.id
                ) {
                  notifyService.showWarningMessage({
                    description: 'You can not unassign yourself',
                  });
                } else {
                  useUnassignUser.mutate({
                    users: selectedRows
                      ?.filter(
                        (item) => item?.user?.id !== userData?.id
                      )
                      ?.map((item) => {
                        return item?.user?.id;
                      }),
                    tabs: [pageId],
                  });
                }
              }}
              disabled={!selectedRows?.length}
              unassign={'true'}
            />
          </div>
        </ToolTipWrapper>
      </ElementWithPermission>
    </>
  );

  return (
    <AdminTable
      apiGetData={`${environment.user}/tab/${pageId}`}
      columns={columns}
      permission={permission}
      scroll={{ x: 2000 }}
      getSelectedRows={getSelectedRows}
      customToolbar={customToolbar}
    />
  );
}
