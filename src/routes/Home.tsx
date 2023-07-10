// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// @ts-nocheck
// import firebase from "../fbase";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link, useHistory } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { fetchPosting } from "../api";
import {
	postingsObject,
	selectedPostingAtom,
	isNewUserAtom,
	userObjectAtom,
	selectedCommentAtom,
	cartAtom,
	selectedIconAtom,
	isVisitorAtom,
} from "../atoms";
import { authService, dbService, firebaseInstance } from "../fbase";
import styled from "styled-components";
import Carousel from "react-material-ui-carousel";
import { Paper, Button } from "@mui/material";
import carouselStyle from "../styles/Carousel.module.css";
import LoyaltyIcon from "@mui/icons-material/PaidRounded";
import FavoriteBorderIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/ChatBubbleOutline";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Swal from "sweetalert2";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PreviewImg = styled.img`
	border-radius: 50%;
	width: 45px;
	height: 45px;
`;

const Container = styled.div`
	max-width: 480px;
	margin: 0 auto;
	width: 100%;
	height: 80vh;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const PostingContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(1, 1fr);
	grid-template-rows: repeat(1, 550px);
	grid-auto-rows: 550px;
	z-index: 0;
	max-width: 400px;
	/* background-color: ${(props) => props.theme.postingBgColor}; */
`;

const Posting = styled.div`
	font-size: 15px;
	padding: 2px;
	margin: 2px;
	width: 100%;
	max-width: 350px;
	border-bottom: 0.2px solid #c9cdd2;
	box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 1px 0px,
		rgba(0, 0, 0, 0.1) 0px 4px 2px 0px;
	border-radius: 75px 5px 75px 5px/5px 75px 5px 75px;
	border: solid 4px ${(props) => props.theme.secondColor};
	//max-width: 475px;
	//max-hight: 490px;
`;

const PostingHeader = styled.div`
	font-family: "Hammersmith One", sans-serif;
	font-weight: bold;
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin: 2px;
	width: 97%;
	box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 1px 0px,
		rgba(0, 0, 0, 0.1) 0px 4px 2px 0px;
	border-radius: 75px 15px 180px 17px/15px 55px 10px 105px;
	border: solid 3px ${(props) => props.theme.mainColor};
`;

const SaleTag = styled.div`
	font-family: "Sniglet", cursive;
	font-weight: normal;
	display: flex;
	align-items: center;
	margin-right: 10px;
	span {
		margin-left: 2px;
		margin-top: 2px;
	}
`;

const ProfileTag = styled.div`
	display: flex;
	align-items: center;
	padding-bottom: 3px;
	img {
		margin: 5px;
		margin-bottom: -2px;
		box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
			rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
	}
`;

const InputField = styled.input`
	font-family: "Sniglet", cursive;
	max-width: 260px;
	width: 100%;
	padding: 5px;
	margin-top: 5px;
	margin-bottom: 5px;
	margin-left: 3px;
	font-size: 13px;
	color: black;
	box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px 0px;
	border-radius: 205px 15px 180px 5px/7px 225px 25px 235px;
	border: solid 2px ${(props) => props.theme.secondColor};
`;

const PostingFooter = styled.div`
	margin-left: 3px;
	display: flex;
	align-items: center;
	a {
		padding-left: 4px;
	}
`;

const Footer = styled.div`
	display: flex;
	align-items: center;
	margin: 2px;
	width: 97%;
	box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 1px 0px,
		rgba(0, 0, 0, 0.1) 0px 4px 2px 0px;
	border-radius: 75px 15px 180px 17px/15px 55px 10px 105px;
	border: solid 3px ${(props) => props.theme.mainColor};
`;

const LikeAndComment = styled.div``;

const TextBox = styled.div`
	padding: 3px;
	margin: 3px;
	word-wrap: break-word;
	overflow: auto;
	max-height: 50px;
	-ms-overflow-style: none;
	scrollbar-width: none;
	-webkit-scrollbar: none;
`;

const CartIcon = styled.a`
	cursor: pointer;
`;

const Price = styled.div`
	font-size: 18px;
	margin-right: 10px;
`;

const UserName = styled.div`
	margin-top: 5px;
	font-family: "Sniglet", cursive;
	font-weight: normal;
	font-size: 18px;
`;

const SubmitBtn = styled.a`
	width: 100%;
	font-family: "Sniglet", cursive;
	text-align: center;
	max-width: 80px;
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

