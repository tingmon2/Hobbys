// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// @ts-nocheck
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import {
	addressInfoAtom,
	cartAtom,
	cartItemsAtom,
	paymentInfoAtom,
	priceTotalInfoAtom,
	totalInfoAtom,
	uidAtom,
	userObjectAtom,
} from "../atoms";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import {
	faCcVisa,
	faCcAmex,
	faCcMastercard,
	faCcJcb,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dbService, firebaseInstance } from "../fbase";
import { Link, useHistory } from "react-router-dom";
import { Collapse, FormControlLabel, Switch } from "@mui/material";
import Swal from "sweetalert2";

const Container = styled.div`
	max-width: 480px;
	margin: 0 auto;
	width: 100%;
	height: 80vh;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const Shipto = styled.div`
	display: flex;
	justify-content: flex-start;
	flex-direction: column;
	align-items: start;
	background-color: ${(props) => props.theme.postingBgColor};
	margin: 5px 5px;
	width: 100%;
`;

const PaymentDetails = styled.div`
	display: flex;
	justify-content: flex-start;
	flex-direction: column;
	align-items: start;
	background-color: ${(props) => props.theme.postingBgColor};
	margin: 5px 5px;
	width: 100%;
`;

const BillingAddress = styled.div`
	display: flex;
	justify-content: flex-start;
	flex-direction: column;
	align-items: start;
	background-color: ${(props) => props.theme.postingBgColor};
	margin: 5px 5px;
	width: 100%;
`;

const Total = styled.div`
	margin-top: 5px;
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	align-items: start;
	width: 100%;
	background-color: ${(props) => props.theme.postingBgColor};
`;

const Label = styled.div`
	display: flex;
	justify-content: space-between;
	width: 100%;
`;

const Text = styled.span`
	margin: 2px 5px;
	font-size: 15px;
`;

const TotalText = styled.span`
	color: ${(props) => props.theme.highlightColor};
	margin: 20px 5px;
	font-weight: bold;
`;

const HeaderText = styled.span`
	color: ${(props) => props.theme.highlightColor};
	margin: 2px 5px;
	font-weight: bold;
`;

const SubmitBtn = styled.button`
	font-family: "Sniglet", cursive;
	text-align: center;
	padding: 10px;
	margin-top: 10px;
	margin-bottom: 10px;
	background-color: ${(props) => props.theme.highlightColor};
	font-size: 20px;
	letter-spacing: 2px;
	box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 1px 0px,
		rgba(0, 0, 0, 0.1) 0px 4px 2px 0px;
	border-radius: 205px 35px 180px 20px/15px 225px 10px 235px;
	border: solid 4px ${(props) => props.theme.highlightColor};
	cursor: pointer;
`;

const BackBtn = styled.button`
	font-family: "Sniglet", cursive;
	text-align: center;
	color: #ffffff;
	padding: 10px;
	margin-top: 10px;
	margin-bottom: 120px;
	background-color: ${(props) => props.theme.secondColor};
	font-size: 16px;
	letter-spacing: 2px;
	box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 1px 0px,
		rgba(0, 0, 0, 0.1) 0px 4px 2px 0px;
	border-radius: 205px 35px 180px 20px/15px 225px 10px 235px;
	border: solid 4px ${(props) => props.theme.secondColor};
	cursor: pointer;
`;

const DisabledBtn = styled.button`
	font-family: "Sniglet", cursive;
	text-align: center;
	padding: 10px;
	margin-top: 10px;
	margin-bottom: 10px;
	background-color: ${(props) => props.theme.redColor};
	font-size: 16px;
	color: ${(props) => props.theme.logoColor};
	letter-spacing: 2px;
	box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 1px 0px,
		rgba(0, 0, 0, 0.1) 0px 4px 2px 0px;
	border-radius: 205px 35px 180px 20px/15px 225px 10px 235px;
	border: solid 4px ${(props) => props.theme.redColor};
	cursor: not-allowed;
