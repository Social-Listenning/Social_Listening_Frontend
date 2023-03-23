import { useState } from 'react';
import { ReloadOutlined, TableOutlined } from '@ant-design/icons';
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
    dumpImportData,
    importColumns,
    updateColumn,
    selectAction,
    openAddEdit,
    showDelete,
    deleteMultiple,
    refresh,
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
        <NewButton
          onClick={() => {
            selectAction('Add');
            openAddEdit(true);
          }}
        />
        {apiImport && importColumns?.length > 0 && (
          // <ElementWithPermission permission="import">
            <ImportButton
              onClick={() => {
                setOpenImport(true);
              }}
            />
          // </ElementWithPermission>
        )}
        <ExportButton onClick={() => {}} />
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
          tooltip="Click to refresh table"
          className="table-utils-icon"
          icon={<ReloadOutlined className="pointer" />}
          onClick={refresh}
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