function Home() {
	const history = useHistory();
	const [likeList, setLikeList] = useState<any>([]);
	const [userInfo, setUserInfo] = useState<any>([]);
	const [comment, setComment] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [isCommenting, setIsCommenting] = useState(false);

	// recoil
	const [postings, setPostings] = useRecoilState(postingsObject);
	const userObject = useRecoilValue(userObjectAtom);
	const [selectedPosting, setSelectedPosting] =
		useRecoilState(selectedPostingAtom);
	const setSelectedComment = useSetRecoilState(selectedCommentAtom);
	const [cart, setCart] = useRecoilState(cartAtom);
	const setSelectedIcon = useSetRecoilState(selectedIconAtom);
	const [isVisitor, setIsVisitor] = useRecoilState(isVisitorAtom);

	async function fetchHomePostings() {
		dbService
			.collection("Posting")
			.orderBy("createdAt", "desc")
			.onSnapshot((snapshot) => {
				// console.log(snapshot);
				const postingSnapshot = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				console.log(postingSnapshot);
				if (history.location.pathname === `/Hobbys/`) {
					setPostings(postingSnapshot);
				}
			});
	}

	function fetchLike() {
		dbService
			.collection("Like")
			.where("likerUid", "==", userObject.uid)
			.onSnapshot((snapshot) => {
				const likeSnapshot = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setLikeList(likeSnapshot);
			});
	}

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

	async function fetchUserInfo(uid) {
		dbService
			.collection("UserInfo")
			.where("uid", "==", uid)
			.onSnapshot((snapshot) => {
				const recordSnapshot = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				// console.log(recordSnapshot);
				if (recordSnapshot[0]?.isPromoted === true) {
					dbService.doc(`UserInfo/${recordSnapshot[0].id}`).update({
						isPromoted: false,
					});
					Swal.fire(
						{
							title: "Congratulation! \n You are promoted!",
							confirmButtonText: "Got It",
						},
						"",
						"success"
					).then((result) => {
						/* Read more about isConfirmed, isDenied below */
						if (result.isConfirmed) {
							Swal.fire("Your Rank is " + recordSnapshot[0].rank, "", "info");
						}
					});
				}
				setUserInfo(recordSnapshot);
			});
	}

	const welcome = () => {
		if (isVisitor === true) {
			setIsVisitor(false);
			Swal.fire(
				{
					title: "Welcome Recruiter!",
					confirmButtonText: "Hello!",
				},
				"",
				"success"
			).then((result) => {
				/* Read more about isConfirmed, isDenied below */
				if (result.isConfirmed) {
					Swal.fire("Please Test This App on Moblie Environment", "", "info");
				}
			});
		}
	};
	useEffect(() => {
		fetchLike();
		fetchCart();
		setIsLoading(false);
		fetchHomePostings();
		fetchUserInfo(userObject.uid);
		setSelectedIcon("home");
	}, []);

	function Item(props) {
		// console.log(props);
		return (
			<Paper>
				<img style={{ height: 350, width: 350 }} src={props.item} />
			</Paper>
		);
	}

	const PostingIconClicked = (postingInfo) => {
		console.log(postingInfo);
		setSelectedPosting(postingInfo);
		setSelectedComment(null);
	};

	const AddCartIconClicked = async (postingInfo) => {
		// if user has no cart, create cart first.
		// after adding item, show message box and 'go to cart' button.
		setSelectedPosting(postingInfo);
		setSelectedComment(null);

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
						// soldOut: postingInfo.soldOut,
					},
				],
			};
			await dbService.collection("Cart").add(cart);
			console.log("cart added");
			Swal.fire({
				title: "Item Added to your Cart!",
				showDenyButton: true,
				confirmButtonText: "Got It",
				denyButtonText: `Go to Cart`,
			}).then((result) => {
				/* Read more about isConfirmed, isDenied below */
				if (result.isConfirmed) {
					// Swal.fire("Saved!", "", "success");
				} else if (result.isDenied) {
					// Swal.fire("Changes are not saved", "", "info");
					history.push("/cart");
				}
			});
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
						// soldOut: postingInfo.soldOut,
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
					} else if (result.isDenied) {
						// Swal.fire("Changes are not saved", "", "info");
						history.push("/cart");
					}
				});
			}
		}
		fetchCart();
	};

	const LikeIconClicked = async (event, postingInfo) => {
		event.preventDefault();
		setSelectedPosting(postingInfo);
		setSelectedComment(null);
		let isCancel = false;
		const like = {
			likerUid: userObject.uid,
			postingId: postingInfo.id,
			creatorDisplayName: postingInfo.creatorDisplayName,
			photoUrl: postingInfo.photoUrl[0],
			category: postingInfo.category,
			timeStamp: Date.now(),
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
		} else {
			await dbService.collection("Like").add(like);
			console.log("like clicked");
			dbService.doc(`Posting/${postingInfo.id}`).update({
				"likes.likerUid": firebaseInstance.firestore.FieldValue.arrayUnion(
					userObject.uid
				),
			});
		}
	};

	const PaintLikeIcon = (postingInfo) => {
		const likeInfo = postingInfo.likes.likerUid.map((uid) => uid);

		// console.log(likeInfo, postingInfo.id);

		if (likeInfo.length !== 0) {
			for (var i = 0; i < likeInfo.length; i++) {
				if (likeInfo[i] == userObject?.uid) {
					// console.log("true for ", postingInfo.id);
					return true;
				}
			}
		}
		// console.log("false for ", postingInfo.id);
		return false;
	};

	const CommentIconClicked = (event, postingInfo) => {
		event.preventDefault();
		if (postingInfo.id == selectedPosting?.id) {
			setIsCommenting((prev) => !prev);
		} else if (postingInfo.id !== selectedPosting?.id) {
			setIsCommenting(true);
			setSelectedPosting(postingInfo);
			setSelectedComment(null);
		}
	};

	const CommentOnChange = (event) => {
		const {
			target: { value },
		} = event;
		setComment(value);
	};

	const CommentSubmitClicked = async (event, postingInfo) => {
		if (comment !== "") {
			event.stopPropagation();
			console.log(comment);
			const newComment = {
				commenterUid: userObject.uid,
				commenterPhotoURL: userObject.photoURL,
				commeterDisplayName: userObject.displayName,
				postingId: postingInfo.id,
				text: comment,
				timeStamp: Date.now(),
				reply: [],
			};
			await dbService.collection("Comment").add(newComment);
		} else {
			history.push("/Hobbys/");
		}
	};

	return (
		<div>
			{isLoading ? (
				"Loading..."
			) : (
				<>
					{isVisitor && <>{welcome()}</>}
					{postings && (
						<Container>
							<PostingContainer>
								{postings.map((item, index) => (
									<Posting key={index}>
										<PostingHeader>
											<ProfileTag>
												<Link
													to={`/${item?.creatorUid}/profile`}
													onClick={() => PostingIconClicked(item)}
												>
													{item.creatorImgUrl ? (
														<PreviewImg
															key={index}
															src={item.creatorImgUrl}
														></PreviewImg>
													) : (
														<FontAwesomeIcon
															style={{ padding: 6, margin: 5 }}
															icon={faUser}
															color={"#eb4d4b"}
															size="2x"
														/>
													)}
												</Link>
												<UserName>
													<Link
														to={`/${item?.creatorUid}/profile`}
														onClick={() => PostingIconClicked(item)}
													>
														{item.creatorDisplayName}
													</Link>
												</UserName>
											</ProfileTag>
											{item.soldOut ? (
												<SaleTag>
													<LoyaltyIcon style={{ fill: "#b81414" }} />
													Sold Out
												</SaleTag>
											) : item.forSale ? (
												<SaleTag>
													<LoyaltyIcon style={{ fill: "#206a22" }} />
													<Price> {item.price}</Price>
												</SaleTag>
											) : (
												<SaleTag>
													<LoyaltyIcon style={{ fill: "#827C76" }} />
													Not for Sale
												</SaleTag>
											)}
										</PostingHeader>

										<Carousel
											className={carouselStyle.homeCarousel}
											navButtonsAlwaysVisible={false}
											autoPlay={false}
										>
											{item.photoUrl.map((photo) => (
												<>
													<Link
														to={`/postingDetail/${selectedPosting?.id}`}
														onClick={() => PostingIconClicked(item)}
														onMouseEnter={() => PostingIconClicked(item)}
													>
														<Item key={index} item={photo}></Item>
													</Link>
												</>
											))}
										</Carousel>

										<PostingFooter>
											{item.creatorUid !== userObject?.uid && (
												<LikeAndComment>
													{likeList.length !== 0 && item.likes.likerUid ? (
														PaintLikeIcon(item) == true ? (
															<>
																<a
																	href="#"
																	onClick={(event) =>
																		LikeIconClicked(event, item)
																	}
																>
																	<FavoriteBorderIcon
																		style={{ color: "#EA2027" }}
																	/>
																</a>
															</>
														) : (
															<>
																<a
																	href="#"
																	onClick={(event) =>
																		LikeIconClicked(event, item)
																	}
																>
																	<FavoriteBorderIcon
																		style={{ color: "#303952" }}
																	/>
																</a>
															</>
														)
													) : (
														<a
															href="#"
															onClick={(event) => LikeIconClicked(event, item)}
														>
															<FavoriteBorderIcon
																style={{ color: "#303952" }}
															/>
														</a>
													)}
												</LikeAndComment>
											)}

											<LikeAndComment>
												<a
													href="#"
													onClick={(event) => CommentIconClicked(event, item)}
												>
													<CommentIcon />
												</a>

												{item.creatorUid !== userObject?.uid &&
													item.forSale === true &&
													item.soldOut === false && (
														<CartIcon onClick={() => AddCartIconClicked(item)}>
															<AddShoppingCartIcon />
														</CartIcon>
													)}
											</LikeAndComment>
										</PostingFooter>
										<PostingFooter>
											{!isCommenting && (
												<TextBox>
													<span>{item.text}</span>
												</TextBox>
											)}
											{isCommenting && item.id == selectedPosting.id && (
												<>
													<InputField
														onChange={CommentOnChange}
														type="text"
														placeholder="Enter Comment"
													/>
													{comment && (
														<SubmitBtn>
															<Link
																to={`/postingDetail/${selectedPosting?.id}`}
																onClick={(event) =>
																	CommentSubmitClicked(event, item)
																}
															>
																submit
															</Link>
														</SubmitBtn>
													)}
												</>
											)}
										</PostingFooter>
										<div style={{ width: 300, height: 150 }}></div>
									</Posting>
								))}
							</PostingContainer>
						</Container>
					)}
				</>
			)}
		</div>
	);
}

export default Home;
