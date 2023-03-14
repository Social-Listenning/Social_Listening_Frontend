import { Table } from 'antd';
import { useState, useRef } from 'react';
import { apiService } from '../../../../services/apiService';
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
    actionList = defaultAction,
    apiGetData,
    apiDeleteOne,
    apiDeleteMultiple,
    apiImport,
    addEditComponent,
    keyProps = columns[0]?.dataIndex,
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
    setResizeCol(actionCol.concat(formatHeaders(newCol)));
    refreshData(false);
  }
  // #endregion

  // #region handle filter, sorter, refresh data
  let maxWidth = 100; // 100 is the select row and action column
  const [data, setData] = useState([]);
  const [filterType, setFilterType] = useState([]);
  const [sorter, setSorter] = useState([]);
  const [loading, toggleLoading] = useToggle(false); // loading state
  const tableContent = document.querySelector('.ant-table-body'); // table selector (for javascript purpose)

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
    tableContent?.scrollTo(0, 0);

    // remove the action and record
    if (actionType.current) {
      actionType.current = null;
      selectedRecord.current = null;
    }

    if (apiGetData && resetData) {
      toggleLoading(true);
      await apiService
        .post(apiGetData, {
          orders: sorter,
          filter: filterType,
          size: 25,
          pageNumber: 1,
          totalElement: 10000,
        })
        .then((resp) => {
          if (resp?.data) {
            setData(
              resp.data.map((x, index) => {
                return {
                  ...x,
                  key: index,
                };
              })
            );
          }
        });
      toggleLoading(false);
    }
  }
  // #endregion

  // #region delete one/multiple row(s)
  function onClickDelete(row) {
    if (row && apiDeleteOne) {
      const key = row[keyProps]; // get value with object key

      apiService
        .delete(`${apiDeleteOne}?${keyProps}=${key}`)
        .then((resp) => {
          if (resp?.result) {
            refreshData();
          }
        });
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

  // remove the record when action is add
  if (actionType === 'Add') {
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

  const formatHeaderCols = actionCol.concat(
    formatHeaders(columnUtil.current)
  );

  function formatHeaders(column) {
    return column.map((col) => {
      maxWidth += col.width ?? 150;
      return {
        ...col,
        resizeable: true, // default header can resize (you can change this if you want)
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
    });
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
  console.log('a');
  return (
    <>
      <TabelUtils
        columnList={columnUtil.current}
        importColumns={importColumns}
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
          columns={resizeColumns}
          dataSource={data}
          rowSelection={rowSelection}
          size="small"
          scroll={{
            // y: 600,
            x: maxWidth,
          }}
          components={{
            header: {
              cell: ResizeableTitle,
            },
          }}
        />
      </LoadingWrapper>
      <AddEditWrapper
        open={openAddEdit}
        toggleOpen={toggleOpenAddEdit}
        record={selectedRecord.current}
        actionType={actionType.current}
      >
        {addEditComponent}
      </AddEditWrapper>
    </>
  );
}
