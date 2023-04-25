import { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  updateEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useMutation } from 'react-query';
import { updateBotFlow } from '../../../socialNetworkService';
import { notifyService } from '../../../../../../services/notifyService';
import ReceiveNode from './custom-node/ReceiveNode';
import RespondNode from './custom-node/RespondNode';
import SentimentAnalysis from './custom-node/SentimentAnalysis';
import NotifyAgent from './custom-node/NotifyAgent';
import WorkflowNav from './WorkflowNav';
import BotFlowMenu from './BotFlowMenu';
import VariableMenu from './VariableMenu';
import useUpdateEffect from '../../../../../../components/hooks/useUpdateEffect';

const nodeTypes = {
  Receive: ReceiveNode,
  SentimentAnalysis: SentimentAnalysis,
  Respond: RespondNode,
  NotifyAgent: NotifyAgent,
};

export default function FlowPlayground(props) {
  const { pageId, flowDetail, setFlowDetail } = props;
  const extendData = useRef({
    nodes: [],
    edges: [],
    variables: [],
  });
  if (flowDetail?.extendData) {
    extendData.current = JSON.parse(flowDetail.extendData);
  };
  console.log(extendData.current.nodes)
  const reactFlowWrapper = useRef(null);
  const edgeUpdateSuccessful = useRef(true);
  const isDeleteNode = useRef(false);
  const [nodes, setNodes, onNodesChange] = useNodesState(
    extendData.current?.nodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    extendData.current?.edges
  );
  const [variableList, setVariableList] = useState(
    extendData.current?.variables
  );
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    edgeUpdateSuccessful.current = true;
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
  }, []);

  const onEdgeUpdateEnd = useCallback((_, edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }

    edgeUpdateSuccessful.current = true;
  }, []);

  const deleteNodeById = (id) => {
    isDeleteNode.current = true;
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) =>
      eds.filter((edge) => edge.target !== id || edge.source === id)
    );
  };

  const deleteEdgeById = (id) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== id));
  };

  const syncDataFromNode = (id, data) => {
    setNodes((nds) =>
      nds.filter((node) => {
        if (node.id === id) {
          let dumpData = node.data;
          node.data = {
            ...dumpData,
            ...data,
          };
        }
        return node;
      })
    );
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds =
        reactFlowWrapper.current.getBoundingClientRect();

      const type = event.dataTransfer.getData(
        'application/reactflow'
      );

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      setNodes((nds) =>
        nds.concat({
          id: crypto.randomUUID(),
          type,
          position,
          data: {
            syncData: syncDataFromNode,
            deleteNode: deleteNodeById,
          },
        })
      );
    },
    [reactFlowInstance]
  );

  const goBackMenu = () => {
    setSelectedNode(null);
  };

  const updateVariableInputNode = () => {
    edges.forEach((eds) => {
      const sourceNode = nodes.filter(
        (nds) => nds.id === eds.source
      )[0];
      const targetNode = nodes.filter(
        (nds) => nds.id === eds.target
      )[0];

      // if source output had variable
      if (sourceNode?.data?.output?.variable) {
        // and target input did not had variable
        if (
          targetNode?.data?.input?.variable !==
          sourceNode?.data?.output?.variable
        ) {
          // put input variable in the target
          syncDataFromNode(targetNode.id, {
            input: { variable: sourceNode.data.output.variable },
          });
        }
      }
    });
  };

  useUpdateEffect(() => {
    // delete node also delete the selected one
    if (isDeleteNode.current) {
      goBackMenu();
    }
    isDeleteNode.current = false;
  }, [nodes]);

  useUpdateEffect(() => {
    // update variable for input handle when connected 2 nodes
    updateVariableInputNode();
  }, [edges]);

  const goBackToTable = () => {
    setFlowDetail(null);
  };

  const useUpdateBotFlow = useMutation(updateBotFlow, {
    onSuccess: (resp) => {
      if (resp) {
        notifyService.showSucsessMessage({
          description: 'Update flow successfully',
        });
      }
    },
  });
  const updateBotflow = () => {
    useUpdateBotFlow.mutate({
      id: flowDetail?.id,
      body: {
        name: flowDetail?.name,
        tabId: pageId,
        data: {
          nodes: nodes,
          edges: edges,
          variables: variableList,
        },
      },
    });
  };

  return (
    <div className="react-flow-container" ref={reactFlowWrapper}>
      <WorkflowNav
        flowDetail={flowDetail}
        updateFlow={updateBotflow}
        loadingUpdate={useUpdateBotFlow.isLoading}
        exit={goBackToTable}
      />
      <BotFlowMenu
        selectedNode={selectedNode}
        goBackMenu={goBackMenu}
        variableList={variableList}
        syncVariable={updateVariableInputNode}
        updateVariableList={setVariableList}
      />
      <VariableMenu variableList={variableList} />
      <ReactFlow
        snapToGrid
        fitView
        nodes={nodes?.map((node) => {
          node.data = {
            ...node.data,
            syncData: syncDataFromNode,
            deleteNode: deleteNodeById,
          };
          return node;
        })}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onEdgeUpdate={onEdgeUpdate}
        onEdgeUpdateStart={onEdgeUpdateStart}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
        onNodeClick={(e) => {
          const id = e.currentTarget.dataset.id;
          e.currentTarget.onkeydown = function (x) {
            if (x.key === 'Delete') {
              deleteNodeById(id);
            }
          };
          setSelectedNode(nodes.filter((nds) => nds.id === id)[0]);
        }}
        onEdgeClick={(e) => {
          let id = e.currentTarget.dataset.testid;
          if (id?.includes('rf__edge-')) {
            id = id.substring(9);
          }
          e.currentTarget.onkeydown = function (x) {
            if (x.key === 'Delete') {
              deleteEdgeById(id);
            }
          };
        }}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <Controls />
        <Background variant="lines" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
