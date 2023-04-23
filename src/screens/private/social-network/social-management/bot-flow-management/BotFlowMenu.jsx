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
import useEffectOnce from '../../../../../components/hooks/useEffectOnce';
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
    syncVariable,
    goBackMenu,
    variableList = [],
    updateVariableList,
  } = props;
  const type = nodeTypes?.filter(
    (item) => item.value === selectedNode?.type
  )[0]?.label;

  // #region receive message
  const addNewId = crypto.randomUUID();
  const [varReceiveOutput, setVarReceiveOutput] = useState(
    selectedNode?.data?.output?.variable
  );
  const [openAddNew, setOpenAddNew] = useToggle(false);
  const handleSelectReceiveOutput = (e) => {
    if (e === addNewId) {
      setVarReceiveOutput(null);
      setOpenAddNew(true);
    } else {
      setVarReceiveOutput(e);
      selectedNode.data.syncData(selectedNode.id, {
        output: { variable: e },
      });
      syncVariable();
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
  const [sentiment, setSentiment] = useState([0.3, 0.7]);
  const [varSentimentOutput, setVarSentimentOutput] = useState(
    selectedNode?.data?.output?.variable
  );
  useEffectOnce(() => {
    selectedNode?.data?.syncData(selectedNode?.id, {
      sentiment: {
        negative: `0 - ${sentiment[0]}`,
        neutral: `${sentiment[0]} - ${sentiment[1]}`,
        positive: `${sentiment[1]} - 1`,
      },
    });
  });
  const handleChangeSentiment = (value) => {
    setSentiment(value);
    selectedNode?.data?.syncData(selectedNode?.id, {
      sentiment: {
        negative: `0 - ${value[0]}`,
        neutral: `${value[0]} - ${value[1]}`,
        positive: `${value[1]} - 1`,
      },
    });
  };
  const handleSelectSentimentOutput = (e) => {
    if (e === addNewId) {
      setVarSentimentOutput(null);
      setOpenAddNew(true);
    } else {
      setVarSentimentOutput(e);
      selectedNode.data.syncData(selectedNode.id, {
        output: { variable: e },
      });
      syncVariable();
    }
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
            {selectedNode.type === 'Receive' ? (
              <div className="flow-node-data">
                <span>Set received message to variable</span>
                <ClassicSelect
                  filterLabel
                  value={varReceiveOutput}
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
                  handleSelect={handleSelectReceiveOutput}
                />
              </div>
            ) : selectedNode.type === 'SentimentAnalysis' ? (
              <>
                <div className="flow-node-data">
                  <span>Select the sentiment range</span>
                  <Slider
                    range
                    className="full-width"
                    value={sentiment}
                    min={0}
                    max={1}
                    step={0.1}
                    onChange={handleChangeSentiment}
                  />
                  <div className="sentiment-display">
                    <span className="negative">
                      Negative: 0 - {sentiment[0]}
                    </span>
                    <span className="neutral">
                      Neutral:
                      {sentiment[0]} - {sentiment[1]}
                    </span>
                    <span className="positive">
                      Positive: {sentiment[1]} - 1
                    </span>
                  </div>
                </div>
                <div className="flow-node-data">
                  <span>Set the sentiment to variable</span>
                  <ClassicSelect
                    filterLabel
                    placeHolder={null}
                    value={varSentimentOutput}
                    onChange={handleSelectSentimentOutput}
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
                  />
                </div>
              </>
            ) : selectedNode.type === 'NotifyAgent' ? (
              <></>
            ) : selectedNode.type === 'Respond' ? (
              <>
                <div className="flow-node-data">
                  <span>Intent</span>
                  <ClassicSelect
                    filterLabel
                    placeHolder={null}
                    // value={varReceiveOutput}
                    // options={[
                    //   {
                    //     label: (
                    //       <span className="new-var-option flex-center">
                    //         <PlusOutlined /> Add new variable
                    //       </span>
                    //     ),
                    //     value: addNewId,
                    //   },
                    //   ...variableList.map((item) => {
                    //     return { label: item, value: item };
                    //   }),
                    // ]}
                    // handleSelect={handleSelectReceiveOutput}
                  />
                </div>
                <div className="flow-node-data">
                  <span>Response option</span>
                  <Input.TextArea
                    allowClear
                    autoSize={{ minRows: 5, maxRows: 5 }}
                    onChange={(e) => {
                      selectedNode?.data?.syncData(selectedNode?.id, {
                        response: e.currentTarget.value,
                      });
                    }}
                  />
                </div>
              </>
            ) : null}
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
