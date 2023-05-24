import PieChart from '../../../../../components/shared/antd/Chart/PieChart';
import DoubleLineChart from '../../../../../components/shared/antd/Chart/DoubleLineChart';

export default function SummaryManagePage({ pageId, socialPage }) {
  return (
    <div>
      <DoubleLineChart />
      <PieChart
        pieData={[
          {
            type: 'bad one',
            value: 3,
          },
          {
            type: 'good one',
            value: 10,
          },
        ]}
      />
      <PieChart
        pieData={[
          {
            type: 'bad one',
            value: 3,
          },
          {
            type: 'good one',
            value: 10,
          },
        ]}
      />
    </div>
  );
}
