import { Table } from 'antd';
import { useState, useRef } from 'react';
import { apiService } from '../../../../services/apiService';
import { defaultAction } from '../../../../constants/table/action';
import useEffectOnce from '../../../../hooks/useEffectOnce';
import useUpdateEffect from '../../../../hooks/useUpdateEffect';
import useToggle from '../../../../hooks/useToggle';
import TabelUtils from './TabelUtils';
import TableHeader from './TableHeader';
import TableAction from './TableAction';
import ResizeableTitle from './ResizeableTitle';
import AddEditWrapper from './AddEditWrapper';
import LoadingWrapper from '../LoadingWrapper';
import './table.scss';

export default function AdminTable(props) {
  const {
    columns = [],
    actionList = defaultAction,
    apiGetData,
    apiDeleteOne,
    apiDeleteMultiple,
    addEditComponent,
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
  async function refreshData() {
    if (selectedRowKeys?.length > 0) {
      setSelectedRowKeys([]); // remove the select
    }
    tableContent?.scrollTo(0, 0); // scroll back to 0

    if (apiGetData) {
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
          if (resp?.data?.Data) {
            setData(
              resp.data.Data.map((x, index) => {
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
  const selectedRecord = useRef(null);
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

  return (
    <>
      <TabelUtils
        columnList={columnUtil}
        updateColumn={setColumnUtil}
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
            y: 600,
            // x: 2500,
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
      >
        {addEditComponent}
      </AddEditWrapper>
    </>
  );
}
