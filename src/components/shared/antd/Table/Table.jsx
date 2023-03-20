import { Table } from 'antd';
import { useState, useRef } from 'react';
import { apiService } from '../../../../services/apiService';
import { notifyService } from '../../../../services/notifyService';
import { defaultAction } from '../../../../constants/table/action';
import useEffectOnce from '../../../hooks/useEffectOnce';
import useUpdateEffect from '../../../hooks/useUpdateEffect';
import useToggle from '../../../hooks/useToggle';
import TableHeader from './Header/TableHeader';
import ResizeableTitle from './Header/ResizeableTitle';
import TabelUtils from './Utils/TabelUtils';
import TableAction from './Utils/TableAction';
import AddEditWrapper from './Drawer/AddEditWrapper';
import LoadingWrapper from '../LoadingWrapper';
import './table.scss';

export default function AdminTable(props) {
  const {
    columns = [],
    importColumns = columns,
    dumpImportData = [],
    actionList = defaultAction,
    apiGetData,
    apiDeleteOne,
    apiDeleteMultiple,
    apiImport,
    addEditComponent = <></>,
    keyProps = columns[0]?.dataIndex, // for delete purpose
    scroll,
    ...other
  } = props;

  // #region table utils
  // refresh the filters and sorters
  const [refreshFS, setRefreshFS] = useState(null);
  // user can show/hide columns they want
  const columnUtil = useRef(
    columns.map((col, index) => {
      return {
        ...col,
        key: index.toString(),
      };
    })
  );

  useUpdateEffect(() => {
    if (refreshFS) {
      handleDisplayColumns(
        columns.map((col, index) => {
          return {
            ...col,
            key: index.toString(),
          };
        })
      );
      setFilterType([]);
      setSorter([]);
    }
  }, [refreshFS]);

  function handleDisplayColumns(newCol) {
    columnUtil.current = newCol;
    setResizeCol(formatHeaders(newCol));
    refreshData(false);
  }
  // #endregion

  // #region handle filter, sorter, refresh data
  const [data, setData] = useState([]);
  const [filterType, setFilterType] = useState([]);
  const [sorter, setSorter] = useState([]);
  const [loading, toggleLoading] = useToggle(false); // loading state
  const tableContent = document.querySelector('.ant-table-content'); // table selector (for javascript purpose)
  // get all the props that was nested (example: role.roleName)
  let originPropsNested = columns
    .filter((x) => x.dataIndex.includes('.'))
    .map((x) => x.dataIndex);

  useEffectOnce(() => {
    refreshData();
  });

  useUpdateEffect(() => {
    refreshData();
  }, [filterType, sorter]);

  // refresh table
  async function refreshData(resetData = true) {
    // remove the select
    if (selectedRowKeys?.length > 0) {
      setSelectedRowKeys([]);
    }

    // scroll back to 0
    tableContent?.scroll(0, 0);

    // remove the action and record
    if (actionType.current) {
      actionType.current = null;
      selectedRecord.current = null;
    }

    if (apiGetData && resetData) {
      toggleLoading(true);
      try {
        await apiService
          .post(apiGetData, {
            orders: sorter,
            filter: filterType,
            size: 25,
            pageNumber: 1,
            totalElement: 10000,
          })
          .then((resp) => {
            if (resp?.result?.data) {
              for (let prop of originPropsNested) {
                resp.result.data.map((x) => {
                  let dataNested = prop
                    .split('.')
                    .reduce(
                      (obj, propertyName) => obj[propertyName],
                      x
                    );
                  x[prop] = dataNested;
                  return x;
                });
              }
              setData(
                resp.result.data.map((x, index) => {
                  return {
                    ...x,
                    key: index,
                  };
                })
              );
            }
          });
      } catch (ex) {
        console.log(ex);
      }
      toggleLoading(false);
    }
  }
  // #endregion

  // #region delete one/multiple row(s)
  function onClickDelete(row) {
    if (row && apiDeleteOne) {
      const key = row[keyProps]; // get value with object key

      try {
        apiService.post(`${apiDeleteOne}/${key}`).then((resp) => {
          if (resp?.result) {
            refreshData();
          }
        });
      } catch (ex) {
        notifyService.showErrorMessage({
          description: ex.message,
        });
      }
    }
  }

  function onMultipleDelete() {
    console.log(selectedRowKeys);
  }
  // #endregion

  // #region add filter, action to header
  const [openAddEdit, toggleOpenAddEdit] = useToggle(false);
  const actionType = useRef(null);
  const selectedRecord = useRef(null);

  function closeAddEdit() {
    toggleOpenAddEdit(false);
    actionType.current = null;
    selectedRecord.current = null;
  }

  function selectAction(action) {
    actionType.current = action;
  }

  const actionCol = [
    {
      dataIndex: 'action',
      key: 'action',
      width: 45,
      maxWidth: 45,
      fixed: true,
      resizeable: false,
      render: (_, record) => (
        <TableAction
          actionList={actionList}
          selectedRecord={record}
          selectAction={selectAction}
          openAddEdit={toggleOpenAddEdit}
          onClickDelete={onClickDelete}
        />
      ),
      onCell: (record, _) => {
        return {
          onClick: () => {
            selectedRecord.current = record;
          },
        };
      },
    },
  ];

  const formatHeaderCols = formatHeaders(columnUtil.current);

  function formatHeaders(column) {
    return actionCol.concat(
      column.map((col) => {
        return {
          resizeable: true, // default header can resize (you can change this if you want)
          ...col,
          width: col.width ?? 150,
          title: (
            // custom header with filter, sorter
            <TableHeader
              title={col.title}
              propsName={col.dataIndex}
              filter={col.filter}
              sort={col.sort}
              disableFilter={col.disableFilter}
              updateSorter={setSorter}
              updateFilter={setFilterType}
              refreshFilterSorter={refreshFS}
            />
          ),
        };
      })
    );
  }
  // #endregion

  // #region resize setup (using react-resizeable)
  const [resizeCol, setResizeCol] = useState(formatHeaderCols);

  const handleResize =
    (index) =>
    (e, { size }) => {
      e.stopImmediatePropagation();
      const newColumns = [...resizeCol];
      newColumns[index] = {
        ...newColumns[index],
        width: size.width,
      };
      setResizeCol(newColumns);
    };

  const resizeColumns = resizeCol.map((col, index) => ({
    ...col,
    onHeaderCell: (column) => ({
      width: column.width,
      minWidth: column.minWidth,
      maxWidth: column.maxWidth,
      ...(column.resizeable && { onResize: handleResize(index) }),
    }),
  }));
  // #endregion

  // #region row selection event
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      // console.log(newSelectedRowKeys);
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };
  // #endregion

  return (
    <>
      <TabelUtils
        originColumn={columns}
        columnList={columnUtil.current}
        importColumns={importColumns}
        dumpImportData={dumpImportData}
        apiImport={apiImport}
        updateColumn={handleDisplayColumns}
        selectAction={selectAction}
        openAddEdit={toggleOpenAddEdit}
        showDelete={selectedRowKeys?.length > 0}
        deleteMultiple={onMultipleDelete}
        refresh={setRefreshFS}
      />
      <LoadingWrapper size="large" loading={loading}>
        <Table
          size="small"
          columns={resizeColumns}
          dataSource={data}
          rowSelection={rowSelection}
          scroll={scroll}
          components={{
            header: {
              cell: ResizeableTitle,
            },
          }}
          {...other}
        />
      </LoadingWrapper>
      <AddEditWrapper
        open={openAddEdit}
        onClose={closeAddEdit}
        record={selectedRecord.current}
        actionType={actionType.current}
      >
        {addEditComponent}
      </AddEditWrapper>
    </>
  );
}
