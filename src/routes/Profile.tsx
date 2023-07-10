// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// @ts-nocheck
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import {
	Link,
	useLocation,
	useParams,
	useRouteMatch,
	useHistory,
} from "react-router-dom";
import styled from "styled-components";
import { Switch, Route } from "react-router";
import { useQuery } from "react-query";
import { Helmet } from "react-helmet";
import { authService, dbService, storageService } from "../fbase";
import { useEffect, useState } from "react";
import EditProfile from "./EditProfile";
import TradeRecord from "./TradeRecord";
import { v4 as uuidv4 } from "uuid";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
	selectedPostingAtom,
	userObjectAtom,
	postingsObject,
	selectedCommentAtom,
	selectedIconAtom,
} from "../atoms";
import { flexbox } from "@mui/system";
import { Prev } from "react-bootstrap/esm/PageItem";
import AddressInfo from "./AddressInfo";
import PaymentInfo from "./PaymentInfo";
import Receipt from "./Receipt";

const Container = styled.div`
	padding: 0px 20px;
	max-width: 480px;
	margin: 0 auto;
	width: 100%;
	height: 80vh;
`;

const Header = styled.header`
	height: 10vh;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	margin: 0px 10px 10px 10px;
`;

const Title = styled.h1`
	font-family: "Sniglet", cursive;
	font-weight: normal;
	font-size: 30px;
	color: ${(props) => props.theme.displayNameColor};
	margin-left: 15px;
`;

const TitleImage = styled.img`
	width: 60px;
	height: 60px;
	border-radius: 50%;
	margin-top: 5px;
	line-height: 60px;
	text-align: center;
	background-color: ${(props) => props.theme.textColor};
	border: 2px solid ${(props) => props.theme.secondColor};
`;

const Overview = styled.div`
	display: flex;
	justify-content: space-between;
	background-color: #f7d794;
	padding: 10px 20px;
	border-radius: 10px;
	opacity: 90%;
`;

const FollowTab = styled.span`
	font-family: "Sniglet", cursive;
	text-align: center;
	text-transform: uppercase;
	font-size: 12px;
	font-weight: 400;
	background-color: #f7d794;
	padding: 7px 0px;
	border-radius: 10px;
	opacity: 90%;

	a {
		display: block;
	}
`;

const Tab = styled.span<{ isActive: boolean }>`
	font-family: "Sniglet", cursive;
	text-align: center;
	text-transform: uppercase;
	font-size: 12px;
	font-weight: 400;
	background-color: #f7d794;
	/* background-color: #ef5777; */
	padding: 7px 0px;
	border-radius: 10px;
	opacity: 90%;
	color: ${(props) =>
			props.isActive ? props.theme.secondColor : props.theme.textColor}
		a {
		display: block;
	}
`;

const OverviewItem = styled.div`
	font-family: "Sniglet", cursive;
	display: flex;
	flex-direction: column;
	align-items: center;
	span:first-child {
		font-size: 10px;
		font-weight: 400;
		text-transform: uppercase;
		margin-bottom: 5px;
	}
`;

const Tabs = styled.div`
	font-family: "Sniglet", cursive;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	margin: 15px 0px;
	gap: 10px;
`;

const NotMyProfileTabs = styled.div`
	font-family: "Sniglet", cursive;
	display: grid;
	grid-template-columns: repeat(1, 1fr);
	margin: 15px 0px;
	gap: 10px;
`;

const UnFollowTab = styled.span`
	font-family: "Sniglet", cursive;
	color: blanchedalmond;
	text-align: center;
	text-transform: uppercase;
	font-size: 12px;
	font-weight: 400;
	background-color: #ef5777;
	padding: 7px 0px;
	border-radius: 10px;

	a {
		display: block;
	}
`;

const PostingContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-template-rows: repeat(3, 100px);
	grid-auto-rows: 100px;
`;

const Posting = styled.div`
	border: 1px solid #f1f2f6;
	border-radius: 5%;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
	a {
		width: 100%;
		height: 100%;
	}
`;

const PostingCenter = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
	height: 100%;
`;

const PostingPreviewImg = styled.img`
	min-width: 100%;
	min-height: 100%;
	max-width: 100%;
	max-height: 100%;
`;

const Follow = styled.a`
	background-color: #ef5777;
`;

