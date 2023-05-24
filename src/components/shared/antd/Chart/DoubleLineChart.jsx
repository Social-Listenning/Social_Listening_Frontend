import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/plots';

export default function DoubleLineChart(props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    asyncFetch();
  }, []);

  const asyncFetch = () => {
    fetch(
      'https://gw.alipayobjects.com/os/bmw-prod/55424a73-7cb8-4f79-b60d-3ab627ac5698.json'
    )
      .then((response) => response.json())
      .then((json) => {
        setData(json);
      })
      .catch((error) => {
        console.log('fetch data failed', error);
      });
  };
  const config = {
    data: data
      .slice(data.length - 90, data.length)
      .filter(
        (item) =>
          item.category === 'Gas fuel' ||
          item.category === 'Cement production'
      ),
    xField: 'year',
    yField: 'value',
    seriesField: 'category',
    xAxis: {
      nice: true,
      // tickCount: 8,
      label: {
        // autoRotate: false,
        rotate: Math.PI / 6,
        offset: 10,
        style: {
          fill: '#aaa',
          fontSize: 12,
        },
        formatter: (name) => name,
      },
      title: {
        text: 'Year',
        style: {
          fontSize: 16,
        },
      },
      line: {
        style: {
          stroke: '#aaa',
        },
      },
      tickLine: {
        style: {
          lineWidth: 2,
          stroke: '#aaa',
        },
        length: 5,
      },
      grid: {
        line: {
          style: {
            stroke: '#ddd',
            lineDash: [4, 2],
          },
        },
        alternateColor: 'rgba(0,0,0,0.05)',
      },
    },
    yAxis: {
      label: {
        autoRotate: false,
        style: {
          fill: '#aaa',
          fontSize: 12,
        },
        formatter: (v) =>
          `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
      title: {
        text: 'Quantity',
        style: {
          fontSize: 16,
        },
      },
      line: {
        style: {
          stroke: '#aaa',
        },
      },
      tickLine: {
        style: {
          lineWidth: 2,
          stroke: '#aaa',
        },
        length: 5,
      },
      grid: {
        line: {
          style: {
            stroke: '#ddd',
            lineDash: [4, 2],
          },
        },
        alternateColor: 'rgba(0,0,0,0.05)',
      },
    },
    label: {
      layout: [
        {
          type: 'hide-overlap',
        },
      ],
      style: {
        textAlign: 'right',
      },
      formatter: (item) => item.value,
    },
    point: {
      size: 5,
      style: {
        lineWidth: 1,
        fillOpacity: 1,
      },
      shape: (item) => {
        if (item.category === 'Cement production') {
          return 'circle';
        }

        return 'diamond';
      },
    },
    annotations: [
    //   {
    //     type: 'line',
    //     start: ['0%', '10%'],
    //     end: ['100%', '10%'],
    //     top: true,
    //     style: {
    //       stroke: 'l(0) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
    //       lineWidth: 2,
    //     },
    //   },
    //   {
    //     type: 'region',
    //     start: ['0%', '0%'],
    //     end: ['20%', '10%'],
    //     top: true,
    //     style: {
    //       fill: '#1890ff',
    //       fillOpacity: 1,
    //       opacity: 1,
    //     },
    //   },
    //   {
    //     type: 'text',
    //     position: ['10%', '5%'],
    //     content: '二氧化碳排放量来源',
    //     style: {
    //       fill: '#fff',
    //       fontSize: 12,
    //       textAlign: 'center',
    //       textBaseline: 'middle',
    //       shadowColor: '#fff',
    //       shadowOffsetX: 12,
    //       shadowOffsetY: 12,
    //       shadowBlur: 2,
    //     },
    //   },
    //   {
    //     type: 'line',
    //     start: ['min', 'median'],
    //     end: ['max', 'median'],
    //     style: {
    //       stroke: 'Turquoise',
    //       lineDash: [4, 2],
    //     },
    //   },
    ],
    legend: {
      position: 'top-right',
      itemName: {
        style: {
          fill: '#000',
        },
        formatter: (name) => name,
      },
    },
    meta: {
      year: {
        range: [0, 1],
      },
    },
  };

  return <Line {...config} />;
}
