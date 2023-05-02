import { useRef, useState } from "react";
import { Tag, Input } from "antd";
import { SendOutlined, CloseOutlined } from "@ant-design/icons";
import { useMutation } from "react-query";
import { useGetDecodedToken } from "../../../../../../routes/private/privateService";
import {
	replyFbMessage,
	saveMessageToSystem,
} from "../../../socialNetworkService";
import { notifyService } from "../../../../../../services/notifyService";
import useToggle from "../../../../../../components/hooks/useToggle";
import useUpdateEffect from "../../../../../../components/hooks/useUpdateEffect";
import BasicAvatar from "../../../../../../components/shared/antd/BasicAvatar";
import IconButton from "../../../../../../components/shared/element/Button/IconButton";
import IconMoreButton from "../../../../../../components/shared/element/Button/IconMoreButton";
import ClassicDropdown from "../../../../../../components/shared/antd/Dropdown/Classic";
import PostHeader from "../../post-management/PostHeader";
import ChatHeader from "./ChatHeader";

const listAction = ["Reply"];

export default function MessageTypeContainer(props) {
	const { messageSelected, messageDetail, type, socialPage } = props;
	const messageContainer = useRef(null);
	const [reply, setReply] = useState(null);
	const [messageReplied, setMessageReplied] = useState(null);
	const [showRecommend, toggleShowRecommend] = useToggle(false);
	const [messageList, setMessageList] = useState(messageDetail?.message);
	const { data } = useGetDecodedToken();

	useUpdateEffect(() => {
		if (showRecommend && messageContainer.current) {
			messageContainer.current.scrollTop =
				messageContainer.current.scrollHeight;
		}
	}, [showRecommend]);

	useUpdateEffect(() => {
		setMessageReplied(null);
		document.getElementById("respond-input")?.focus();

		if (messageDetail?.message?.length > 0) {
			setMessageList(messageDetail.message);
		}
	}, [messageDetail?.message]);

	const useReplyFbMessage = useMutation(replyFbMessage, {
		onSuccess: (resp) => {
			if (resp) {
				useSaveMessageToSystem.mutate({
					networkId: socialPage?.id,
					message: reply,
					sender: socialPage?.name,
					createdAt: new Date(),
					type: `Agent#${data?.id}`,
					parent: messageDetail?.post,
					postId: messageDetail?.post?.postId,
					commentId: resp?.id,
					parentId: messageReplied?.messageId ?? messageSelected?.messageId,
				});
			}
		},
	});

	const useSaveMessageToSystem = useMutation(saveMessageToSystem, {
		onSuccess: (resp) => {
			if (resp) {
				setReply(null);
        setMessageReplied(null);
				setMessageList((old) => {
					return [
						...old,
						{
							createdAt: new Date(),
							type: `Agent#${data?.id}`,
							message: reply,
						},
					];
				});

				notifyService.showSucsessMessage({
					description: "Reply successfully",
				});
			}
		},
	});

	return (
		<>
			{type === "Comment" ? (
				<PostHeader pageData={socialPage} postData={messageDetail?.post} />
			) : type === "Chat" ? (
				<ChatHeader userData={messageDetail?.user} />
			) : (
				<>{/* bot type */}</>
			)}
			<div ref={messageContainer} className="message-section">
				{messageList?.map((item, index) => {
					const dateSent = new Date(item?.createdAt)?.toLocaleString();

					let userReply = item?.type; // Bot, Comment, Agent#UserId

					return (
						<div
							key={item?.id ?? index}
							className={`${
								item?.type !== "Comment" ? "page-respond " : ""
							}message-item`}
						>
							<BasicAvatar
								src={
									item?.type !== "Comment"
										? socialPage?.pictureUrl
										: item?.sender?.avatarUrl
								}
							/>
							<Tag
								color={item?.type !== "Comment" && "var(--primary-color)"}
								className="message-chip-container"
							>
								<div className="message-chip-user flex-center">
									<b>
										{item?.type !== "Comment"
											? `${socialPage?.name} (${userReply})`
											: `${item?.sender?.fullName}`}
									</b>
									<span className="message-date">{dateSent}</span>
								</div>
								<span className="message-chip limit-line">{item?.message}</span>
							</Tag>
							{item?.type === "Comment" && (
								<ClassicDropdown
									clickTrigger
									list={listAction}
									handleItemClick={(e) => {
										setMessageReplied(item);
									}}
								>
									<IconMoreButton />
								</ClassicDropdown>
							)}
						</div>
					);
				})}
			</div>
			<div className="respond-section">
				{/* {showRecommend && (
          <div className="recommend-response-container">
            {Array(4)
              .fill()
              .map((_, index) => (
                <Tag key={index} className="recommend-response-chip">
                  <span className="recommend-response limit-line">
                    velit aliquet sagittis id consectetur purus ut
                    faucibus pulvinar elementum integer enim neque
                    volutpat ac tincidunt vitae semper quis lectus
                    nulla at volutpat diam ut venenatis tellus in
                    metus vulputate eu scelerisque felis imperdiet
                  </span>
                </Tag>
              ))}
            <IconButton
              className="recommend-close-icon"
              tooltip="Click to close recommend"
              icon={<CloseOutlined />}
              onClick={() => {
                toggleShowRecommend(false);
              }}
            />
          </div>
        )} */}
				{messageReplied && (
					<div className="reply-placeholder flex-center">
						<div>
							<b>Reply to {messageReplied.sender?.fullName}</b>
							<div className="reply-message limit-line">
								{messageReplied?.message}
							</div>
						</div>
						<IconButton
							tooltip="Click to cancel"
							className="reply-close-icon"
							icon={<CloseOutlined />}
							onClick={() => {
								setMessageReplied(null);
							}}
						/>
					</div>
				)}
				<div className="respose-input-container flex-center">
					<Input.TextArea
						id="respond-input"
						allowClear
						autoSize={{ minRows: 3, maxRows: 3 }}
						// onFocus={() => {
						//   toggleShowRecommend(true);
						// }}
						value={reply}
						onChange={(e) => {
							setReply(e.currentTarget.value);
						}}
						disabled={
							useReplyFbMessage.isLoading || useSaveMessageToSystem.isLoading
						}
					/>
					<IconButton
						icon={<SendOutlined className="respond-icon" />}
						type="link"
						loading={
							useReplyFbMessage.isLoading || useSaveMessageToSystem.isLoading
						}
						onClick={() => {
							useReplyFbMessage.mutate({
								cmtId: messageReplied?.messageId ?? messageSelected?.messageId,
								accessToken: socialPage?.accessToken,
								message: reply,
							});
						}}
					/>
				</div>
			</div>
		</>
	);
}
