import { useState, useRef } from 'react';
import { Drawer, Space, Steps } from 'antd';
import { apiService } from '../../../../../services/apiService';
import { notifyService } from '../../../../../services/notifyService';
import useUpdateEffect from '../../../../../hooks/useUpdateEffect';
import useToggle from '../../../../../hooks/useToggle';
import CancelButton from '../../Button/CancelButton';
import NextButton from '../../Button/NextButton';
import PreviousButton from '../../Button/PreviousButton';
import UploadFile from '../Utils/UploadFile';
import TableMapData from '../Utils/TableMapData';

export default function ImportDrawer(props) {
  const { open, toggleOpen, apiImport, tableColumn } = props;

  // const [data, setData] = useState([]); // rows data in excel
  const propsMapped = useRef([]); // header mapped to table col props
  const file = useRef(null); // file excel
  const header = useRef([]); // headers in excel
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

  function getDataFromFile(fileExcel, headerExcel) {
    file.current = fileExcel;
    header.current = headerExcel;
    setCurrentStep(currentStep + 1);
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

  // get any error cols to block next button
  const [hadErrorCol, setHadErrorCol] = useToggle(false);
  useUpdateEffect(() => {
    if (
      hadErrorCol !==
      document.querySelectorAll('.required-column.error-column')
        ?.length >
        0
    ) {
      setHadErrorCol(
        document.querySelectorAll('.required-column.error-column')
          ?.length > 0
      );
    }
  }, [colMapped]);

  async function importFile() {
    const formData = new FormData();
    formData.append('file', file);
    formData.append(
      'mappingColumn',
      JSON.stringify(propsMapped.current)
    );

    await apiService.post(apiImport, formData).then((resp) => {
      if (resp?.result) {
        notifyService.showSucsessMessage('Import is processing');
      }
    });
  }

  function closeDrawer() {
    toggleOpen(false);
    finished.current = false;
    file.current = null;
    header.current = [];
    if (currentStep !== 0) {
      setCurrentStep(0);
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
                  header.current = [];
                }
                setCurrentStep(currentStep - 1);
              }}
            />
          )}
          {currentStep < 2 && (
            <NextButton
              disabled={
                (currentStep === 0 && header.current?.length === 0) ||
                hadErrorCol
              }
              onClick={() => {
                if (currentStep === 1) {
                  importFile();
                }
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
            header.current = [];
          }
          if (value === 2) {
            importFile();
          }
          setCurrentStep(value);
        }}
        items={[
          {
            title: (
              <UploadFile getDataFromFile={getDataFromFile}>
                Step 1
              </UploadFile>
            ),
            description: (
              <UploadFile getDataFromFile={getDataFromFile}>
                Choose file
              </UploadFile>
            ),
            disabled: finished.current,
          },
          {
            title: 'Step 2',
            description: 'Map data',
            disabled:
              currentStep === 0 && header.current?.length === 0,
          },
          {
            title: 'Step 3',
            description: 'Status',
            disabled: currentStep === 0 || hadErrorCol,
          },
        ]}
      />
      <div className="import-content">
        {currentStep === 1 && (
          <TableMapData
            leftCol={header.current}
            rightCol={tableColumn}
            getColMapped={setColMapped}
          />
        )}
      </div>
    </Drawer>
  );
}
