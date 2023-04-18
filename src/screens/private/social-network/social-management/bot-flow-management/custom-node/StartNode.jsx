import React from 'react';
import { Handle } from 'reactflow';

export default function StartNode(props) {

  return (
    <div className="node">
      <Handle
        id="a"
        type="source"
        position="right"
        isConnectable={true}
      />
    </div>
  );
}
