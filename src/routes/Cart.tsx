// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// @ts-nocheck

import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import {
	addressInfoAtom,
	cartAtom,
	cartItemsAtom,
	paymentInfoAtom,
	priceTotalInfoAtom,
	totalInfoAtom,
	userObjectAtom,
} from "../atoms";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dbService, firebaseInstance } from "../fbase";
import { Link, useHistory } from "react-router-dom";
import { Collapse, FormControlLabel, Switch } from "@mui/material";
import carouselStyle from "../styles/Carousel.module.css";
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

const ItemContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(1, 1fr);
	grid-template-rows: repeat(1, 110px);
	grid-auto-rows: 110px;
	z-index: 0;
`;

const Item = styled.div`
	display: flex;
	justify-content: start;
	align-items: center;
	margin-bottom: 10px;
	width: 100%;
	/* background-color: ${(props) => props.theme.postingBgColor}; */
	box-shadow: ${(props) => props.theme.secondColor} 0px 0px 5px 0px,
		rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
`;

const CashBackContainer = styled.div`
	display: flex;
	justify-content: start;
	align-items: center;
	margin-bottom: 10px;
	width: 100%;
	background-color: ${(props) => props.theme.postingBgColor};
	flex-direction: column;
`;

const CashBack = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
	width: 100%;
	/* background-color: ${(props) => props.theme.postingBgColor}; */
`;

const Description = styled.div`
	display: flex;
	justify-content: flex-start;
	flex-direction: column;
	align-items: start;
	width: 220px;
	/* background-color: ${(props) => props.theme.postingBgColor}; */
`;

const PreviewImg = styled.img`
	width: 100px;
	height: 100px;
	margin-right: 10px;
`;

const IconElement = styled.a`
	margin-left: 40px;
	margin-right: 10px;
	display: flex;
	align-items: center;
`;
const Point = styled.span`
	margin: 2px 5px;
	font-weight: bold;
	color: red;
	font-size: 17px;
`;
const Text = styled.span`
	margin: 3px 5px 5px 10px;
`;

const TotalText = styled.span`
	color: ${(props) => props.theme.highlightColor};
	margin: 3px 5px 5px 10px;
	font-weight: bold;
`;

const SubTotalShipping = styled.div`
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	align-items: start;
	width: 100%;
	background-color: ${(props) => props.theme.postingBgColor};
`;

const Total = styled.div`
	margin-top: 15px;
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

const SubmitBtn = styled.button`
	color: #ffffff;
	font-family: "Sniglet", cursive;
	text-align: center;
	padding: 3px;
	margin-top: 10px;
	min-width: 200px;
	background-color: ${(props) => props.theme.secondColor};
	font-size: 20px;
	letter-spacing: 2px;
	box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 1px 0px,
		rgba(0, 0, 0, 0.1) 0px 4px 2px 0px;
	border-radius: 205px 35px 180px 20px/15px 225px 10px 235px;
	border: solid 4px ${(props) => props.theme.secondColor};
	cursor: pointer;
`;

const CashbackSubmitBtn = styled.button`
	color: #ffffff;
	max-width: 320px;
	display: inline;
	margin-left: 15px;
	font-family: "Sniglet", cursive;
	text-align: center;
	padding: 3px;
	margin-top: 10px;
	background-color: ${(props) => props.theme.secondColor};
	font-size: 16px;
	letter-spacing: 2px;
	box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 1px 0px,
		rgba(0, 0, 0, 0.1) 0px 4px 2px 0px;
	border-radius: 205px 5px 180px 10px/5px 225px 10px 235px;
	border: solid 4px ${(props) => props.theme.secondColor};
	cursor: pointer;
`;

const ExpiryDateInputField = styled.input`
	max-width: 295px;
	width: 50%;
	padding: 10px;
	background-color: rgba(255, 255, 255, 1);
	margin-bottom: 10px;
	font-size: 12px;
	color: black;
	font-weight: bold;

	box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 1px 0px,
		rgba(0, 0, 0, 0.1) 0px 4px 2px 0px;
	border-radius: 205px 5px 180px 10px/5px 225px 10px 235px;
	border: solid 2px ${(props) => props.theme.textColor};
