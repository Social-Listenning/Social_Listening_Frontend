import { DualAxes } from '@ant-design/plots';

export default function DoubleLineChart(props) {
  const { lineChartData = [], xConfig, yConfig, ...other } = props;

  const config = {
    data: [lineChartData, lineChartData],
    xField: xConfig,
    yField: yConfig,
    geometryOptions: [
      {
        geometry: 'line',
        smooth: true,
        color: '#4096ff',
      },
      {
        geometry: 'line',
        color: '#28a745',
        smooth: true,
      },
    ],
    legend: {
      position: 'top-right',
    },
  };
  return <DualAxes {...config} {...other} />;
}
