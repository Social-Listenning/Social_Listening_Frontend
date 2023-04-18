import React, { useCallback, useRef } from 'react';
import { Button } from 'antd';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  updateEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Getter } from '../../../../../utils/dataGetter';
import InputNode from './custom-node/InputNode';
import OutputNode from './custom-node/OutputNode';
import DefaultNode from './custom-node/DefaultNode';
import NewButton from '../../../../../components/shared/element/Button/NewButton';
import './flow.scss';

const initialNodes = [
  {
    id: '1',
    type: 'customOutput',
    position: { x: 0, y: 0 },
    data: { label: '1' },
  },
  {
    id: '2',
    type: 'customInput',
    position: { x: 0, y: 100 },
    data: { label: '2' },
  },
  {
    id: '3',
    type: 'customDefault',
    position: { x: 0, y: 200 },
    data: { label: '3' },
  },
];
const initialEdges = [
  // { id: 'e1-2', source: '1', target: '2' }
];
const nodeTypes = {
  customOutput: OutputNode,
  customInput: InputNode,
  customDefault: DefaultNode,
};

export default function BotFlowManagePage() {
  const edgeUpdateSuccessful = useRef(true);
  const [nodes, setNodes, onNodesChange] =
    useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] =
    useEdgesState(initialEdges);

  const deleteNodeById = (id) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
  };

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

  return (
    <div className="flex-center">
      <div style={{ width: '32rem', height: '76vh' }}>
        {Object.keys(nodeTypes)?.map((item, index) => {
          return (
            <Button
              key={index}
              onClick={() => {
                setNodes((old) =>
                  old.concat({
                    id: Getter.generateId(9),
                    type: item,
                    position: { x: 0, y: 0 },
                    data: { label: '3' },
                  })
                );
              }}
            >
              {item}
            </Button>
          );
        })}
        <Button
          danger
          onClick={() => {
            setNodes([]);
          }}
        >
          Delete All
        </Button>
      </div>
      <div style={{ flex: 1, height: '76vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={(e) => {
            const id = e.currentTarget.dataset.id;
            e.currentTarget.onkeydown = function (x) {
              if (x.key == 'Delete') {
                deleteNodeById(id);
              }
            };
          }}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          snapToGrid
          onEdgeUpdate={onEdgeUpdate}
          onEdgeUpdateStart={onEdgeUpdateStart}
          onEdgeUpdateEnd={onEdgeUpdateEnd}
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}