`;

function Checkout() {
	const history = useHistory();
	const [isLoading, setIsLoading] = useState(true);
	const [userInfo, setUserInfo] = useState<any>([]);
	const [sellerInfo, setSellerInfo] = useState<any>([]);
	const [isReady, setIsReady] = useState(false);
	const [hasIssue, setHasIssue] = useState(false);
	// const [sellerArr, setSellerArr] = useState<any>([]);

	const uid = useRecoilValue(uidAtom);
	const cartItems = useRecoilValue(cartItemsAtom);
	const cart = useRecoilValue(cartAtom);
	const userObject = useRecoilValue(userObjectAtom);
	const priceTotalInfo = useRecoilValue(priceTotalInfoAtom);
	const [paymentInfo, setPaymentInfo] = useRecoilState(paymentInfoAtom);
	const [addressInfo, setAddressInfo] = useRecoilState(addressInfoAtom);

	const [address, setAddress] = useState<any>(null);
	const [payment, setPayment] = useState<any>(null);
	const [priceTotal, setPriceTotal] = useState<any>(null);

	// UserInfo of buyer
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
				setUserInfo(recordSnapshot);
			});
	}

	// UserInfo of sellers
	async function fetchSellerUserInfo() {
		let sellers = [];
		cartItems?.map(async (element) => {
			let sellerInfo = await dbService
				.collection("UserInfo")
				.where("uid", "==", element.creatorUid)
				.get();
			let sellerUserInfoId = sellerInfo.docs.map((doc) => doc.id);
			let sellerPoint = sellerInfo.docs[0].data().sellerPoint;
			let sellerBuyerPoint = sellerInfo.docs[0].data().buyerPoint;
			let sellerRank = sellerInfo.docs[0].data().rank;
			let sellerIsPromoted = sellerInfo.docs[0].data().isPromoted;
			const seller = {
				sellerUserInfoId: sellerUserInfoId,
				sellerPoint: sellerPoint,
				sellerRank: sellerRank,
				sellerIsPromoted: sellerIsPromoted,
				sellerBuyerPoint: sellerBuyerPoint,
				uid: element.creatorUid,
				postingId: element.postingId,
				price: element.itemPrice,
			};
			sellers.push(seller);
		});
		console.log(sellers);
		setSellerInfo(sellers);
	}

	async function fetchPaymentInfo(uid) {
		dbService
			.collection("PaymentInfo")
			.where("uid", "==", uid)
			.onSnapshot((snapshot) => {
				const paymentSnapshot = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				if (paymentSnapshot[0].vendor == "") {
					console.log("asdf");
					setIsReady(false);
					setHasIssue(true);
				} else {
					setIsReady(true);
				}
				setPayment(paymentSnapshot);
				setPaymentInfo(paymentSnapshot);
			});
	}

	async function fetchAddressInfo(uid) {
		dbService
			.collection("AddressInfo")
			.where("uid", "==", uid)
			.onSnapshot((snapshot) => {
				const addressSnapshot = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				if (
					addressSnapshot[0].shippingAddress.postalcode == "" ||
					addressSnapshot[0].billingAddress.postalcode == ""
				) {
					console.log("zxvv");
					setIsReady(false);
					setHasIssue(true);
				} else {
					setIsReady(true);
				}
				setAddress(addressSnapshot);
				setAddressInfo(addressSnapshot);
			});
	}

	//
	useEffect(() => {
		if (address == null || payment == null || priceTotal == null) {
			console.log("something is null");
			fetchSellerUserInfo();
			fetchPaymentInfo(uid);
			fetchAddressInfo(uid);
			fetchUserInfo(uid);
			setIsLoading(false);
			setPriceTotal(priceTotalInfo);
		} else {
			console.log("all good");
			setAddress(addressInfo);
			setPayment(paymentInfo);
			setPriceTotal(priceTotalInfo);
		}
	}, []);

	// console.log(sellerInfo);
	// console.log(hasIssue);
	// console.log(priceTotal);
	console.log(cart);

	const calculateSellerPoint = (seller) => {
		let bonus: number = parseFloat(100);
		let sellerBuyerPoint: number = parseFloat(seller.sellerBuyerPoint);
		let sellerPoint: number = parseFloat(seller.sellerPoint);
		let newPoints: number =
			parseFloat(sellerPoint) + parseFloat(seller.price) + parseFloat(bonus);
		let rank = seller.sellerRank;
		let isPromoted = false;
		if (newPoints + sellerBuyerPoint >= 100) {
			rank = "Silver";
			isPromoted = true;
		}
		if (newPoints + sellerBuyerPoint >= 500) {
			rank = "Gold";
			isPromoted = true;
		}
		if (newPoints + sellerBuyerPoint >= 1500) {
			rank = "Platinum";
			isPromoted = true;
		}
		if (newPoints + sellerBuyerPoint >= 3500) {
			rank = "Master";
			isPromoted = true;
		}
		if (newPoints + sellerBuyerPoint >= 8000) {
			rank = "HallofFamer";
			isPromoted = true;
		}
		dbService.doc(`UserInfo/${seller.sellerUserInfoId}`).update({
			sellerPoint: newPoints,
			isPromoted: isPromoted,
			rank: rank,
		});
	};

	const calculateBuyerPoint = (buyer) => {
		let buyerPoint: number = parseFloat(buyer.buyerPoint);
		let sellerPoint: number = parseFloat(buyer.sellerPoint);
		let cashback: number = parseFloat(buyer.cashback);
		let rank = buyer.rank;
		let isPromoted = false;
		let newBuyerPoint: number =
			parseFloat(buyerPoint) + parseFloat(priceTotalInfo.total);

		console.log("cashback1: ", cashback);
		cashback =
			parseFloat(cashback) -
			parseFloat(priceTotalInfo.cashback) +
			parseFloat(priceTotalInfo.total) / 20;

		cashback = Math.round(cashback);

		console.log("cashback3: ", cashback);
		console.log("newBuyerPoint: ", newBuyerPoint);
		console.log("rank: ", rank);

		if (
			newBuyerPoint + sellerPoint >= 100 &&
			rank === "Bronze" &&
			!isPromoted
		) {
			rank = "Silver";
			isPromoted = true;
		} else if (
			newBuyerPoint + sellerPoint >= 500 &&
			rank === "Silver" &&
			!isPromoted
		) {
			rank = "Gold";
			isPromoted = true;
		} else if (
			newBuyerPoint + sellerPoint >= 1500 &&
			rank === "Gold" &&
			!isPromoted
		) {
			rank = "Platinum";
			isPromoted = true;
		} else if (
			newBuyerPoint + sellerPoint >= 3500 &&
			rank === "Platinum" &&
			!isPromoted
		) {
			rank = "Master";
			isPromoted = true;
		} else if (
			newBuyerPoint + sellerPoint >= 8000 &&
			rank === "Master" &&
			!isPromoted
		) {
			rank = "HallofFamer";
			isPromoted = true;
		}

		dbService.doc(`UserInfo/${buyer.id}`).update({
			buyerPoint: newBuyerPoint,
			cashback: cashback,
			rank: rank,
			isPromoted: isPromoted,
		});
	};

	// make new transaction record / userinfo -> update buyer point, seller point, rank
	const onSubmitClick = async () => {
		Swal.fire({
			title: "Your Order is Placed!",
			// showDenyButton: true,
			confirmButtonText: "Got It",
		}).then(async (result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				// Swal.fire("Saved!", "", "success");
				// to get every transaction record
				let uidInTransaction = [];
				let sellerDisplayNames = [];
				uidInTransaction.push(uid);

				let timeString = new Date();
				timeString = timeString.toISOString().slice(0, 10);
				console.log(timeString);

				cartItems.map(async (element) => {
					if (uidInTransaction.includes(element.creatorUid) === false) {
						uidInTransaction.push(element.creatorUid);
						sellerDisplayNames.push(element.creatorDisplayName);
					}
					//*****************THIS CODE IS COMMENTED OUT FOR TEST */
					dbService.doc(`Posting/${element.postingId}`).update({
						soldOut: true,
					});
				});

				console.log(sellerInfo);
				sellerInfo.forEach((element) => {
					calculateSellerPoint(element);
				});
				calculateBuyerPoint(userInfo[0]);

				const transactionRecord = {
					buyerUid: userObject.uid,
					buyerDispalyName: userObject.displayName,
					addressInfo: addressInfo[0],
					paymentInfo: paymentInfo[0],
					priceTotalInfo: priceTotalInfo,
					items: cartItems,
					uidInTransaction: uidInTransaction,
					timeStamp: Date.now(),
					timeString: timeString,
					sellerDisplayNames: sellerDisplayNames,
				};

				await dbService.collection("Transaction").add(transactionRecord);

				// apply buyer point and seller point
				// add transaction record
				// combine buyer and seller point for user rank
				// one buyer point for cash back
				// one buyer point for user rank
				// one seller point for user rank

				console.log(transactionRecord);

				dbService.doc(`Cart/${cart[0].id}`).update({
					items: [],
				});

				history.push(`/Hobbys/`);
			}
		});
	};

	// console.log("userInfo: ", userInfo);
	// console.log("paymentInfo: ", paymentInfo);
	// console.log("addressInfo: ", addressInfo);

	return (
		<>
			{isLoading ? (
				"Please Wait..."
			) : (
				<>
					{address !== null && payment !== null && (
						<Container>
							{/* <div>
								{addressInfo[0]?.billingAddress.postalcode == "" &&
									addressInfo[0]?.shippingAddress.postalcode == "" && (
										<Link
											to={`/${uid}/profile/`}
											params={{ fromCheckout: true }}
										>
											<button>Go to Address Form</button>
										</Link>
									)}
								{paymentInfo[0]?.vendor == "" && (
									<Link to={`/${uid}/profile/`} params={{ fromCheckout: true }}>
										<button>Go to Payment Form</button>
									</Link>
								)}
							</div> */}

							<Shipto>
								<HeaderText>SHIP TO</HeaderText>
								<Text>
									{address[0]?.shippingAddress.firstName}{" "}
									{address[0]?.shippingAddress.lastName}
								</Text>
								<Text>{address[0]?.shippingAddress.address1}</Text>
								<Text>{address[0]?.shippingAddress.address2}</Text>
								<Text>{address[0]?.shippingAddress.city}</Text>
								<Text>{address[0]?.shippingAddress.postalcode}</Text>
							</Shipto>
							<PaymentDetails>
								<HeaderText>CREDIT CARD</HeaderText>
								<Text>
									{payment[0]?.vendor == "Visa" ? (
										<FontAwesomeIcon
											icon={faCcVisa}
											size="2x"
											color={"#341f97"}
										/>
									) : (
										<>
											{payment[0]?.vendor == "Master" ? (
												<FontAwesomeIcon
													icon={faCcMastercard}
													size="2x"
													color={"#353b48"}
												/>
											) : (
												<>
													{payment[0]?.vendor == "Amex" ? (
														<FontAwesomeIcon
															icon={faCcAmex}
															size="2x"
															color={"#0097e6"}
														/>
													) : (
														<>
															{payment[0]?.vendor == "JCB" ? (
																<FontAwesomeIcon
																	icon={faCcJcb}
																	size="2x"
																	color={"#44bd32"}
																/>
															) : (
																payment[0]?.vendor
															)}
														</>
													)}
												</>
											)}
										</>
									)}{" "}
									{" **** "} {payment[0]?.cardNumber.slice(12)}
								</Text>
							</PaymentDetails>
							<BillingAddress>
								<HeaderText>BILLING ADDRESS</HeaderText>
								<Text>
									{address[0]?.billingAddress.firstName}{" "}
									{address[0]?.billingAddress.lastName}
								</Text>
								<Text>{address[0]?.billingAddress.address1}</Text>
								<Text>{address[0]?.billingAddress.address2}</Text>
								<Text>{address[0]?.billingAddress.city}</Text>
								<Text>{address[0]?.billingAddress.postalcode}</Text>
							</BillingAddress>
							<Total>
								<Label>
									<Text>Subtotal: </Text>
									<Text>${priceTotal?.subtotal}</Text>
								</Label>
								<Label>
									<Text>Shipping: </Text>
									<Text>${priceTotal?.shipping}</Text>
								</Label>
								<Label>
									<Text>Cashback: </Text>
									<Text>- ${priceTotal?.cashback}</Text>
								</Label>
								<Label>
									<TotalText>Total: </TotalText>
									<TotalText>${priceTotal?.total}</TotalText>
								</Label>
							</Total>
							<a>
								{!isReady || hasIssue == true ? (
									<DisabledBtn disabled>COMPLETE INFO FIRST</DisabledBtn>
								) : (
									<SubmitBtn
										onClick={() => {
											onSubmitClick();
										}}
									>
										PLACE ORDER
									</SubmitBtn>
								)}
							</a>
							<Link
								to={{
									pathname: `/cart`,
								}}
							>
								<BackBtn>BACK</BackBtn>
							</Link>
						</Container>
					)}
				</>
			)}
		</>
	);
}

export default Checkout;