function Profile({ refreshUser }) {
	let { uid } = useParams();

	const history = useHistory();
	const [isLoading, setIsLoading] = useState(true);
	const [isOwner, setIsOwner] = useState(false);
	const [rank, setRank] = useState("");
	const [follower, setFollower] = useState<any>([]);
	const [following, setFollowing] = useState<any>([]);
	const [showPosting, setShowPosting] = useState(true);
	const [showEdit, setShowEdit] = useState(false);
	const [showRecord, setShowRecord] = useState(false);
	const [userData, setUserData] = useState<any>(null);
	const [followInfo, setFollowInfo] = useState<any>(null);
	const [isFollowing, setIsFollowing] = useState(false);
	const [photoURL, setPhotoURL] = useState("");
	const [displayName, setDisplayName] = useState("");

	// current user
	const userObject = useRecoilValue(userObjectAtom);
	// clicked posting
	const [selectedPostingInfo, setSelectedPostingInfo] =
		useRecoilState(selectedPostingAtom);
	// clicked Comment
	const [selectedComment, setSelectedComment] =
		useRecoilState(selectedCommentAtom);

	// console.log(uid);
	const [postings, setPostings] = useRecoilState(postingsObject);
	const setSelectedIcon = useSetRecoilState(selectedIconAtom);

	const editMatch = useRouteMatch(`/${userObject.uid}/profile/edit`);
	const transactionMatch = useRouteMatch(`/${userObject.uid}/profile/record`);

	async function fetchUserPostings(userId) {
		console.log("profile fetch posting");
		dbService
			.collection("Posting")
			.where("creatorUid", "==", userId)
			.orderBy("createdAt", "desc")
			.onSnapshot((snapshot) => {
				// console.log(snapshot);
				const postingSnapshot = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				console.log(postingSnapshot);
				console.log(selectedPostingInfo);
				console.log(postings);
				if (history.location.pathname === `/${uid}/profile`) {
					setPostings(postingSnapshot);
				}
			});
	}

	console.log(history.location.pathname);

	const settingPostings = (postingSnapshot) => {
		setPostings(postingSnapshot);
	};

	const isOwnerChange = (flag) => {
		setIsOwner(flag);
	};

	const PostingIconClicked = (postingInfo) => {
		setSelectedPostingInfo(postingInfo);
		setSelectedComment(null);
	};

	const followBtnClick = () => {
		if (isFollowing) {
			unFollowClicked();
		} else {
			followClicked();
		}
	};

	const followClicked = async () => {
		console.log("follow clicked");
		if (selectedPostingInfo?.creatorUid) {
		}
		const follow = {
			followerUid: userObject.uid,
			followerPhotoURL: userObject.photoURL,
			followerDisplayName: userObject.displayName,
			followingUid:
				selectedPostingInfo?.creatorUid || selectedComment?.commenterUid,
			followingPhotoURL:
				selectedPostingInfo?.creatorImgUrl ||
				selectedComment?.commenterPhotoURL ||
				"",
			followingDisplayName:
				selectedPostingInfo?.creatorDisplayName ||
				selectedComment?.commeterDisplayName,
		};

		const element = await dbService.collection("Follow").add(follow);
		setIsFollowing(true);
		setFollowInfo(element);
		// 레코드 저장하고 setFollowInfo로 현재 저장된 기록을 갖고 있어야 함.

		// retrieveFollowInfo(
		// 	selectedPostingInfo?.creatorUid || selectedComment?.commenterUid
		// );
	};

	const unFollowClicked = async () => {
		setFollowInfoCheck();
		console.log("unfollow clicked");

		console.log(followInfo);
		await dbService.doc(`Follow/${followInfo.id}`).delete();
		setIsFollowing(false);
		setFollowInfo(null);
	};

	const setFollowInfoCheck = () => {
		console.log(follower);
		follower.forEach((element) => {
			if (element.followerUid === userObject.uid) {
				console.log("following true");
				console.log(element);
				setFollowInfo(element);
			}
		});
	};

	const setDisplayNameAndPhotoURL = (name, url) => {
		setDisplayName(name);
		setPhotoURL(url);
	};

	const retrieveFollowInfo = async (uid, flag) => {
		// retrieve people who is followed by user
		// 주체
		dbService
			.collection("Follow")
			.where("followerUid", "==", uid)
			.onSnapshot((snapshot) => {
				const followSnapshot = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setFollowing(followSnapshot);
			});

		// retrieve people who follow this user
		// 대상
		dbService
			.collection("Follow")
			.where("followingUid", "==", uid)
			.onSnapshot((snapshot) => {
				const followSnapshot = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setFollower(followSnapshot);
			});

		// selectedPostingInfo?.creatorUid || selectedComment?.commenterUid,
		if (flag) {
			if (selectedPostingInfo != null) {
				const isFollowCheck = await dbService
					.collection("Follow")
					.where("followerUid", "==", userObject.uid)
					.where("followingUid", "==", selectedPostingInfo.creatorUid)
					.get();

				if (isFollowCheck.docs[0] != undefined) {
					if (isFollowCheck.docs[0].data().followerUid === userObject.uid) {
						setIsFollowing(true);
					} else {
						setIsFollowing(false);
					}
				}
			} else {
				const isFollowCheck = await dbService
					.collection("Follow")
					.where("followerUid", "==", userObject.uid)
					.where("followingUid", "==", selectedComment.commenterUid)
					.get();

				if (isFollowCheck.docs[0] != undefined) {
					if (isFollowCheck.docs[0].data().followerUid === userObject.uid) {
						setIsFollowing(true);
					} else {
						setIsFollowing(false);
					}
				}
			}
		}
	};

	useEffect(async () => {
		setSelectedIcon("profile");
		setPostings(null);
		console.log(selectedPostingInfo);
		console.log(selectedComment);
		if (
			userObject?.uid === selectedPostingInfo?.creatorUid ||
			userObject?.uid === selectedComment?.commenterUid
		) {
			setSelectedPostingInfo(null);
			setSelectedComment(null);

			// console.log("true is running");
		} else {
			isOwnerChange(false);
		}
		// 본인
		if (selectedPostingInfo === null && selectedComment === null) {
			console.log("I'm owner");
			isOwnerChange(true);

			const userInfo = await dbService
				.collection("UserInfo")
				.where("uid", "==", userObject.uid)
				.get();
			setRank(userInfo.docs[0]?.data().rank);
			setUserData(userInfo);

			setDisplayNameAndPhotoURL(userObject.displayName, userObject.photoURL);

			retrieveFollowInfo(userObject.uid, false);

			fetchUserPostings(userObject.uid);
		}
		// 남의 페이지(본인 아님)
		else if (selectedPostingInfo !== null) {
			console.log("from posting link");
			if (selectedPostingInfo.creatorUid === userObject.uid) {
				isOwnerChange(true);
			}

			const userInfo = await dbService
				.collection("UserInfo")
				.where("uid", "==", selectedPostingInfo.creatorUid)
				.get();
			setRank(userInfo.docs[0].data().rank);
			setUserData(userInfo);

			setDisplayName(selectedPostingInfo.creatorDisplayName);
			setPhotoURL(selectedPostingInfo.creatorImgUrl);

			setDisplayNameAndPhotoURL(
				selectedPostingInfo.creatorDisplayName,
				selectedPostingInfo.creatorImgUrl
			);

			retrieveFollowInfo(selectedPostingInfo.creatorUid, true);

			// follower.map(
			// 	(doc) => doc.followerUid === userObject.uid && { setFollowInfo(doc); }
			// );

			fetchUserPostings(selectedPostingInfo.creatorUid);
		} else if (selectedComment !== null) {
			console.log("from comment link");
			if (selectedComment.commenterUid === userObject.uid) {
				isOwnerChange(true);
			}
			const userInfo = await dbService
				.collection("UserInfo")
				.where("uid", "==", selectedComment.commenterUid)
				.get();
			setRank(userInfo.docs[0].data().rank);
			setUserData(userInfo);

			setDisplayNameAndPhotoURL(
				selectedComment.commeterDisplayName,
				selectedComment.commenterPhotoURL
			);

			retrieveFollowInfo(selectedComment.commenterUid, true);

			// follower.map(
			// 	(doc) => doc.followerUid === userObject.uid && { setFollowInfo(doc); }
			// );

			fetchUserPostings(selectedComment.commenterUid);
		}
		setIsLoading(false);
	}, [uid]);

	// console.log(followInfo);
	// console.log(follower);
	// console.log(uid);
	// console.log(photoURL);

	const changeBackgroundColor = (page) => {
		if (page === "edit") {
			document.getElementById("editTab").style.backgroundColor = "#ef5777";
			document.getElementById("transactionTab").style.backgroundColor =
				"#f7d794";
			document.getElementById("editTab").style.color = "#f7d794";
			document.getElementById("transactionTab").style.color = "black";
		} else {
			document.getElementById("editTab").style.backgroundColor = "#f7d794";
			document.getElementById("transactionTab").style.backgroundColor =
				"#ef5777";
			document.getElementById("editTab").style.color = "black";
			document.getElementById("transactionTab").style.color = "#f7d794";
		}
	};

	return (
		<>
			{isLoading ? (
				"Loading..."
			) : (
				<Container>
					{isOwner ? (
						<Header>
							<label>
								{photoURL !== null ? (
									<TitleImage src={photoURL} alt="Profile" />
								) : (
									<FontAwesomeIcon icon={faUser} color={"#eb4d4b"} size="2x" />
								)}
							</label>
							<Title>{displayName}</Title>
						</Header>
					) : (
						<Header>
							<label>
								{photoURL !== null ? (
									<TitleImage src={photoURL} alt="Profile" />
								) : (
									<FontAwesomeIcon icon={faUser} color={"#eb4d4b"} size="2x" />
								)}
							</label>
							<Title>{displayName}</Title>
						</Header>
					)}

					<Overview>
						<OverviewItem>
							<span>Rank</span>
							<span>{rank}</span>
						</OverviewItem>
						<OverviewItem>
							<span>Follower</span>
							<span>{follower.length}</span>
						</OverviewItem>
						<OverviewItem>
							<span>Following</span>
							<span>{following.length}</span>
						</OverviewItem>
					</Overview>
					{isOwner ? (
						<Tabs>
							<Tab id="editTab" isActive={editMatch !== null}>
								<Link
									onClick={() => {
										if (showRecord === true) {
											setShowRecord(false);
											setShowPosting(false);
											setShowEdit(true);
										} else {
											setShowEdit((prev) => !prev);
											setShowPosting((prev) => !prev);
										}
										changeBackgroundColor("edit");
									}}
									to={`/${userObject.uid}/profile/edit`}
								>
									<span>Edit Profile</span>
								</Link>
							</Tab>
							<Tab id="transactionTab" isActive={transactionMatch !== null}>
								<Link
									onClick={() => {
										if (showEdit === true) {
											setShowEdit(false);
											setShowPosting(false);
											setShowRecord(true);
										} else {
											setShowRecord((prev) => !prev);
											setShowPosting((prev) => !prev);
										}
										changeBackgroundColor("transaction");
									}}
									to={`/${userObject.uid}/profile/record`}
								>
									Transactions
								</Link>
							</Tab>
						</Tabs>
					) : (
						<NotMyProfileTabs>
							{!isFollowing ? (
								<FollowTab onMouseEnter={() => setFollowInfoCheck()}>
									<a href="#" onClick={followClicked}>
										Follow This User
									</a>
								</FollowTab>
							) : (
								<UnFollowTab onMouseEnter={() => setFollowInfoCheck()}>
									<a href="#" onClick={unFollowClicked}>
										You Are Following
									</a>
								</UnFollowTab>
							)}
						</NotMyProfileTabs>
					)}

					{showPosting && !showEdit && !showRecord ? (
						<PostingContainer>
							{postings?.map((posting, index) => (
								<Posting key={index}>
									<Link
										to={`/postingDetail/${posting?.id}`}
										onClick={() => PostingIconClicked(posting)}
										onMouseEnter={() => PostingIconClicked(posting)}
									>
										<PostingCenter>
											<PostingPreviewImg src={posting.photoUrl[0]} />
										</PostingCenter>
									</Link>
								</Posting>
							))}
						</PostingContainer>
					) : (
						<Switch>
							<Route path={`/${userObject.uid}/profile/edit`}>
								<EditProfile
									userObject={userObject}
									refreshUser={refreshUser}
									userInfo={userData}
									uid={uid}
								/>
							</Route>
							<Route path={`/${userObject.uid}/profile/record`}>
								<TradeRecord uid={uid} />
							</Route>
							<Route path={`/${userObject.uid}/profile/address`}>
								<AddressInfo fromCheckout={false} />
							</Route>
							<Route path={`/${userObject.uid}/profile/payment`}>
								<PaymentInfo fromCheckout={false} />
							</Route>
							<Route path={`/${userObject.uid}/profile/receipt`}>
								<Receipt fromCheckout={false} />
							</Route>
						</Switch>
					)}
					<div style={{ width: 300, height: 150 }}></div>
				</Container>
			)}
		</>
	);
}

export default Profile;
