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
	selectedCommentAtom,
	selectedPostingAtom,
	totalInfoAtom,
	transactionAtom,
	uidAtom,
	userObjectAtom,
} from "../atoms";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dbService, firebaseInstance } from "../fbase";
import { Link, useHistory } from "react-router-dom";
import { Collapse, FormControlLabel, Switch } from "@mui/material";
import Swal from "sweetalert2";
import {
	faCcVisa,
	faCcAmex,
	faCcMastercard,
	faCcJcb,
} from "@fortawesome/free-brands-svg-icons";

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
	text-align: center;
	background: #04aaff;
	color: white;
	margin-top: 10px;
	cursor: pointer;

	max-width: 320px;
	width: 300px;
	padding: 10px;
	border-radius: 30px;
	background-color: rgba(255, 255, 255, 1);
	margin-bottom: 10px;
	font-size: 12px;
	color: black;
	font-weight: bold;
`;

const ItemLink = styled.a`
	padding: 2px;
	:hover {
		color: ${(props) => props.theme.highlightColor};
	}
`;

const DisabledBtn = styled.button`
	text-align: center;
	background: #04aaff;
	color: white;
	margin-top: 10px;
	cursor: not-allowed;

	max-width: 320px;
	width: 300px;
	padding: 10px;
	border-radius: 30px;
	background-color: rgba(255, 255, 255, 1);
	margin-bottom: 10px;
	font-size: 12px;
	color: black;
	font-weight: bold;
`;

function Receipt() {
	const history = useHistory();
	const [isLoading, setIsLoading] = useState(true);
	const [transaction, setTransaction] = useState<any>(null);
	const [posting, setPosting] = useState<any>(null);
	// const [sellerArr, setSellerArr] = useState<any>([]);

	const uid = useRecoilValue(uidAtom);
	const userObject = useRecoilValue(userObjectAtom);
	const transactionInfo = useRecoilValue(transactionAtom);
	const [selectedPosting, setSelectedPosting] =
		useRecoilState(selectedPostingAtom);
	const setSelectedComment = useSetRecoilState(selectedCommentAtom);

	//
	useEffect(() => {
		if (transaction == null) {
			setTransaction(transactionInfo);
		} else {
			// console.log(posting);
		}
		setIsLoading(false);
	}, []);

	const PostingIconClicked = (postingInfo) => {
		console.log(postingInfo);
		setSelectedPosting(postingInfo);
		setSelectedComment(null);
		history.push(`/postingDetail/${postingInfo.id}`);
	};

	const onItemClick = (postingId) => {
		dbService
			.collection("Posting")
			.where(firebaseInstance.firestore.FieldPath.documentId(), "==", postingId)
			.onSnapshot((snapshot) => {
				const postingSnapshot = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				console.log(postingSnapshot);
				setSelectedPosting(postingSnapshot[0]);
			});
		// console.log(posting);
		// PostingIconClicked(posting);
	};

	// console.log(posting);

	return (
		<>
			{isLoading ? (
				"Please Wait..."
			) : (
				<>
					{transaction !== null && (
						<Container>
							<Shipto>
								<HeaderText>SHIP TO</HeaderText>
								<Text>
									{transaction.addressInfo.shippingAddress.firstName}{" "}
									{transaction.addressInfo.shippingAddress.lastName}
								</Text>
								<Text>{transaction.addressInfo.shippingAddress.address1}</Text>
								<Text>{transaction.addressInfo.shippingAddress.address2}</Text>
								<Text>{transaction.addressInfo.shippingAddress.city}</Text>
								<Text>
									{transaction.addressInfo.shippingAddress.postalcode}
								</Text>
							</Shipto>
							<PaymentDetails>
								<HeaderText>CREDIT CARD</HeaderText>
								<Text>
									{transaction.paymentInfo.vendor == "Visa" ? (
										<FontAwesomeIcon
											icon={faCcVisa}
											size="2x"
											color={"#341f97"}
										/>
									) : (
										<>
											{transaction.paymentInfo.vendor == "Master" ? (
												<FontAwesomeIcon
													icon={faCcMastercard}
													size="2x"
													color={"#353b48"}
												/>
											) : (
												<>
													{transaction.paymentInfo.vendor == "Amex" ? (
														<FontAwesomeIcon
															icon={faCcAmex}
															size="2x"
															color={"#0097e6"}
														/>
													) : (
														<>
															{transaction.paymentInfo.vendor == "JCB" ? (
																<FontAwesomeIcon
																	icon={faCcJcb}
																	size="2x"
																	color={"#44bd32"}
																/>
															) : (
																transaction.paymentInfo.vendor
															)}
														</>
													)}
												</>
											)}
										</>
									)}{" "}
									{" **** "} {transaction.paymentInfo.cardNumber.slice(12)}
								</Text>
							</PaymentDetails>
							<BillingAddress>
								<HeaderText>BILLING ADDRESS</HeaderText>
								<Text>
									{transaction.addressInfo.billingAddress.firstName}{" "}
									{transaction.addressInfo.billingAddress.lastName}
								</Text>
								<Text>{transaction.addressInfo.billingAddress.address1}</Text>
								<Text>{transaction.addressInfo.billingAddress.address2}</Text>
								<Text>{transaction.addressInfo.billingAddress.city}</Text>
								<Text>{transaction.addressInfo.billingAddress.postalcode}</Text>
							</BillingAddress>
							<BillingAddress>
								<HeaderText>ITEMS</HeaderText>
								{transaction.items.map((item, index) => (
									<ItemLink
										href="#"
										key={index}
										onClick={() => PostingIconClicked(selectedPosting)}
										onMouseEnter={() => onItemClick(item.postingId)}
									>
										<Text>
											{item.creatorDisplayName} : {item.itemName} : $
											{item.itemPrice}
										</Text>
									</ItemLink>
								))}
							</BillingAddress>
							<Total>
								<Label>
									<Text>Subtotal: </Text>
									<Text>${transaction.priceTotalInfo.subtotal}</Text>
								</Label>
								<Label>
									<Text>Shipping: </Text>
									<Text>${transaction.priceTotalInfo.shipping}</Text>
								</Label>
								<Label>
									<Text>Cashback: </Text>
									<Text>- ${transaction.priceTotalInfo.cashback}</Text>
								</Label>
								<Label>
									<TotalText>Total: </TotalText>
									<TotalText>${transaction.priceTotalInfo.total}</TotalText>
								</Label>
							</Total>
						</Container>
					)}
				</>
			)}
		</>
	);
}

export default Receipt;
