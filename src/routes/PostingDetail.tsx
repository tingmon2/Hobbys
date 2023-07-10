// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// @ts-nocheck

import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link, useHistory } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
	postingsObject,
	selectedPostingAtom,
	isNewUserAtom,
	userObjectAtom,
	cartAtom,
	selectedIconAtom,
} from "../atoms";
import {
	authService,
	dbService,
	firebaseInstance,
	storageService,
} from "../fbase";
import styled from "styled-components";
import Carousel from "react-material-ui-carousel";
import { Paper, Button } from "@mui/material";
import carouselStyle from "../styles/Carousel.module.css";
import LoyaltyIcon from "@mui/icons-material/PaidRounded";
import FavoriteBorderIcon from "@mui/icons-material/Favorite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import CommentIcon from "@mui/icons-material/ChatBubbleOutline";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { Prev } from "react-bootstrap/esm/PageItem";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import EditPostingForm from "../components/EditPostingForm";
import CommentList from "../components/CommentList";
import Swal from "sweetalert2";

const PreviewImg = styled.img`
	border-radius: 50%;
	width: 50px;
	height: 50px;
`;

const Container = styled.div`
	font-family: "Noto Sans", sans-serif;
	max-width: 450px;
	margin: 0 auto;
	width: 100%;
	height: 80vh;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const BigContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`;
// max-width: 330px;
// max-hight: 490px;

const Posting = styled.div`
	margin-bottom: 10px;
	padding: 10px;
	width: 90%;
	height: 100vh;
	/* background-color: ${(props) => props.theme.highlightColor}; */
`;

const PostingHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const SaleTag = styled.div`
	font-family: "Sniglet", cursive;
	display: flex;
	align-items: center;
	span {
		margin-left: 5px;
	}
`;

const ProfileTag = styled.div`
	font-family: "Sniglet", cursive;
	font-weight: normal;
	font-size: 20px;
	display: flex;
	align-items: center;
	img {
		margin-right: 5px;
	}
`;

const InputField = styled.input`
	font-family: "Sniglet", cursive;
	max-width: 230px;
	width: 100%;
	padding: 5px;
	margin-bottom: 10px;
	margin-right: 2px;
	font-size: 13px;
	color: black;
	box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px 0px;
	border-radius: 205px 15px 180px 5px/7px 225px 25px 235px;
	border: solid 2px ${(props) => props.theme.secondColor};
`;

const PostingFooter = styled.div``;

const LikeAndComment = styled.div`
	padding-left: 10px;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	span {
	}
`;

const HeartIcon = styled.a`
	margin-left: 2px;
`;

const TextBox = styled.div`
	word-wrap: break-word;
	overflow: auto;
	max-height: 50px;
	margin-bottom: 1px;
	padding: 2px;
`;

const Text = styled.span`
	font-family: "Sniglet", cursive;
`;

const IconElement = styled.a`
	margin: 3px 5px;
`;

const SubmitBtn = styled.a`
	width: 100%;
	font-family: "Sniglet", cursive;
	text-align: center;
	max-width: 100px;
	width: 100%;
	color: black;
	padding: 3px;
	margin: 10px;
	background-color: ${(props) => props.theme.highlightColor};
	letter-spacing: 2px;
	font-size: 13px;
	box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px 0px,
		rgba(0, 0, 0, 0.23) 0px 3px 6px 0px;
	border-radius: 205px 35px 180px 20px/15px 225px 10px 235px;
	border: solid 4px ${(props) => props.theme.highlightColor};
	cursor: pointer;
`;

const GoBackBtn = styled.button`
	display: block;
	width: 100%;

	font-family: "Sniglet", cursive;
	text-align: center;
	max-width: 300px;
	width: 100%;
	color: #ffffff;
	padding: 3px;
	margin: 10px;
	background-color: ${(props) => props.theme.secondColor};
	letter-spacing: 2px;
	font-size: 20px;
	box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px 0px,
		rgba(0, 0, 0, 0.23) 0px 3px 6px 0px;
	border-radius: 205px 35px 180px 20px/15px 225px 10px 235px;
	border: solid 4px ${(props) => props.theme.secondColor};
	cursor: pointer;
`;

const FormContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 320px;
`;

const CommentListContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: space-between;
	font-family: "Sniglet", cursive;
`;

const LikeCount = styled.span`
	text-align: center;
	font-size: 13px;
	font-weight: bold;
	color: #ea2027;
`;

function PostingDetail() {
	const history = useHistory();
	const [isLoading, setIsLoading] = useState(true);
	const [isOwner, setIsOwner] = useState(false);

	const [isEdit, setIsEdit] = useState(false);
	const [comments, setComments] = useState([]);
	const [isLike, setIsLike] = useState(false);
	const [newComment, setNewComment] = useState("");
	const [isCommenting, setIsCommenting] = useState(false);
	const [posting, setPosting] = useState<any>(null);
	const [likeCount, setLikeCount] = useState<number>(0);

	const [cart, setCart] = useRecoilState(cartAtom);
	const selectedPosting = useRecoilValue(selectedPostingAtom);
	const userObject = useRecoilValue(userObjectAtom);
	const selectedIcon = useRecoilValue(selectedIconAtom);

	useEffect(() => {
		fetchCart();
		setPosting(selectedPosting);
		if (posting !== null) {
			if (selectedPosting.creatorUid == userObject.uid) {
				setIsOwner(true);
			}
			console.log(userObject);
			console.log(selectedPosting);
			console.log(selectedPosting.likes?.likerUid);
			if (selectedPosting.likes.likerUid?.includes(userObject.uid)) {
				console.log("like true");
				setIsLike(true);
			}
			dbService
				.collection("Comment")
				.where("postingId", "==", selectedPosting.id)
				.orderBy("timeStamp", "desc")
				.onSnapshot((snapshot) => {
					// console.log(snapshot);
					const commentSnapshot = snapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data(),
					}));
					setComments(commentSnapshot);
				});
			console.log(comments);
			setIsLoading(false);
			if (selectedPosting.likes.likerUid?.length) {
				console.log(selectedPosting.likes.likerUid?.length);
				setLikeCount(selectedPosting.likes.likerUid?.length);
			} else {
				console.log("no likes");
				setLikeCount(0);
			}
		}

		//posting
		//comment
		//like
	}, [posting]);

	function Item(props) {
		// console.log(props);
		return (
			<Paper>
				<img style={{ height: 350, width: 350 }} src={props.item} />
			</Paper>
		);
	}

	const LikeIconClicked = async (event, postingInfo) => {
		event.preventDefault();
		// setSelectedPosting(postingInfo);
		let isCancel = false;
		const like = {
			likerUid: userObject.uid,
			postingId: postingInfo.id,
			creatorDisplayName: postingInfo.creatorDisplayName,
			photoUrl: postingInfo.photoUrl[0],
			category: postingInfo.category,
			timeStamp: Date.now(),
			reply: [],
		};

		const checkCancel = await dbService
			.collection("Like")
			.where("likerUid", "==", userObject.uid)
			.where("postingId", "==", postingInfo.id)
			.get();

		if (checkCancel.docs[0]) isCancel = true;

		if (isCancel) {
			console.log("like cancel true");
			await dbService.doc(`Like/${checkCancel.docs[0].id}`).delete();
			dbService.doc(`Posting/${postingInfo.id}`).update({
				"likes.likerUid": firebaseInstance.firestore.FieldValue.arrayRemove(
					userObject.uid
				),
			});
			setLikeCount((prev) => prev - 1);
			console.log("likeCount " + selectedPosting.likes.likerUid?.length);
		} else {
			await dbService.collection("Like").add(like);

			dbService.doc(`Posting/${postingInfo.id}`).update({
				"likes.likerUid": firebaseInstance.firestore.FieldValue.arrayUnion(
					userObject.uid
				),
			});
			setLikeCount((prev) => prev + 1);
			console.log("likeCount " + selectedPosting.likes.likerUid?.length);
		}
		setIsLike((prev) => !prev);
	};

	const onCancelClicked = () => {
		setIsEdit(false);
	};

	const CommentIconClicked = (event, postingInfo) => {
		event.preventDefault();

		setIsCommenting((prev) => !prev);
	};

	const CommentOnChange = (event) => {
		const {
			target: { value },
		} = event;
		setNewComment(value);
	};

	const CommentSubmitClicked = async (event, postingInfo) => {
		event.preventDefault();
		console.log(newComment);

		const addComment = {
			commenterUid: userObject.uid,
			commenterPhotoURL: userObject.photoURL,
			commeterDisplayName: userObject.displayName,
			postingId: postingInfo.id,
			text: newComment,
			timeStamp: Date.now(),
		};
		await dbService.collection("Comment").add(addComment);
		console.log(addComment);
		// setComments((prev) => [...prev, addComment]);
		setIsCommenting(false);
	};

	const onDeleteClick = async () => {
		Swal.fire({
			title: "Delete This Posting?",
			showDenyButton: true,
			confirmButtonText: "Yes",
			denyButtonText: `No`,
		}).then(async (result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				await dbService.doc(`Posting/${selectedPosting.id}`).delete();
				if (selectedPosting.photoUrl !== "") {
					await storageService.refFromURL(selectedPosting.photoUrl).delete();
					history.push("/Hobbys/");
				}
				Swal.fire("Posting Deleted!", "", "success");
			} else if (result.isDenied) {
				// Swal.fire("Changes are not saved", "", "info");
			}
		});
	};

	function fetchCart() {
		dbService
			.collection("Cart")
			.where("cartOwnerUid", "==", userObject.uid)
			.onSnapshot((snapshot) => {
				const cartSnapshot = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setCart(cartSnapshot.splice(0));
			});
	}

	const AddCartIconClicked = async (postingInfo) => {
		// if user has no cart, create cart first.
		// after adding item, show message box and 'go to cart' button.

		if (cart.length == 0) {
			const cart = {
				cartOwnerUid: userObject.uid,
				items: [
					{
						postingId: postingInfo.id,
						creatorUid: postingInfo.creatorUid,
						creatorDisplayName: postingInfo.creatorDisplayName,
						itemPhoto: postingInfo.photoUrl[0],
						itemName: postingInfo.itemName,
						itemCategory: postingInfo.category,
						itemPrice: postingInfo.price,
					},
				],
			};
			await dbService.collection("Cart").add(cart);
			console.log("cart added");
		} else {
			let itemsArr = cart[0].items;
			let alreadyIn = false;
			console.log(itemsArr);
			itemsArr.forEach((element) => {
				if (element.postingId == postingInfo.id) {
					console.log("duplicated item");
					alreadyIn = true;
				}
			});
			console.log(cart);
			console.log("cart exsist");
			if (!alreadyIn) {
				dbService.doc(`Cart/${cart[0].id}`).update({
					items: firebaseInstance.firestore.FieldValue.arrayUnion({
						postingId: postingInfo.id,
						creatorUid: postingInfo.creatorUid,
						creatorDisplayName: postingInfo.creatorDisplayName,
						itemPhoto: postingInfo.photoUrl[0],
						itemName: postingInfo.itemName,
						itemCategory: postingInfo.category,
						itemPrice: postingInfo.price,
					}),
				});
				// custom message box
				Swal.fire({
					title: "Item Added to your Cart!",
					showDenyButton: true,
					confirmButtonText: "Got It",
					denyButtonText: `Go to Cart`,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						// Swal.fire("Saved!", "", "success");
						history.push(`/postingDetail/${selectedPosting.id}`);
					} else if (result.isDenied) {
						// Swal.fire("Changes are not saved", "", "info");
						history.push("/cart");
					}
				});
			} else {
				Swal.fire({
					title: "Item is Already in Your Cart!",
					showDenyButton: true,
					confirmButtonText: "Got It",
					denyButtonText: `Go to Cart`,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						// Swal.fire("Saved!", "", "success");
						history.push(`/postingDetail/${selectedPosting.id}`);
					} else if (result.isDenied) {
						// Swal.fire("Changes are not saved", "", "info");
						history.push("/cart");
					}
				});
			}
		}
		fetchCart();
	};

	const toggleEditing = () => setIsEdit((prev) => !prev);

	// console.log(comments);

	return (
		<>
			{isLoading ? (
				"Loading..."
			) : (
				<>
					{isOwner ? (
						<>
							<Container>
								<Posting>
									<PostingHeader>
										<ProfileTag>
											<Link to={`/${posting?.creatorUid}/profile`}>
												{posting?.creatorImgUrl ? (
													<PreviewImg src={posting?.creatorImgUrl}></PreviewImg>
												) : (
													<FontAwesomeIcon
														style={{ padding: 6, margin: 5 }}
														icon={faUser}
														color={"#eb4d4b"}
														size="2x"
													/>
												)}
											</Link>
											<Link to={`/${posting?.creatorUid}/profile`}>
												{posting?.creatorDisplayName}
											</Link>
										</ProfileTag>
										{posting?.soldOut ? (
											<SaleTag>
												<LoyaltyIcon style={{ fill: "#b81414" }} />
												<Text>Sold out</Text>
											</SaleTag>
										) : posting?.forSale ? (
											<SaleTag>
												<LoyaltyIcon style={{ fill: "#206a22" }} />
												<Text>For Sale / </Text>
												<Text>Price: ${posting?.price}</Text>
											</SaleTag>
										) : (
											<SaleTag>
												<LoyaltyIcon style={{ fill: "#827C76" }} />
												<Text>Not for Sale</Text>
											</SaleTag>
										)}
									</PostingHeader>

									<Carousel
										className={carouselStyle.detailCarousel}
										navButtonsAlwaysVisible={false}
										autoPlay={false}
									>
										{posting?.photoUrl.map((photo) => (
											<Item item={photo}></Item>
										))}
									</Carousel>
									{isEdit && (
										<BigContainer>
											<FormContainer>
												<EditPostingForm />
												<GoBackBtn onClick={onCancelClicked}>Cancel</GoBackBtn>
											</FormContainer>
										</BigContainer>
									)}
									<PostingFooter>
										<LikeAndComment>
											<div>
												<IconElement
													href="#"
													onClick={(event) =>
														CommentIconClicked(event, selectedPosting)
													}
												>
													<CommentIcon />
												</IconElement>

												{posting?.creatorUid !== userObject.uid &&
													posting?.forSale === true && (
														<IconElement
															href="#"
															onClick={() =>
																AddCartIconClicked(selectedPosting)
															}
														>
															<AddShoppingCartIcon />
														</IconElement>
													)}
											</div>
											<div>
												<IconElement href="#" onClick={toggleEditing}>
													<FontAwesomeIcon icon={faPencilAlt} />
												</IconElement>
												<IconElement href="#" onClick={onDeleteClick}>
													<FontAwesomeIcon icon={faTrash} />
												</IconElement>
											</div>
										</LikeAndComment>
										<TextBox>
											<Text>Item Name: {posting?.itemName}</Text>
										</TextBox>
										<TextBox>
											<Text>Category: {posting?.category}</Text>
										</TextBox>
										<TextBox>
											<Text>Text: {posting?.text}</Text>
										</TextBox>

										{isCommenting && (
											<>
												<InputField
													placeholder="Enter Comment"
													onChange={CommentOnChange}
													type="text"
												/>

												{newComment && (
													<SubmitBtn
														href="#"
														onClick={(event) =>
															CommentSubmitClicked(event, selectedPosting)
														}
													>
														submit
													</SubmitBtn>
												)}
											</>
										)}
									</PostingFooter>
									<CommentListContainer>
										<ul>
											{comments?.map((comment) => (
												<CommentList key={comment.id} comment={comment} />
											))}
										</ul>
									</CommentListContainer>

									<div style={{ width: 300, height: 100 }}></div>
								</Posting>
							</Container>
						</>
					) : (
						<>
							<Container>
								<Posting>
									<PostingHeader>
										<ProfileTag>
											<Link to={`/${posting?.creatorUid}/profile`}>
												{posting?.creatorImgUrl ? (
													<PreviewImg src={posting?.creatorImgUrl}></PreviewImg>
												) : (
													<FontAwesomeIcon
														style={{ padding: 6, margin: 5 }}
														icon={faUser}
														color={"#eb4d4b"}
														size="2x"
													/>
												)}
											</Link>
											<Link to={`/${posting?.creatorUid}/profile`}>
												{posting?.creatorDisplayName}
											</Link>
										</ProfileTag>
										{posting?.soldOut ? (
											<SaleTag>
												<LoyaltyIcon style={{ fill: "#b81414" }} />
												<Text>Sold out</Text>
											</SaleTag>
										) : posting?.forSale ? (
											<SaleTag>
												<LoyaltyIcon style={{ fill: "#206a22" }} />
												<Text>On Sale / </Text>
												<Text>Price: ${posting?.price}</Text>
											</SaleTag>
										) : (
											<SaleTag>
												<LoyaltyIcon style={{ fill: "#827C76" }} />
												<Text>Not for Sale</Text>
											</SaleTag>
										)}
									</PostingHeader>

									<Carousel
										className={carouselStyle.detailCarousel}
										navButtonsAlwaysVisible={false}
										autoPlay={false}
									>
										{posting?.photoUrl.map((photo) => (
											<Item item={photo}></Item>
										))}
									</Carousel>

									<PostingFooter>
										<LikeAndComment>
											{isLike ? (
												<>
													<LikeCount>{likeCount}</LikeCount>
													<HeartIcon
														href="#"
														onClick={(event) =>
															LikeIconClicked(event, selectedPosting)
														}
													>
														<FavoriteBorderIcon style={{ color: "#EA2027" }} />
													</HeartIcon>
												</>
											) : (
												<>
													<LikeCount>{likeCount}</LikeCount>
													<HeartIcon
														href="#"
														onClick={(event) =>
															LikeIconClicked(event, selectedPosting)
														}
													>
														<FavoriteBorderIcon style={{ color: "#303952" }} />
													</HeartIcon>
												</>
											)}
											<IconElement
												href="#"
												onClick={(event) =>
													CommentIconClicked(event, selectedPosting)
												}
											>
												<CommentIcon />
											</IconElement>

											{posting?.creatorUid !== userObject.uid &&
												posting?.forSale === true &&
												posting?.soldOut === false && (
													<IconElement
														href="#"
														onClick={() => AddCartIconClicked(selectedPosting)}
													>
														<AddShoppingCartIcon />
													</IconElement>
												)}
										</LikeAndComment>
										<TextBox>
											<Text>Item Name: {posting?.itemName}</Text>
										</TextBox>
										<TextBox>
											<Text>Category: {posting?.category}</Text>
										</TextBox>
										<TextBox>
											<Text>Text: {posting?.text}</Text>
										</TextBox>
										{isCommenting && (
											<>
												<InputField
													placeholder="Add Comment"
													onChange={CommentOnChange}
													type="text"
												/>
												{newComment && (
													<SubmitBtn
														href="#"
														onClick={(event) =>
															CommentSubmitClicked(event, selectedPosting)
														}
													>
														submit
													</SubmitBtn>
												)}
											</>
										)}
									</PostingFooter>

									<CommentListContainer>
										<ul>
											{comments?.map((comment) => (
												<CommentList key={comment.id} comment={comment} />
											))}
										</ul>
									</CommentListContainer>
									<div style={{ width: 300, height: 100 }}></div>
								</Posting>
							</Container>
						</>
					)}
				</>
			)}
		</>
	);
}

export default PostingDetail;
