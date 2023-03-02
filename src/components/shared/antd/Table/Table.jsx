import { Table } from 'antd';
import { useState } from 'react';
import { apiService } from '../../../../services/apiService';
import useEffectOnce from '../../../../hooks/useEffectOnce';
import useUpdateEffect from '../../../../hooks/useUpdateEffect';
import useToggle from '../../../../hooks/useToggle';
import TabelUtils from './TabelUtils';
import TableHeader from './TableHeader';
import TableAction from './TableAction';
import ResizeableTitle from './ResizeableTitle';
import './table.scss';

export default function AdminTable(props) {
  const {
    columns = [],
    data,
    actionList,
    apiGetData,
    apiDeleteOne,
    apiDeleteMultiple,
    keyProps = columns[0]?.dataIndex,
  } = props;

  // #region table utils
  // refresh the filters and sorters
  const [refreshFS, setRefreshFS] = useState(null);
  // user can show/hide columns they want
  const [columnUtil, setColumnUtil] = useState(
    columns.map((col, index) => {
      return {
        ...col,
        key: index.toString(),
      };
    })
  );

  useUpdateEffect(() => {
    if (refreshFS) {
      setResizeCol(formatHeaderCols);
    }
  }, [refreshFS]);

  // display columns
  useUpdateEffect(() => {
    setResizeCol(actionCol.concat(formatHeaders(columnUtil)));
    refreshData();
  }, [columnUtil]);
  // #endregion

  // #region handle filter, sorter, refresh data
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
  async function refreshData() {
    if (selectedRowKeys?.length > 0) {
      setSelectedRowKeys([]); // remove the select
    }
    tableContent?.scrollTo(0, 0); // scroll back to 0

    if (apiGetData) {
      toggleLoading(true);
      await apiService.post(apiGetData, {
        sort: sorter,
        filter: filterType,
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

  function onMultipleDelete(list) {}
  // #endregion

  // #region add filter, action to header
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
          onClickDelete={onClickDelete}
          selectedRecord={record}
        />
      ),
    },
  ];

  const formatHeaderCols = actionCol.concat(
    formatHeaders(columnUtil)
  );

  function formatHeaders(column) {
    return column.map((col) => {
      return {
        resizeable: true, //default header can resize (you can change this if you want)
        ...col,
        title: (
          //custom header with filter, sorter
          <TableHeader
            title={col.title}
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

  return (
    <>
      <TabelUtils
        columnList={columnUtil}
        updateColumn={setColumnUtil}
        refresh={setRefreshFS}
      />
      <Table
        columns={resizeColumns}
        dataSource={data}
        rowSelection={rowSelection}
        size="small"
        scroll={{
          y: 500,
          x: 2500,
        }}
        components={{
          header: {
            cell: ResizeableTitle,
          },
        }}
        loading={loading}
      />
    </>
  );
}
