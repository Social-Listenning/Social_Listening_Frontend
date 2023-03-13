import { useState, useRef } from 'react';
import { Drawer, Space, Steps } from 'antd';
import useUpdateEffect from '../../../../../hooks/useUpdateEffect';
import useToggle from '../../../../../hooks/useToggle';
import CancelButton from '../../Button/CancelButton';
import NextButton from '../../Button/NextButton';
import PreviousButton from '../../Button/PreviousButton';
import UploadFile from '../Utils/UploadFile';
import TableMapData from '../Utils/TableMapData';

export default function ImportDrawer(props) {
  const { open, toggleOpen, tableColumn } = props;

  // const [data, setData] = useState([]); // rows data in excel
  const propsMapped = useRef([]); // header mapped to table col props
  const [header, setHeader] = useState([]); // headers in excel
  const [colMapped, setColMapped] = useState([]); // header in excel mapped to table
  const [currentStep, setCurrentStep] = useState(0);

  // condition to show previous button
  const finished = useRef(false);
  let showPreviousBtn = false;
  if (currentStep > 0) {
    showPreviousBtn = true;
    if (currentStep === 2) {
      finished.current = true;
    }
    if (currentStep === 1 && finished.current === true) {
      showPreviousBtn = false;
    }
  }

  // map header in excel to props in table
  if (colMapped?.length > 0) {
    propsMapped.current = colMapped
      .map((item) => {
        return {
          header: item.leftCol,
          props: tableColumn.filter(
            (col) => col?.title === item?.rightCol
          )[0]?.dataIndex,
        };
      })
      .filter((item) => item.header);
  }

  const [hadErrorCol, setHadErrorCol] = useToggle(false);
  useUpdateEffect(() => {
    setHadErrorCol(
      document.querySelectorAll('.required-column.error-column')
        ?.length > 0
    );
  }, [colMapped]);

  function closeDrawer() {
    toggleOpen(false);
    finished.current = false;
    if (currentStep != 0) {
      setCurrentStep(0);
    }
    if (header != null) {
      setHeader(null);
    }
  }

  return (
    <Drawer
      destroyOnClose
      maskClosable={false}
      onClose={closeDrawer}
      open={open}
      width={500}
      extra={
        <Space>
          <CancelButton onClick={closeDrawer} />
          {showPreviousBtn && (
            <PreviousButton
              onClick={() => {
                if (currentStep === 1) {
                  setHeader([]);
                }
                setCurrentStep(currentStep - 1);
              }}
            />
          )}
          {currentStep < 2 && (
            <NextButton
              disabled={
                (currentStep === 0 && header?.length === 0) ||
                hadErrorCol
              }
              onClick={() => {
                setCurrentStep(currentStep + 1);
              }}
            />
          )}
        </Space>
      }
    >
      <Steps
        current={currentStep}
        onChange={(value) => {
          if (value === 0) {
            setHeader([]);
          }
          setCurrentStep(value);
        }}
        items={[
          {
            title: (
              <UploadFile
                // getData={setData}
                getHeader={setHeader}
                moveToStep={setCurrentStep}
              >
                Step 1
              </UploadFile>
            ),
            description: (
              <UploadFile
                // getData={setData}
                getHeader={setHeader}
                moveToStep={setCurrentStep}
              >
                Choose file
              </UploadFile>
            ),
            disabled: finished.current,
          },
          {
            title: 'Step 2',
            description: 'Map data',
            disabled: currentStep === 0 && header?.length === 0,
          },
          {
            title: 'Step 3',
            description: 'Status',
            disabled: currentStep === 0,
          },
        ]}
      />
      <div className="import-content">
        {currentStep === 1 && (
          <TableMapData
            leftCol={header}
            rightCol={tableColumn}
            getColMapped={setColMapped}
          />
        )}
      </div>
    </Drawer>
  );
}
