import { useRef, useState } from "react";
import { useGetMessageDetail } from "../../socialNetworkService";
import DateTimeFormat from "../../../../../components/shared/element/DateTimeFormat";
import AdminTable from "../../../../../components/shared/antd/Table/Table";
import MessageTypeContainer from "./message-type/MessageTypeContainer";
import environment from "../../../../../constants/environment/environment.dev";
import Hint from "../../../../../components/shared/element/Hint";
import LoadingWrapper from "../../../../../components/shared/antd/LoadingWrapper";
import BasicAvatar from "../../../../../components/shared/antd/BasicAvatar";
import ToolTipWrapper from "../../../../../components/shared/antd/ToolTipWrapper";

export default function MessageManagePage(props) {
	const { pageId, socialPage } = props;

	const [msgSelected, setMsgSelected] = useState(null);
	const getDetail = useRef(false);
	const { data, isFetching } = useGetMessageDetail(
		msgSelected?.id,
		getDetail.current
	);
	getDetail.current = false;

	const columns = [
		{
			title: "Sender",
			dataIndex: "sender.fullName",
			render: (text, record) => {
				return (
					<div className="sender-header flex-center">
						<BasicAvatar
							src={record?.sender?.avatarUrl}
							name={record["sender.fullName"]}
						/>
						<span className="sender-name limit-line">
							{record["sender.fullName"]}
						</span>
					</div>
				);
			},
			fixed: true,
		},
		{
			title: "Message",
			dataIndex: "message",
			onCell: (record, _) => {
				return {
					onClick: () => {
						setMsgSelected(record);
						getDetail.current = true;
					},
				};
			},
			render: (record) => {
				return (
					<ToolTipWrapper tooltip="Click to view full details">
						<div className="pointer limit-line">
							<b>{record}</b>
						</div>
					</ToolTipWrapper>
				);
			},
		},
		{
			title: "Type",
			dataIndex: "type",
			width: 70,
			sort: false,
			onCell: () => ({
				className: "text-center",
			}),
		},
		{
			title: "Date Sent",
			dataIndex: "createdAt",
			width: 200,
			render: (record) => {
				return <DateTimeFormat dateTime={record} />;
			},
			onCell: () => ({
				className: "text-center",
			}),
			filter: {
				filterType: "DateTime",
			},
		},
	];

	const permission = {
		table: "table-user",
	};

	return (
		<>
			<Hint
				type="info"
				message={
					<span className="message-detail-hint flex-center">
						We will only get messages from the date you register your social
						media business to our system.
					</span>
				}
			/>
			<div className="message-container flex-center">
				<div className="message-table">
					<AdminTable
						apiGetData={`${environment.socialMessage}/${pageId}`}
						columns={columns}
						permission={permission}
						showToolbar={false}
						disableSelect
						scroll={{
							x: 1000,
						}}
					/>
				</div>
				<div className="message-detail flex-center">
					{msgSelected ? (
						<LoadingWrapper
							loading={isFetching}
							className="message-type-loader"
						>
							<MessageTypeContainer
								messageSelected={msgSelected}
								messageDetail={data}
								type={msgSelected?.type}
								socialPage={socialPage}
							/>
						</LoadingWrapper>
					) : (
						<div className="full-height flex-center">
							<Hint
								message={
									<span className="message-detail-hint flex-center">
										You can select the message (the first column with a bold
										text) from the table to view full details
									</span>
								}
							/>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
