import { useRef, useState } from 'react';
import { useMutation } from 'react-query';
import dayjs from 'dayjs';
import { getStatisticForTab } from '../../socialNetworkService';
import PieChart from '../../../../../components/shared/antd/Chart/PieChart';
import DoubleLineChart from '../../../../../components/shared/antd/Chart/DoubleLineChart';
import useEffectOnce from '../../../../../components/hooks/useEffectOnce';
import DateRangePincer from '../../../../../components/shared/antd/DateTimePicker/DateRangePicker';
import Title from '../../../../../components/shared/element/Title';

export default function SummaryManagePage({ pageId, socialPage }) {
  const [lineChartData, setLineChartData] = useState();

  const addMissingDate = (dateList) => {
    // Create a set of existing dates from the original list
    const existingDatesSet = new Set(
      dateList.map((item) => item.date)
    );

    // Generate a list of all dates between the minimum and maximum date in the original list
    const minDate = Math.min(
      ...dateList.map((item) => new Date(item.date))
    );
    const maxDate = Math.max(
      ...dateList.map((item) => new Date(item.date))
    );

    const allDates = [];
    const currentDate = new Date(minDate);
    while (currentDate <= maxDate) {
      allDates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Create a new list with sorted dates and missing dates added
    return allDates.map((date) => {
      if (existingDatesSet.has(date)) {
        return dateList.find((item) => item.date === date);
      } else {
        return { date, commentCount: 0, messageCount: 0 };
      }
    });
  };

  const useGetStatisticForTab = useMutation(getStatisticForTab, {
    onSuccess: (resp) => {
      if (resp?.result) {
        // get the selected date
        const startDate = dayjs(resp?.dateList?.startDate).format(
          'YYYY-MM-DD'
        );
        const endDate = dayjs(resp?.dateList?.endDate).format(
          'YYYY-MM-DD'
        );

        // add it to default list
        let dumpList = [
          {
            date: startDate,
            commentCount: 0,
            messageCount: 0,
          },
          {
            date: endDate,
            commentCount: 0,
            messageCount: 0,
          },
        ];

        Object.entries(resp.result).map((item) => {
          // check if the date already exist in the list or not
          let dateExistIndex = dumpList?.findIndex(
            (x) => x.date === item[1].date
          );

          // if exist replace it, not exist add new
          if (dateExistIndex >= 0) {
            dumpList[dateExistIndex] = item[1];
          } else {
            dumpList.push(item[1]);
          }
        });
        
        setLineChartData(addMissingDate(dumpList));
      }
    },
  });

  useEffectOnce(() => {
    useGetStatisticForTab.mutate({
      tabId: pageId,
      body: {
        startDate: dayjs().add(-30, 'd'),
        endDate: dayjs(),
      },
    });
  });

  return (
    <div className="summary-container">
      <Title>Message statistics</Title>
      <DateRangePincer
        defaultValue={[dayjs().add(-30, 'd'), dayjs()]}
        onChange={(e) => {
          if (e) {
            useGetStatisticForTab.mutate({
              tabId: pageId,
              body: {
                startDate: e[0],
                endDate: e[1],
              },
            });
          }
        }}
      />
      <DoubleLineChart
        xConfig="date"
        yConfig={['Comments', 'Chats']}
        lineChartData={lineChartData?.map((item) => {
          return {
            date: item?.date,
            Comments: item?.commentCount,
            Chats: item?.messageCount,
          };
        })}
      />
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
