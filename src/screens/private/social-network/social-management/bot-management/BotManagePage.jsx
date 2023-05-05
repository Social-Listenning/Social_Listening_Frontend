import { useState, useRef } from 'react';
import { useMutation } from 'react-query';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { notifyService } from '../../../../../services/notifyService';
import {
  deleteDialogflowBot,
  useGetDialogflowIntents,
  useGetListDialogflowBot,
} from '../../socialNetworkService';
import useEffectOnce from '../../../../../components/hooks/useEffectOnce';
import useUpdateEffect from '../../../../../components/hooks/useUpdateEffect';
import ToolTipWrapper from '../../../../../components/shared/antd/ToolTipWrapper';
import AdminTable from '../../../../../components/shared/antd/Table/Table';
import BooleanRow from '../../../../../components/shared/element/BooleanRow';
import ElementWithPermission from '../../../../../components/shared/element/ElementWithPermission';
import AddEditBot from './AddEditBot';
import AddEditIntent from './AddEditIntent';

export default function BotManagePage({ pageId, socialPage }) {
  const getData = useRef(true);
  const [_, forceUpdate] = useState(null);
  const [botSelected, setBotSelected] = useState(null);

  const botColumns = [
    {
      title: 'Name',
      dataIndex: 'display_name',
      render: (record, value) => {
        return (
          <ToolTipWrapper tooltip="Click to edit bot's intent">
            <b
              className="pointer full-width"
              onClick={(e) => {
                let id = null;
                if (value) {
                  const splitName = value?.name?.split('/');
                  id = splitName[splitName?.length - 1];
                }
                getData.current = true;
                setBotSelected(id);
              }}
            >
              {record}
            </b>
          </ToolTipWrapper>
        );
      },
      width: 300,
    },
    {
      title: 'Language',
      dataIndex: 'default_language_code',
      onCell: () => ({
        className: 'text-center',
      }),
    },
    {
      title: 'Time Zone',
      dataIndex: 'time_zone',
      onCell: () => ({
        className: 'text-center',
      }),
    },
  ];
  const intentColumns = [
    {
      title: 'Name',
      dataIndex: 'display_name',
      fixed: true,
    },
    {
      title: 'Fallback',
      dataIndex: 'is_fallback',
      filter: {
        filterType: 'Boolean',
      },
      render: (record) => {
        return <BooleanRow active={record} />;
      },
      onCell: () => ({
        className: 'text-center',
      }),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      onCell: () => ({
        className: 'text-center',
      }),
    },
  ];
  const [columns, setColumns] = useState(botColumns);
  useUpdateEffect(() => {
    if (botSelected) {
      setColumns(intentColumns);
    } else {
      setColumns(botColumns);
    }
  }, [botSelected]);

  const { data: botList, isFetching: botFetching } =
    useGetListDialogflowBot(getData.current && !botSelected);

  const { data: intentList, isFetching: intentFetching } =
    useGetDialogflowIntents(
      botSelected,
      getData.current && botSelected?.length > 0
    );
  getData.current = false;

  let data = botList;
  if (botSelected) {
    data = intentList;
  }

  useEffectOnce(() => {
    document
      .getElementById('refresh-table')
      ?.addEventListener('click', (e) => {
        getData.current = true;
        forceUpdate(e);
      });
  });

  const permission = {
    table: 'table-workflow',
    new: 'create-workflow',
    edit: 'update-workflow',
    delete: 'delete-workflow',
  };

  const useDeleteBot = useMutation(deleteDialogflowBot, {
    onSuccess: (resp) => {
      if (resp) {
        notifyService.showSucsessMessage({
          description: 'Delete bot successfully',
        });
      }
    },
  });

  const onClickDelete = async (row) => {
    let id = null;
    if (row) {
      const splitName = row?.name?.split('/');
      id = splitName[splitName?.length - 1];
    }

    await useDeleteBot.mutateAsync(id);
  };

  const customToolbar = (
    <>
      {botSelected && (
        <div>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => {
              setBotSelected(null);
            }}
            disabled={intentFetching}
          >
            Go back
          </Button>
        </div>
      )}
    </>
  );

  return (
    <AdminTable
      columns={columns}
      tableData={data?.map((item, index) => {
        return { ...item, key: index };
      })}
      isLoading={
        !botSelected
          ? botFetching || useDeleteBot.isLoading
          : intentFetching
      }
      permission={permission}
      addEditComponent={
        !botSelected ? (
          <AddEditBot />
        ) : (
          <AddEditIntent agentId={botSelected} />
        )
      }
      deleteOneRow={onClickDelete}
      customToolbar={customToolbar}
      disableSelect
    />
  );
}
