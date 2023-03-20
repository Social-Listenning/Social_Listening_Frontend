import { useRef, useState } from 'react';
import { Table } from 'antd';
import { ArrowRightOutlined, DownOutlined } from '@ant-design/icons';
import useEffectOnce from '../../../../hooks/useEffectOnce';
import useUpdateEffect from '../../../../hooks/useUpdateEffect';
import ClassicDropdown from '../../Dropdown/Classic';
import ToolTipWrapper from '../../ToolTipWrapper';

export default function TableMapData(props) {
  const { excelHeader = [], systemCol = [], previewCol = [], getColMapped } = props;

  const cellIndex = useRef(null);
  const [dataSource, setDataSource] = useState([]);
  const columns = [
    {
      title: 'System Property',
      dataIndex: 'systemCol',
      key: 'systemCol',
      render: (text, record) => {
        let className = 'mapped-row flex-center';
        if (systemCol[record.key]?.required) {
          className += ' required-column';
          if (!record.excelHeader) {
            className += ' error-column';
          }
        }
        return (
          <ToolTipWrapper
            tooltip={
              systemCol[record.key]?.required
                ? 'This column is required'
                : ''
            }
            placement="left"
          >
            <div className={className}>{text}</div>
          </ToolTipWrapper>
        );
      },
      onCell: () => {
        return {
          style: { padding: '0 1.6rem' },
        };
      },
    },
    {
      title: 'Header From Excel',
      dataIndex: 'excelHeader',
      key: 'excelHeader',
      render: (text) => (
        <ToolTipWrapper
          tooltip="Click to choose excel column"
          placement="left"
        >
          <div>
            <ClassicDropdown
              clickTrigger
              noneOption
              list={excelHeader?.filter((x) => x !== text)}
              handleItemClick={(e) => {
                dataSource[cellIndex.current].excelHeader =
                  excelHeader.filter((x) => x !== text)[e.key];

                setDataSource([...dataSource]);
                getColMapped([...dataSource]);
              }}
            >
              <div className="pointer flex-center mapped-row">
                <span style={{ flex: '1' }}>{text}</span>
                <DownOutlined style={{ fontSize: '1rem' }} />
              </div>
            </ClassicDropdown>
          </div>
        </ToolTipWrapper>
      ),
      onCell: (_, index) => {
        return {
          style: { padding: '0 1.6rem' },
          onClick: () => {
            cellIndex.current = index;
          },
        };
      },
    },
    {
      title: 'Preview',
      dataIndex: 'previewCol',
      key: 'previewCol',
    },
  ];

  // #region map data from excel to table
  // lower case and remove all the space to compare
  function formatString(str) {
    return str?.toLowerCase()?.replace(/\s/g, '');
  }

  // compare excelHeader and systemCol
  function mapLeftToRight(left, right) {
    const formatLeft = formatString(left);
    const formatRight = formatString(right);
    return (
      formatLeft === formatRight ||
      formatLeft.indexOf(formatRight) !== -1 ||
      formatRight.indexOf(formatLeft) !== -1
    );
  }

  // push data to table
  function getDataSource() {
    if (excelHeader?.length > 0 && systemCol?.length > 0) {
      let dumpData = [];
      for (let i = 0; i < systemCol.length; i++) {
        let excelHeaderData = excelHeader.filter((item) =>
          mapLeftToRight(item, systemCol[i]?.title)
        )[0];

        dumpData.push({
          key: i,
          excelHeader: excelHeaderData,
          systemCol: systemCol[i]?.title,
          previewCol: previewCol[excelHeaderData]
        });
      }
      console.log(dumpData)
      setDataSource(dumpData);
      getColMapped(dumpData);
    }
  }

  useEffectOnce(() => {
    getDataSource();
  });

  useUpdateEffect(() => {
    getDataSource();
  }, [excelHeader]);
  // #endregion

  return (
    <Table
      bordered
      columns={columns}
      dataSource={dataSource}
      pagination={false}
    />
  );
}
