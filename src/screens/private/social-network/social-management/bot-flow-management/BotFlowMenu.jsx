import { useState } from 'react';
import { Input, Modal, Slider } from 'antd';
import {
  NotificationOutlined,
  ExperimentOutlined,
  PlayCircleOutlined,
  MessageOutlined,
  LeftOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import useToggle from '../../../../../components/hooks/useToggle';
import useUpdateEffect from '../../../../../components/hooks/useUpdateEffect';
import ClassicSelect from '../../../../../components/shared/antd/Select/Classic';
import SaveButton from '../../../../../components/shared/element/Button/SaveButton';
import Title from '../../../../../components/shared/element/Title';

const nodeTypes = [
  {
    icon: <PlayCircleOutlined />,
    label: 'Receive Message',
    value: 'Receive',
  },
  {
    icon: <ExperimentOutlined />,
    label: 'Sentiment Analysis',
    value: 'SentimentAnalysis',
  },
  {
    icon: <NotificationOutlined />,
    label: 'Notify Agent',
    value: 'NotifyAgent',
  },
  { icon: <MessageOutlined />, label: 'Respond', value: 'Respond' },
];

const onDragStart = (event, nodeType) => {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.effectAllowed = 'move';
};

export default function BotFlowMenu(props) {
  const {
    selectedNode,
    goBackMenu,
    variableList = [],
    updateVariableList,
  } = props;
  const type = nodeTypes?.filter(
    (item) => item.value === selectedNode?.type
  )[0]?.label;

  // #region receive message
  const addNewId = crypto.randomUUID();
  const [varSelectedValue, setVarSelectedValue] = useState(
    selectedNode?.data?.output
  );
  const [openAddNew, setOpenAddNew] = useToggle(false);
  const handleSelectVariable = (e) => {
    if (e === addNewId) {
      setVarSelectedValue(null);
      setOpenAddNew(true);
    } else {
      setVarSelectedValue(e);
      selectedNode.data.syncData(selectedNode.id, { output: e });
    }
  };
  useUpdateEffect(() => {
    if (openAddNew) {
      document.getElementById('add-new-attribute')?.focus();
    }
  }, [openAddNew]);
  const closeAddNewModal = () => {
    setOpenAddNew(false);
  };
  // #endregion

  // #region sentiment analysis
  const [sentiment, setSentiment] = useState(0);
  const handleChangeSentiment = (value) => {
    if (isNaN(value)) {
      return;
    }
    setSentiment(value);
  };
  // #endregion

  return (
    <div className="flow-menu">
      {!selectedNode ? (
        <ul className="flow-item-wrapper flex-center">
          {nodeTypes?.map((item, index) => (
            <li
              key={index}
              className="flow-item"
              onDragStart={(event) => onDragStart(event, item.value)}
              draggable
            >
              {item.icon}
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      ) : (
        <>
          <div className="flow-title flex-center">
            <LeftOutlined onClick={goBackMenu} />
            <b>{type}</b>
          </div>
          <div className="flow-body">
            <div className="flow-node-data flex-center">
              {selectedNode.type === 'Receive' ? (
                <>
                  <span>Set received message to variable</span>
                  <ClassicSelect
                    filterLabel
                    value={varSelectedValue}
                    placeHolder={null}
                    options={[
                      {
                        label: (
                          <span className="new-var-option flex-center">
                            <PlusOutlined /> Add new variable
                          </span>
                        ),
                        value: addNewId,
                      },
                      ...variableList.map((item) => {
                        return { label: item, value: item };
                      }),
                    ]}
                    handleSelect={handleSelectVariable}
                  />
                </>
              ) : selectedNode.type === 'SentimentAnalysis' ? (
                <>
                  <span>Select the sentiment range</span>
                  <Slider
                    range
                    className="full-width"
                    defaultValue={[0.3, 0.7]}
                    min={0}
                    max={1}
                    step={0.1}
                    // onChange={handleChangeSentiment}
                  />
                </>
              ) : selectedNode.type === 'NotifyAgent' ? (
                <></>
              ) : selectedNode.type === 'Respond' ? (
                <></>
              ) : null}
            </div>
          </div>

          {openAddNew && (
            <Modal
              open={openAddNew}
              onCancel={closeAddNewModal}
              footer={
                <SaveButton
                  onClick={() => {
                    updateVariableList((old) =>
                      old.concat(
                        document.getElementById('add-new-attribute')
                          ?.value
                      )
                    );
                    closeAddNewModal();
                  }}
                />
              }
              centered
              destroyOnClose
            >
              <Title>Add new attribute</Title>
              <Input id="add-new-attribute" />
            </Modal>
          )}
        </>
      )}
    </div>
  );
}
