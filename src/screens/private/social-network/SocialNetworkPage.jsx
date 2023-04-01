import { useRef } from 'react';
import { useGetSocialGroups } from './socialNetworkService';
import useEffectOnce from '../../../components/hooks/useEffectOnce';
import PageCard from './PageCard';
import AddNewPage from './add-new-social/AddNewPage';

export default function SocialNetworkPage() {
  const firstRender = useRef(true);
  const { data } = useGetSocialGroups(firstRender.current);
  const listPageConnected = data?.map((item) => {
    let extendData = null;
    if (item?.SocialNetwork?.extendData) {
      extendData = JSON.parse(item?.SocialNetwork?.extendData);
    }
    return extendData?.id;
  });

  useEffectOnce(() => {
    firstRender.current = false;
  });

  return (
    <div className="social-network">
      <AddNewPage listPageConnected={listPageConnected}/>
      {data?.map((item, index) => {
        const type = item?.SocialNetwork?.socialType;
        let extendData = null;
        if (item?.SocialNetwork?.extendData) {
          extendData = JSON.parse(item?.SocialNetwork?.extendData);
        }
        return (
          <PageCard key={index} pageData={extendData} type={type} />
        );
      })}
    </div>
  );
}
