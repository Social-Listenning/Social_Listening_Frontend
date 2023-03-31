import { useQueryClient } from 'react-query';
import { useGetSocialGroups } from './socialNetworkService';
import PageCard from './PageCard';
import AddNewPage from './add-new/AddNewPage';

export default function SocialNetworkPage() {
  useGetSocialGroups();
  const queryClient = useQueryClient();
  const listSocial = queryClient
    .getQueryData('socialGroups')
    ?.filter((item) => item.isActive);

  return (
    <div className="social-network">
      <AddNewPage />
      {listSocial?.map((item, index) => {
        const name = item?.SocialNetwork?.name;
        const type = item?.SocialNetwork?.socialType;
        let id = null;
        if (item?.SocialNetwork?.extendData) {
          id = JSON.parse(item?.SocialNetwork?.extendData)?.id;
        }

        return (
          <PageCard key={index} name={name} id={id} type={type} />
        );
      })}
    </div>
  );
}
