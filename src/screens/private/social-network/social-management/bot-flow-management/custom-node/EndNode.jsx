import React from 'react';
import { Handle } from 'reactflow';

export default function EndNode(props) {

  return (
    <div className="node">
      <Handle
        id="b"
        type="target"
        position="left"
        isConnectable={true}
      />
    </div>
  );
}
