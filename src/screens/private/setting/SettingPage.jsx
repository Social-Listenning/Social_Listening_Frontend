import { useState } from 'react';
import { Input } from 'antd';
import { SaveTwoTone } from '@ant-design/icons';
import { useMutation } from 'react-query';
import { updateSetting } from './settingService';
import { notifyService } from '../../../services/notifyService';
import { apiService } from '../../../services/apiService';
import useEffectOnce from '../../../components/hooks/useEffectOnce';
import environment from '../../../constants/environment/environment.dev';
import AdminTable from '../../../components/shared/antd/Table/Table';
import ElementWithPermission from '../../../components/shared/element/ElementWithPermission';

export default function SettingPage() {
  const [tableData, setTableData] = useState([]);

  useEffectOnce(() => {
    apiService
      .get(`${environment.setting}/getAllSetting`)
      .then((resp) => {
        setTableData(resp);
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
      render: (text, record) => {
        function handleSave() {
          const data = {
            key: record?.key,
            group: record?.group,
            value: document.getElementById(record?.id)?.value,
          };
          useUpdateSetting.mutate(data);
        }

        return (
          <>
            <ElementWithPermission
              permission="update-setting"
              fallbackComponent={<>{text}</>}
            >
              <Input
                id={record?.id}
                defaultValue={text}
                onPressEnter={handleSave}
                suffix={<SaveTwoTone onClick={handleSave} />}
                style={{ fontSize: 'var(--app-font-size)' }}
                allowClear
              />
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
      tableData={tableData}
      permission={permission}
      disableSelect
    />
  );
}
