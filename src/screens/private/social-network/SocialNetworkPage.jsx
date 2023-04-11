import { useRef } from 'react';
import { useGetSocialGroups } from './socialNetworkService';
import PageCard from './PageCard';
import AddNewPage from './add-new-social/AddNewPage';
import './socialNetwork.scss';

export default function SocialNetworkPage() {
  const firstRender = useRef(true);
  const { data } = useGetSocialGroups(firstRender.current);
  firstRender.current = false;
  const listPageConnected = data?.map((item) => {
    let extendData = null;
    if (item?.SocialNetwork?.extendData) {
      extendData = JSON.parse(item?.SocialNetwork?.extendData);
    }
    return extendData?.id;
  });

  return (
    <div className="social-network">
      <AddNewPage listPageConnected={listPageConnected} />
      {data?.map((item, index) => (
        <PageCard
          key={index}
          socialNetworkData={item}
          type={item?.SocialNetwork?.socialType}
        />
      ))}
    </div>
  );
}
