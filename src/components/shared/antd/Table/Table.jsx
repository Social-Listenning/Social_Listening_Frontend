import { cloneElement } from 'react';
import { Table } from 'antd';
import { useState, useRef } from 'react';
import { apiService } from '../../../../services/apiService';
import { notifyService } from '../../../../services/notifyService';
import { defaultAction } from '../../../../constants/table/action';
import { useGetDecodedToken } from '../../../../routes/private/privateService';
import useEffectOnce from '../../../hooks/useEffectOnce';
import useUpdateEffect from '../../../hooks/useUpdateEffect';
import useToggle from '../../../hooks/useToggle';
import ElementWithPermission from '../../element/ElementWithPermission';
import TableHeader from './Header/TableHeader';
import ResizeableTitle from './Header/ResizeableTitle';
import TabelUtils from './Utils/TabelUtils';
import TableAction from './Utils/TableAction';
import LoadingWrapper from '../LoadingWrapper';
import TableToolbar from './Utils/TableToolbar';
import './table.scss';

export default function AdminTable(props) {
  const {
    columns = [],
    tableData,
    importColumns = columns,
    dumpImportData = [],
    actionList = defaultAction,
    apiGetData,
    apiGetBody,
    apiDeleteOne,
    apiDeleteMultiple,
    apiImport,
    apiExport,
    addEditComponent = <></>,
    keyProps = columns[0]?.dataIndex, // for delete purpose
    scroll,
    permission = {},
    handleActionClick,
    defaultFilter = [],
    customToolbar,
    disableSelect = false,
    getSelectedRows,
    isLoading = false,
    deleteOneRow,
    showToolbar = true,
    showTableUtils = true,
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
  const [dataSource, setDataSource] = useState(tableData);
  const [filterType, setFilterType] = useState(defaultFilter);
  const [sorter, setSorter] = useState([]);
  const [loading, toggleLoading] = useToggle(isLoading); // loading state
  const tableContent = document.querySelector('.ant-table-content'); // table selector (for javascript purpose)
  // get all the props that was nested (example: role.roleName)
  let originPropsNested = columns
    .filter((x) => x.dataIndex.includes('.'))
    .map((x) => x.dataIndex);

  useEffectOnce(() => {
    // only call API when had table
    if (document.getElementById('admin-table')) {
      refreshData();
    }
  });

  // make sure when the tableData change table auto update
  useUpdateEffect(() => {
    if (tableData) {
      setDataSource(tableData);
    }
  }, [tableData]);

  useUpdateEffect(() => {
    toggleLoading(isLoading);
  }, [isLoading]);

  useUpdateEffect(() => {
    refreshData();
  }, [filterType, sorter]);

  // refresh table
  async function refreshData(resetData = true) {
    // remove the select
    if (selectedRowKeys?.length > 0) {
      getSelectedRows([]);
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
            size: 10000,
            pageNumber: 1,
            totalElement: 10000,
            ...apiGetBody,
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
              setDataSource(
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
  async function onClickDelete(row) {
    if (row) {
      if (apiDeleteOne) {
        const key = row[keyProps]; // get value with object key

        try {
          let formatEndpoint = apiDeleteOne;
          if (apiDeleteOne?.includes('key')) {
            formatEndpoint = formatEndpoint?.replace('key', key);
          } else {
            formatEndpoint = `${apiDeleteOne}/${key}`;
          }

          apiService.post(formatEndpoint).then((resp) => {
            if (resp?.result) {
              notifyService.showSucsessMessage({
                description: 'Delete successfully',
              });
              refreshData();
            }
          });
        } catch (ex) {
          notifyService.showErrorMessage({
            description: ex.message,
          });
        }
      }
      if (deleteOneRow) {
        await deleteOneRow(row);
        document.getElementById('refresh-table')?.click();
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
    document.getElementById('refresh-table').click();
    actionType.current = null;
    selectedRecord.current = null;
  }

  function selectAction(action) {
    actionType.current = action;
    if (action === 'Add') {
      selectedRecord.current = null;
    }
  }

  // #region format action column with permission
  const { data } = useGetDecodedToken();
  let actionCol = [];
  let formatActionList = actionList;

  // edit permission
  if (!data?.permissions?.includes(permission?.edit)) {
    formatActionList = formatActionList?.filter(
      (item) => item?.label !== 'Edit'
    );
  }
  // delete permission
  if (!data?.permissions?.includes(permission?.delete)) {
    formatActionList = formatActionList?.filter(
      (item) => item?.label !== 'Delete'
    );
  }

  if (formatActionList?.length > 0) {
    actionCol = [
      {
        dataIndex: 'action',
        key: 'action',
        width: 45,
        maxWidth: 45,
        fixed: true,
        resizeable: false,
        render: (_, record) => (
          <TableAction
            actionList={formatActionList}
            selectedRecord={record}
            selectAction={selectAction}
            openAddEdit={() => {
              toggleOpenAddEdit(true);
            }}
            onClickDelete={onClickDelete}
            handleActionClick={handleActionClick}
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
  }
  // #endregion

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
              defaultFilter={defaultFilter.filter(
                (item) => item.props === col.dataIndex
              )}
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
      if (getSelectedRows) {
        getSelectedRows(
          newSelectedRowKeys?.map((row) => {
            return { ...dataSource[row] };
          })
        );
      }
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };
  // #endregion

  return (
    <ElementWithPermission permission={permission.table}>
      {showToolbar && (
        <TableToolbar
          permission={permission}
          selectAction={selectAction}
          openAddEdit={() => {
            toggleOpenAddEdit(true);
          }}
          apiImport={apiImport}
          importColumns={importColumns}
          dumpImportData={dumpImportData}
          apiExport={apiExport}
          showDelete={selectedRowKeys?.length > 0}
          deleteMultiple={onMultipleDelete}
          customToolbar={customToolbar}
        />
      )}

      {showTableUtils && (
        <TabelUtils
          originColumn={columns}
          columnList={columnUtil.current}
          updateColumn={handleDisplayColumns}
          refreshTable={setRefreshFS}
        />
      )}

      <LoadingWrapper size="large" loading={loading}>
        <Table
          id="admin-table"
          size="small"
          columns={resizeColumns}
          dataSource={dataSource}
          scroll={scroll}
          components={{
            header: {
              cell: ResizeableTitle,
            },
          }}
          {...(!disableSelect && { rowSelection: rowSelection })}
          {...other}
        />
      </LoadingWrapper>

      {openAddEdit &&
        cloneElement(addEditComponent, {
          open: openAddEdit,
          onClose: closeAddEdit,
          selectedData: selectedRecord.current,
          action: actionType.current,
        })}
    </ElementWithPermission>
  );
}
