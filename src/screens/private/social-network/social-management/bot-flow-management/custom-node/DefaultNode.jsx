import React from 'react';
import { Handle } from 'reactflow';

export default function DefaultNode(props) {

  return (
    <div className="node">
      <Handle
        id="c"
        type="target"
        position="left"
        isConnectable={true}
      />
      <Handle
        id="c"
        type="source"
        position="right"
        isConnectable={true}
      />
    </div>
  );
}
