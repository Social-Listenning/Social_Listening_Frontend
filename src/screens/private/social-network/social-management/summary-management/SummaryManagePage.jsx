import PieChart from '../../../../../components/shared/antd/Chart/PieChart';
import DoubleLineChart from '../../../../../components/shared/antd/Chart/DoubleLineChart';

export default function SummaryManagePage({ pageId, socialPage }) {
  
  return (
    <div className="summary-container">
      <DoubleLineChart />
      <div className="flex-center pie-container">
        <div className="pie-summary">
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
        <div className="pie-summary">
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
      </div>
    </div>
  );
}
