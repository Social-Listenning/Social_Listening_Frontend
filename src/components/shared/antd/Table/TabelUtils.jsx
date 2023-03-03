import { useState } from 'react';
import { ReloadOutlined, TableOutlined } from '@ant-design/icons';
import { localStorageService } from '../../../../services/localStorageService';
import { Checker } from '../../../../utils/dataChecker';
import useEffectOnce from '../../../../hooks/useEffectOnce';
import WithCheckbox from '../Dropdown/WithCheckbox';
import IconButton from '../Button/IconButton';

export default function TabelUtils(props) {
  const { columnList, updateColumn, refresh } = props;

  // selected value in dropdown
  const [selectedKeys, setSelectedKeys] = useState(
    columnList.map((_, index) => index.toString())
  );

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

  return (
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
            updateColumn((old) => {
              return old?.filter(
                (x) => x.title !== originFormatCol[e]
              );
            });
          }
          // show column
          else {
            // check the column for dropdown
            setSelectedKeys((old) => {
              return [...old, e].sort();
            });
            // add column back to table
            updateColumn((old) => {
              return [...old, originCol[e]].sort(
                (a, b) => +a?.key.localeCompare(b?.key)
              );
            });
          }
        }}
      >
        <IconButton
          tooltip="Display Columns"
          className="table-utils-icon"
          icon={<TableOutlined className="pointer" />}
        />
      </WithCheckbox>
      <IconButton
        tooltip="Refresh Table"
        className="table-utils-icon"
        icon={<ReloadOutlined className="pointer" />}
        onClick={refresh}
      />
    </div>
  );
}
