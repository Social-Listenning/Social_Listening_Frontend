import { useState } from 'react';
import FlowPlayground from './playground/FlowPlayground';
import TableBotFlow from './table/TableBotFlow';
import './flow.scss';

export default function BotFlowManagePage({ pageId, socialPage }) {
  const [flowDetail, setFlowDetail] = useState(null);

  return (
    <>
      {!flowDetail ? (
        <TableBotFlow pageId={pageId} getCurrentFlow={setFlowDetail} />
      ) : (
        <FlowPlayground
          pageId={pageId}
          flowDetail={flowDetail}
          getCurrentFlow={setFlowDetail}
        />
      )}
    </>
  );
}
