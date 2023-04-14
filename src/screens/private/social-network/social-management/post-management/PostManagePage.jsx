import { useState, useRef } from 'react';
import { Switch } from 'antd';
import { useGetSocialPost } from '../../socialNetworkService';
import useToggle from '../../../../../components/hooks/useToggle';
import ToolTipWrapper from '../../../../../components/shared/antd/ToolTipWrapper';
import DateTimePicker from '../../../../../components/shared/antd/DateTimePicker/DateTimePicker';
import DateRangePicker from '../../../../../components/shared/antd/DateTimePicker/DateRangePicker';
import ApplyFilterButton from '../../../../../components/shared/element/Button/ApplyFilterButton';
import PostCard from './PostCard';
import './post.scss';

export default function PostManagePage({ pageId, socialPage }) {
  const [rangeFilter, setRangeFilter] = useToggle(false);
  const getPost = useRef(true);
  const { data: listPost } = useGetSocialPost(
    pageId,
    getPost.current
  );
  getPost.current = false;

  return (
    <div className="post-container">
      <div className="filter-section flex-center">
        <div className="filter-item flex-center">
          <ToolTipWrapper tooltip="Check to filter unread posts">
            <Switch />
          </ToolTipWrapper>
          Unread
        </div>
        <div className="filter-item flex-center">
          <ToolTipWrapper tooltip="Check to filter date range">
            <Switch
              onChange={() => {
                setRangeFilter(!rangeFilter);
              }}
            />
          </ToolTipWrapper>
          {rangeFilter ? <DateRangePicker /> : <DateTimePicker />}
        </div>
        <ApplyFilterButton />
      </div>
      <div className="list-post-section">
        {listPost?.map((item) => (
          <PostCard socialPage={socialPage} postData={item} />
        ))}
      </div>
    </div>
  );
}
