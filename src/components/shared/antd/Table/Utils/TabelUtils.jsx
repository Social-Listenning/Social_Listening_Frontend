import { useState } from 'react';
import { ReloadOutlined, TableOutlined } from '@ant-design/icons';
import { apiService } from '../../../../../services/apiService';
import { Getter } from '../../../../../utils/dataGetter';
import useUpdateEffect from '../../../../hooks/useUpdateEffect';
import WithCheckbox from '../../Dropdown/WithCheckbox';
import ImportDrawer from '../Drawer/ImportDrawer';
import IconButton from '../../../element/Button/IconButton';
import NewButton from '../../../element/Button/NewButton';
import DeleteButton from '../../../element/Button/DeleteButton';
import ImportButton from '../../../element/Button/ImportButton';
import ExportButton from '../../../element/Button/ExportButton';
import ElementWithPermission from '../../../element/ElementWithPermission';

export default function TabelUtils(props) {
  const {
    originColumn,
    columnList,
    apiImport,
    apiExport,
    dumpImportData,
    importColumns,
    updateColumn,
    selectAction,
    openAddEdit,
    showDelete,
    deleteMultiple,
    refreshTable,
    permission,
  } = props;

  // #region display columns section
  // selected value in dropdown
  const [selectedKeys, setSelectedKeys] = useState(
    columnList.map((_, index) => index.toString())
  );

  useUpdateEffect(() => {
    if (selectedKeys?.length !== columnList?.length) {
      setSelectedKeys(columnList.map((_, index) => index.toString()));
    }
  }, [columnList]);

  // the original column cant't be changed
  const originCol = [
    ...originColumn.map((col, index) => {
      col['key'] = index.toString();
      return col;
    }),
  ];
  // the column that will display to UI (this can be change)
  const originFormatCol =
    originCol?.map((x) => x?.title) ??
    columnList?.map((x) => x?.title);
  // #endregion

  // #region drawer section
  const [openImport, setOpenImport] = useState(false);
  // #endregion

  return (
    <>
      <div className="table-toolbars flex-center">
        <ElementWithPermission permission={permission.new}>
          <NewButton
            onClick={() => {
              selectAction('Add');
              openAddEdit(true);
            }}
          />
        </ElementWithPermission>

        <ElementWithPermission permission={permission.import}>
          <ImportButton
            onClick={() => {
              setOpenImport(true);
            }}
          />
        </ElementWithPermission>

        <ElementWithPermission permission={permission.export}>
          <ExportButton
            onClick={() => {
              apiService.post(apiExport).then((resp) => {
                // change data to array buffer
                const uint8Array = new Uint8Array(
                  resp?.result?.fileContents?.data
                );
                const arrayBuffer = uint8Array.buffer;

                // download the file
                Getter.downloadFile(
                  arrayBuffer,
                  'user',
                  resp?.result?.contentType
                );
              });
            }}
          />
        </ElementWithPermission>

        {showDelete && (
          <DeleteButton
            onClick={() => {
              deleteMultiple();
            }}
          />
        )}
      </div>
      <div className="table-utils flex-center">
        <WithCheckbox
          clickTrigger
          list={originFormatCol}
          selectedKeys={selectedKeys}
          handleItemClick={(e) => {
            // hide column
            if (selectedKeys?.includes(e)) {
              // uncheck the column for dropdown
              setSelectedKeys(selectedKeys.filter((x) => x !== e));
              // remove the column from table
              updateColumn(
                columnList?.filter(
                  (x) => x.title !== originFormatCol[e]
                )
              );
            }
            // show column
            else {
              // check the column for dropdown
              setSelectedKeys((old) => {
                return [...old, e].sort();
              });
              // add column back to table
              updateColumn(
                [...columnList, originCol[e]].sort(
                  (a, b) => +a?.key.localeCompare(b?.key)
                )
              );
            }
          }}
        >
          <IconButton
            tooltip="Click to open column display options"
            className="table-utils-icon"
            icon={<TableOutlined className="pointer" />}
          />
        </WithCheckbox>
        <IconButton
          id="refresh-table"
          tooltip="Click to refresh table"
          className="table-utils-icon"
          icon={<ReloadOutlined className="pointer" />}
          onClick={refreshTable}
        />
      </div>
      <ImportDrawer
        open={openImport}
        toggleOpen={setOpenImport}
        apiImport={apiImport}
        dumpImportData={dumpImportData}
        importColumns={importColumns}
      />
    </>
  );
}
