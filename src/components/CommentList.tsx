// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// @ts-nocheck

import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
	selectedCommentAtom,
	selectedPostingAtom,
	userObjectAtom,
} from "../atoms";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dbService } from "../fbase";

const PreviewImg = styled.img`
	border-radius: 50%;
	width: 30px;
	height: 30px;
`;

const ProfileTag = styled.div`
	display: flex;
	align-items: center;
	img {
		margin-right: 3px;
	}
`;

const IconElement = styled.a`
	margin: 10px;
`;

function CommentList({ comment }) {
	const userObject = useRecoilValue(userObjectAtom);
	const [selectedPosting, setSelectedPosting] =
		useRecoilState(selectedPostingAtom);
	const [selectedComment, setSelectedComment] =
		useRecoilState(selectedCommentAtom);
	const [isOwner, setIsOwner] = useState(false);
	const [commentInfo, setCommentInfo] = useState(null);

	useEffect(() => {
		if (userObject.uid === selectedPosting.creatorUid) {
			setIsOwner(true);
		}
		console.log(comment);

		setCommentInfo(() => {});
	}, []);

	const CommentIconClicked = () => {
		console.log(comment);

		setSelectedComment(comment);
		console.log(selectedComment);
	};

	const clearSelectedPosting = () => {
		setSelectedPosting(null);
		console.log("clear selected posting");
	};

	const onDeleteClick = async (event) => {
		event.preventDefault();
		await dbService.doc(`Comment/${comment.id}`).delete();
	};

	// need to create onDelete function
	//프리뷰이미지와 디스플레이네임 코멘트를 단 유저 것으로 바꿔야함
	return (
		<>
			{userObject.uid == comment?.commenterUid ? (
				<>
					<li>
						<ProfileTag onMouseEnter={() => CommentIconClicked()}>
							<Link
								to={`/${comment?.commenterUid}/profile`}
								onClick={() => clearSelectedPosting()}
							>
								<PreviewImg src={comment?.commenterPhotoURL}></PreviewImg>
							</Link>
							{comment?.commeterDisplayName}
						</ProfileTag>
						<span>{comment?.text}</span>
						<IconElement href="#" onClick={onDeleteClick}>
							<FontAwesomeIcon icon={faTrash} />
						</IconElement>
					</li>
				</>
			) : (
				<>
					<li>
						<ProfileTag onMouseEnter={() => CommentIconClicked()}>
							<Link
								to={`/${comment?.commenterUid}/profile`}
								onClick={() => clearSelectedPosting()}
							>
								<PreviewImg src={comment?.commenterPhotoURL}></PreviewImg>
							</Link>
							{comment?.commeterDisplayName}
						</ProfileTag>
						<span>{comment?.text}</span>
						{isOwner && (
							<IconElement href="#" onClick={onDeleteClick}>
								<FontAwesomeIcon icon={faTrash} />
							</IconElement>
						)}
					</li>
				</>
			)}
		</>
	);
}

export default CommentList;
