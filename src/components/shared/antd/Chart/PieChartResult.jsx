import { Pie } from '@ant-design/plots';
import { Modal } from 'antd';
import './pie.scss'

export default function PieChartResult(props) {
  const { open, toggleOpen, title, result } = props;

  const data = [
    {
      type: 'Success',
      value: result?.success,
    },
    {
      type: 'Fail',
      value: result?.fail,
    },
  ];

  const config = {
    data,
    appendPadding: 10,
    legend: true,
    angleField: 'value',
    colorField: 'type',
    radius: 0.75,
    color: ['#28a745', '#da4c3b'],
    label: {
      type: 'spider',
      labelHeight: 40,
      content: '{name}\n{percentage}',
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
  };

  return (
    <Modal
      destroyOnClose
      open={open}
      title={title}
      footer={null}
      maskClosable={false}
      onCancel={() => {
        toggleOpen(false);
      }}
    >
      <Pie {...config} />
      <div className="pie-footer">
        <span>Total result: {result?.total ?? result?.success + result?.fail}</span>
        <span>Total success: {result?.success}</span>
        <span>Total fail: {result?.fail}</span>
      </div>
    </Modal>
  );
}
