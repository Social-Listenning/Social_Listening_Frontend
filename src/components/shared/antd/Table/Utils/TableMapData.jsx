import { useRef, useState } from 'react';
import { Table } from 'antd';
import { ArrowRightOutlined, DownOutlined } from '@ant-design/icons';
import useEffectOnce from '../../../../hooks/useEffectOnce';
import useUpdateEffect from '../../../../hooks/useUpdateEffect';
import ClassicDropdown from '../../Dropdown/Classic';
import ToolTipWrapper from '../../ToolTipWrapper';

export default function TableMapData(props) {
  const { leftCol = [], rightCol = [], getColMapped } = props;

  const cellIndex = useRef(null);

  const [dataSource, setDataSource] = useState([]);
  const columns = [
    {
      title: 'Excel Columns',
      dataIndex: 'leftCol',
      key: 'leftCol',
      render: (text) => (
        <ToolTipWrapper
          tooltip="Click to open options"
          placement="left"
        >
          <div>
            <ClassicDropdown
              clickTrigger
              noneOption
              list={leftCol?.filter((x) => x !== text)}
              handleItemClick={(e) => {
                dataSource[cellIndex.current].leftCol =
                  leftCol.filter((x) => x !== text)[e.key];

                setDataSource([...dataSource]);
                getColMapped([...dataSource]);
              }}
            >
              <div
                className="pointer flex-center"
                style={{ height: '5rem' }}
              >
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
      dataIndex: 'arrowIcon',
      key: 'arrowIcon',
      render: () => <ArrowRightOutlined />,
      onCell: () => ({
        className: 'text-center',
      }),
    },
    {
      title: 'Origin Columns',
      dataIndex: 'rightCol',
      key: 'rightCol',
      render: (text, record) => {
        let className = '';
        if (rightCol[record.key]?.required) {
          className = 'required-column';
          if (!record.leftCol) {
            className += ' error-column';
          }
        }
        return <div className={className}>{text}</div>;
      },
    },
  ];

  // #region map data from excel to table
  // lower case and remove all the space to compare
  function formatString(str) {
    return str?.toLowerCase()?.replace(/\s/g, '');
  }

  // compare leftCol and rightCol
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
    if (leftCol?.length > 0 && rightCol?.length > 0) {
      let dumbData = [];
      for (let i = 0; i < rightCol.length; i++) {
        let leftColData = leftCol.filter((item) =>
          mapLeftToRight(item, rightCol[i]?.title)
        )[0];

        dumbData.push({
          key: i,
          leftCol: leftColData,
          rightCol: rightCol[i]?.title,
        });
      }
      setDataSource(dumbData);
      getColMapped(dumbData);
    }
  }

  useEffectOnce(() => {
    getDataSource();
  });

  useUpdateEffect(() => {
    getDataSource();
  }, [leftCol]);
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
