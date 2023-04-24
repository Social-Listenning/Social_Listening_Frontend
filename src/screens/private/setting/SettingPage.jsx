import { useState, useRef } from 'react';
import { Input } from 'antd';
import { SaveTwoTone } from '@ant-design/icons';
import { useMutation } from 'react-query';
import { updateSetting, useGetAllSetting } from './settingService';
import { notifyService } from '../../../services/notifyService';
import useEffectOnce from '../../../components/hooks/useEffectOnce';
import AdminTable from '../../../components/shared/antd/Table/Table';
import ElementWithPermission from '../../../components/shared/element/ElementWithPermission';
import ToolTipWrapper from '../../../components/shared/antd/ToolTipWrapper';

export default function SettingPage() {
  const getAllSetting = useRef(true);
  const [_, forceUpdate] = useState(null);

  const { data } = useGetAllSetting(getAllSetting.current);
  getAllSetting.current = false;

  useEffectOnce(() => {
    document
      .getElementById('refresh-table')
      ?.addEventListener('click', (e) => {
        getAllSetting.current = true;
        forceUpdate(e);
      });
  });

  const useUpdateSetting = useMutation(updateSetting, {
    onSuccess: (resp) => {
      if (resp) {
        notifyService.showSucsessMessage({
          description: 'Save setting successfully',
        });
      }
    },
  });

  const columns = [
    {
      title: 'Key',
      dataIndex: 'key',
    },
    {
      title: 'Group',
      dataIndex: 'group',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      width: 500,
      sort: false,
      disableFilter: true,
      render: (text, record) => {
        function handleSave() {
          if (
            record.value !==
            document.getElementById(record?.id)?.value
          ) {
            useUpdateSetting.mutate({
              key: record?.key,
              group: record?.group,
              value: document.getElementById(record?.id)?.value,
            });
          }
        }

        return (
          <>
            <ElementWithPermission
              permission="update-setting"
              fallbackComponent={<>{text}</>}
            >
              <ToolTipWrapper tooltip="You can press enter or unfocus the input to save">
                <Input
                  id={record?.id}
                  defaultValue={text}
                  onBlur={handleSave}
                  onPressEnter={(e) => e.currentTarget.blur()}
                  suffix={
                    <SaveTwoTone
                      onClick={(e) => {
                        e.stopPropagation();
                        document.getElementById(record?.id)?.blur();
                      }}
                    />
                  }
                  style={{ fontSize: 'var(--app-font-size)' }}
                  allowClear
                />
              </ToolTipWrapper>
            </ElementWithPermission>
          </>
        );
      },
    },
  ];

  const permission = {
    table: 'table-setting',
  };

  return (
    <AdminTable
      columns={columns}
      tableData={data}
      permission={permission}
      disableSelect
    />
  );
}