`;

const Value = styled.div``;

function Cart() {
	const history = useHistory();
	const [cart, setCart] = useRecoilState(cartAtom);
	const [priceTotal, setPriceTotal] = useRecoilState(priceTotalInfoAtom);
	const userObject = useRecoilValue(userObjectAtom);
	const [paymentInfo, setPaymentInfo] = useRecoilState(paymentInfoAtom);
	const [addressInfo, setAddressInfo] = useRecoilState(addressInfoAtom);
	const [cartItems, setCartItems] = useRecoilState(cartItemsAtom);
	const [checked, setChecked] = useState(false);
	const [isApplied, setIsApplied] = useState(false);
	const [userInfo, setUserInfo] = useState<any>([]);
	const [isDiscount, setIsDiscount] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isEmpty, setIsEmpty] = useState(true);
	// const [items, setItems] = useState<any>([]);
	const [subTotal, setSubTotal] = useState(0);
	const [shipping, setShipping] = useState(0);
	const [cashback, setCashback] = useState(0);
	const [validCashback, setValidCashback] = useState(0);

	const createPaymentInfo = async () => {
		const paymentInfoValue = {
			uid: userObject.uid,
			cardNumber: "",
			expiryMonth: "",
			expiryYear: "",
			cvv: "",
			vendor: "",
		};
		await dbService.collection("PaymentInfo").add(paymentInfoValue);
		console.log("new payment info");
	};

	const createAddressInfo = async () => {
		const addressInfoValue = {
			uid: userObject.uid,
			shippingAddress: {
				firstName: "",
				lastName: "",
				phoneNumber: "",
				address1: "",
				address2: "",
				city: "",
				province: "",
				postalcode: "",
			},
			billingAddress: {
				firstName: "",
				lastName: "",
				phoneNumber: "",
				address1: "",
				address2: "",
				city: "",
				province: "",
				postalcode: "",
			},
		};
		await dbService.collection("AddressInfo").add(addressInfoValue);
		console.log("new address info");
	};

	async function fetchPaymentInfo(uid) {
		dbService
			.collection("PaymentInfo")
			.where("uid", "==", uid)
			.onSnapshot((snapshot) => {
				const paymentSnapshot = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
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
				setAddressInfo(addressSnapshot);
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
				setUserInfo(recordSnapshot);
			});
	}

	useEffect(() => {
		console.log("useEffect");
		let subTotalValue: number = 0;
		let shippingValue: number = 0;
		fetchAddressInfo(userObject.uid);
		fetchPaymentInfo(userObject.uid);
		fetchUserInfo(userObject.uid);
		if (cart !== null) {
			if (cart.length !== 0) {
				let itemsArray = cart[0].items;
				console.log(itemsArray);
				if (itemsArray.length == 0 || itemsArray == undefined) {
					setIsEmpty(true);
				} else {
					setIsEmpty(false);
					itemsArray.forEach((element) => {
						subTotalValue = subTotalValue + parseFloat(element.itemPrice);
						shippingValue = shippingValue + 10;
					});

					// setCashback(priceTotal.cashback);

					setSubTotal(subTotalValue);
					console.log(subTotalValue);
					console.log(shippingValue);
					console.log(shippingValue + subTotalValue);
					if (subTotalValue > 300) {
						setShipping(0);
						const totalInfo = {
							subtotal: subTotalValue,
							shipping: 0,
							total: subTotalValue + 0 - cashback,
							cashback: cashback,
						};
						console.log(totalInfo);
						setPriceTotal(totalInfo);
					} else {
						setShipping(shippingValue);
						const totalInfo = {
							subtotal: subTotalValue,
							shipping: shippingValue,
							total: subTotalValue + shippingValue - cashback,
							cashback: cashback,
						};
						console.log(totalInfo);
						setPriceTotal(totalInfo);
					}
				}
				setIsLoading(false);
				setCartItems(itemsArray);
			} else {
				setIsEmpty(true);
				setIsLoading(false);
			}
		} else {
			// setIsEmpty(true);
			// setIsLoading(false);
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
	}, [cart, isApplied]);

	const onDeleteClick = (item) => {
		setIsLoading(true);
		dbService.doc(`Cart/${cart[0].id}`).update({
			items: firebaseInstance.firestore.FieldValue.arrayRemove({
				postingId: item.postingId,
				creatorUid: item.creatorUid,
				creatorDisplayName: item.creatorDisplayName,
				itemPhoto: item.itemPhoto,
				itemName: item.itemName,
				itemCategory: item.itemCategory,
				itemPrice: item.itemPrice,
				// soldOut: item.soldOut,
			}),
		});
		Swal.fire({
			title: "Item is Removed!",
			confirmButtonText: "Got It",
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
			} else if (result.isDenied) {
			}
		});
	};

	const onCheckoutClick = () => {
		if (addressInfo.length == 0) {
			createAddressInfo();
		}
		if (paymentInfo.length == 0) {
			createPaymentInfo();
		}
	};

	const handleChange = () => {
		setChecked((prev) => !prev);
	};

	const cashbackOnChange = (event) => {
		const {
			target: { value },
		} = event;
		setCashback(value);
	};

	const cashbackOnSubmit = (cashback) => {
		// if()
		console.log(cashback);
		if (cashback < 10) {
			Swal.fire({
				title: "Sorry, Enter Minimum 10 Points",
				confirmButtonText: "Got It",
			}).then((result) => {
				if (result.isConfirmed) {
					setCashback(validCashback);
				}
			});
		} else if (cashback > subTotal + shipping) {
			Swal.fire({
				title: `Do You Want to Use $${cashback} Cashback Points?`,
				showDenyButton: true,
				confirmButtonText: "Yes",
				denyButtonText: `No`,
			}).then((result) => {
				if (result.isConfirmed) {
					Swal.fire(
						"Cashback Points is Bigger Than Total Amount!",
						"",
						"error"
					);
					setCashback(validCashback);
				} else if (result.isDenied) {
					setCashback(validCashback);
				}
			});
		} else if (cashback > userInfo[0].cashback) {
			Swal.fire({
				title: `Do You Want to Use $${cashback} Cashback Points?`,
				showDenyButton: true,
				confirmButtonText: "Yes",
				denyButtonText: `No`,
			}).then((result) => {
				if (result.isConfirmed) {
					Swal.fire("You Exceeded Your Available Points!", "", "error");
					setCashback(validCashback);
				} else if (result.isDenied) {
					setCashback(validCashback);
				}
			});
		} else {
			Swal.fire({
				title: `Do You Want to Use $${cashback} Cashback Points?`,
				showDenyButton: true,
				confirmButtonText: "Yes",
				denyButtonText: `No`,
			}).then((result) => {
				if (result.isConfirmed) {
					Swal.fire("Applied!", "", "success");
					setCashback(cashback);
					setValidCashback(cashback);
					setIsApplied((prev) => !prev);
				} else if (result.isDenied) {
				}
			});
		}
	};

	console.log(userInfo);

	return (
		<Container>
			{isLoading ? (
				"Please Wait..."
			) : (
				<>
					{isEmpty ? (
						"Your Cart is Empty!"
					) : (
						<>
							<ItemContainer>
								{cartItems?.map((item, index) => (
									<Item key={index}>
										<PreviewImg src={item.itemPhoto}></PreviewImg>
										<Description>
											<Text>Item: {item.itemName}</Text>
											<Text>Category: {item.itemCategory}</Text>
											<Text>Seller: {item.creatorDisplayName}</Text>
											<Text>Price: ${item.itemPrice}</Text>
										</Description>
										<IconElement href="#" onClick={() => onDeleteClick(item)}>
											<FontAwesomeIcon icon={faTrash} />
										</IconElement>
									</Item>
								))}
							</ItemContainer>
							<CashBackContainer>
								<CashBack>
									<Text>
										You have<Point> ${userInfo[0]?.cashback}</Point>cashback
										points
									</Text>
									<FormControlLabel
										control={
											<Switch checked={checked} onChange={handleChange} />
										}
										label="Use Points"
									/>
								</CashBack>
								<Collapse in={checked} className={carouselStyle.collapsekDiv}>
									<ExpiryDateInputField
										type="number"
										placeholder="Minimum 50"
										onChange={(event) => {
											cashbackOnChange(event);
										}}
										value={cashback}
									/>

									<CashbackSubmitBtn
										onClick={() => {
											cashbackOnSubmit(cashback);
										}}
									>
										APPLY
									</CashbackSubmitBtn>
								</Collapse>
							</CashBackContainer>

							<SubTotalShipping>
								<Label>
									<Text>Subtotal: </Text>
									<Text>${subTotal}</Text>
								</Label>
								<Label>
									<Text>Shipping: </Text>
									<Text>${shipping}</Text>
								</Label>
								<Label>
									<Text>Cashback: </Text>
									<Text>- ${cashback}</Text>
								</Label>
							</SubTotalShipping>
							<Total>
								<Label>
									<TotalText>Total: </TotalText>
									<TotalText>${subTotal + shipping - cashback}</TotalText>
								</Label>
							</Total>
							<br />
							<Link
								to={{
									pathname: `/cart/${cart[0].cartOwnerUid}`,
									state: { isDiscount: isDiscount, userInfo: userInfo },
								}}
							>
								<SubmitBtn
									onClick={() => {
										onCheckoutClick();
									}}
								>
									CHECKOUT
								</SubmitBtn>
							</Link>
							<ItemContainer>
								<div style={{ width: 300, height: 90 }}></div>
							</ItemContainer>
						</>
					)}
				</>
			)}
		</Container>
	);
}

export default Cart;
