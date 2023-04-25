import { useRef } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { CheckOutlined, PoweroffOutlined } from '@ant-design/icons';
import { changeStatusBotFlow } from '../../../socialNetworkService';
import { defaultAction } from '../../../../../../constants/table/action';
import { notifyService } from '../../../../../../services/notifyService';
import AdminTable from '../../../../../../components/shared/antd/Table/Table';
import environment from '../../../../../../constants/environment/environment.dev';
import BooleanRow from '../../../../../../components/shared/element/BooleanRow';
import DateTimeFormat from '../../../../../../components/shared/element/DateTimeFormat';
import AddEditBotFlow from './AddEditBotFlow';

export default function TableBotFlow({ pageId, setFlowDetail }) {
  const currentAction = useRef(null);
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData('userData');

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      required: true,
      fixed: true,
      render: (record, value) => {
        return (
          <b
            className="pointer"
            onClick={() => {
              setFlowDetail(value);
            }}
          >
            {record}
          </b>
        );
      },
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
    },
    {
      title: 'Date Created',
      dataIndex: 'createAt',
      render: (record) => {
        return <DateTimeFormat dateTime={record} />;
      },
      onCell: () => ({
        className: 'text-center',
      }),
    },
  ];

  const permission = {
    table: 'table-workflow',
    new: 'create-workflow',
    delete: 'delete-workflow',
  };

  let additionalList = [
    {
      icon: <CheckOutlined />,
      label: 'Activate',
    },
    {
      icon: <PoweroffOutlined />,
      label: 'Deactivate',
    },
  ];
  if (
    !userData?.permissions?.includes('update-workflow-activation')
  ) {
    additionalList = additionalList?.filter(
      (item) => item?.label !== 'Activate'
    );
    additionalList = additionalList?.filter(
      (item) => item?.label !== 'Deactivate'
    );
  }

  const useChangeStatusFlow = useMutation(changeStatusBotFlow, {
    onSuccess: (resp) => {
      if (resp) {
        notifyService.showSucsessMessage({
          description: `${currentAction.current} bot flow successfully`,
        });
      }
    },
  });

  function handleActionClick(action, data) {
    if (action === 'Activate') {
      currentAction.current = 'Activate';
      useChangeStatusFlow.mutate({
        id: data?.id,
        body: {
          activate: true,
        },
      });
    } else if (action === 'Deactivate') {
      currentAction.current = 'Deactivate';
      useChangeStatusFlow.mutate({
        id: data?.id,
        body: {
          activate: false,
        },
      });
    }
    return true;
  }

  return (
    <AdminTable
      disableSelect
      apiGetData={`${environment.workflow}`}
      apiGetBody={{ tabId: pageId }}
      apiDeleteOne={`${environment.workflow}`}
      keyProps="id"
      columns={columns}
      permission={permission}
      addEditComponent={<AddEditBotFlow pageId={pageId} />}
      actionList={[...defaultAction, ...additionalList]}
      handleActionClick={handleActionClick}
    />
  );
}
