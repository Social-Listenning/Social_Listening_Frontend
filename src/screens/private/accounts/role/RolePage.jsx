import { useRef } from 'react';
import { Card, Divider } from 'antd';
import useToggle from '../../../../components/hooks/useToggle';
import ModalDetail from './ModalDetail';
import './rolePage.scss';

export default function RolePage(props) {
  const roleData = props?.roleData
  const [openModal, toggleOpenModal] = useToggle(false);
  const type = useRef(null);
  const role = useRef(null);

  function closeMoreDetail() {
    type.current = null;
    role.current = null;
    toggleOpenModal(false);
  }

  return (
    <div className="role-page-wrapper">
      {roleData?.map((item, index) => (
        <Card key={index} title={item?.roleName}>
          <div
            onClick={() => {
              type.current = "User";
              role.current = item?.roleName;
              toggleOpenModal(true);
            }}
          >
            Total User: {item?._count?.User}
          </div>
          <Divider />
          <div
            onClick={() => {
              type.current = "Permission";
              role.current = item?.roleName;
              toggleOpenModal(true);
            }}
          >
            Total Permission: {item?._count?.Role_Permission}
          </div>
        </Card>
      ))}

      <ModalDetail
        open={openModal}
        close={closeMoreDetail}
        type={type.current}
        role={role.current}
      />
    </div>
  );
}
