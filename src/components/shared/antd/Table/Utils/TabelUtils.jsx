import { useState } from 'react';
import { ReloadOutlined, TableOutlined } from '@ant-design/icons';
import { localStorageService } from '../../../../../services/localStorageService';
import { Checker } from '../../../../../utils/dataChecker';
import useEffectOnce from '../../../../hooks/useEffectOnce';
import useUpdateEffect from '../../../../hooks/useUpdateEffect';
import WithCheckbox from '../../Dropdown/WithCheckbox';
import ImportDrawer from '../Drawer/ImportDrawer';
import IconButton from '../../../element/Button/IconButton';
import NewButton from '../../../element/Button/NewButton';
import DeleteButton from '../../../element/Button/DeleteButton';
import ImportButton from '../../../element/Button/ImportButton';
import ExportButton from '../../../element/Button/ExportButton';

export default function TabelUtils(props) {
  const {
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

  // get the current path
  const path = window.location.pathname;
  // add column to the localstorage
  useEffectOnce(() => {
    const dataFromLocal =
      localStorageService.getItem('table-columns');
    // if it not empty, have to check the list
    if (!Checker.isNullOrEmpty(dataFromLocal)) {
      const columnLocal = JSON.parse(dataFromLocal);
      // if the column want to add (columnList) not exist, then add new
      if (
        columnLocal?.filter((x) =>
          Checker.isEqualArrays(x.col, columnList)
        )?.length === 0
      ) {
        localStorageService.setItem(
          'table-columns',
          JSON.stringify([
            ...columnLocal,
            { path: path, col: columnList },
          ])
        );
      }
    }
    // if it empty, add new array col
    else {
      localStorageService.setItem(
        'table-columns',
        JSON.stringify([{ path: path, col: columnList }])
      );
    }
  });
  // get column from the localstorage
  // make sure when the columnList change, the column display in dropdown will be the same
  const colSuitableWithPath = JSON.parse(
    localStorageService.getItem('table-columns')
  )?.filter((x) => x.path === path)[0];
  // the origin one (this can't be change)
  const originCol = colSuitableWithPath?.col;
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
          <ImportButton
            onClick={() => {
              setOpenImport(true);
            }}
          />
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
        tableColumn={importColumns}
      />
    </>
  );
}
