import { ShrinkOutlined, ArrowsAltOutlined } from '@ant-design/icons';
import useToggle from '../../../../../../components/hooks/useToggle';

export default function VariableMenu(props) {
  const { variableList = [] } = props;
  const [expand, toggleExpand] = useToggle(true);

  return (
    <div className={`variable-menu ${!expand ? 'shrink' : ''}`}>
      <div className="variable-title flex-center">
        Variables
        {expand ? (
          <ShrinkOutlined
            className="expand-btn"
            onClick={() => {
              toggleExpand(false);
            }}
          />
        ) : (
          <ArrowsAltOutlined
            className="expand-btn"
            onClick={() => {
              toggleExpand(true);
            }}
          />
        )}
      </div>
      {expand && (
        <ul className="variable-list">
          {variableList?.map((item, index) => (
            <li key={index} className="variable-item">
              {item?.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
