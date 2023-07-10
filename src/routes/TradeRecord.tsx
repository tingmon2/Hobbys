// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// @ts-nocheck

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPlus,
	faTimes,
	faCloudUploadAlt,
} from "@fortawesome/free-solid-svg-icons";
import { authService, dbService, storageService } from "../fbase";
import react, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
	paymentInfoAtom,
	selectedPostingAtom,
	transactionAtom,
	userObjectAtom,
} from "../atoms";
import { Link } from "react-router-dom";

const Container = styled.div`
	max-width: 480px;
	margin: 0 auto;
	width: 100%;
	height: 80vh;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const TransactionDiv = styled.div`
	width: 100%;
	max-width: 320px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const GoPaymentBtn = styled.button`
	display: block;
	font-family: "Sniglet", cursive;
	text-align: center;
	margin-top: 10px;
	border-color: ${(props) => props.theme.secondColor};
	max-width: 300px;
	width: 100%;
	padding: 10px;
	border-radius: 15px;
	margin-bottom: 100px;
	font-size: 15px;
	color: #ffffff;
	padding: 3px;
	margin: 10px;
	background-color: ${(props) => props.theme.secondColor};
	letter-spacing: 2px;
	box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px 0px,
		rgba(0, 0, 0, 0.23) 0px 3px 6px 0px;
	border-radius: 205px 15px 180px 5px/7px 225px 25px 235px;
	border: solid 4px ${(props) => props.theme.secondColor};
	cursor: pointer;
`;

const HeaderText = styled.span`
	margin: 2px 5px;
	font-weight: bold;
`;

const Text = styled.span`
	font-family: "Sniglet", cursive;
	margin: 2px 5px;
`;

const RecordContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(1, 1fr);
	grid-template-rows: repeat(1, 100px);
	grid-auto-rows: 100px;
	z-index: 0;
	/* background-color: ${(props) => props.theme.postingBgColor}; */
`;

const RowDiv = styled.div`
	display: flex;
	justify-content: start;
	border-bottom: 0.5px solid salmon;
	margin-left: 1px;
`;

const LinkDiv = styled.div`
	display: flex;
	justify-content: end;
	min-width: 320px;
	&:last-child {
		float: right;
	}
	margin-right: 10px;
	font-weight: bold;
`;

const Record = styled.div`
	font-family: "Montserrat", sans-serif;
	display: flex;
	justify-content: start;
	align-items: start;
	margin-bottom: 10px;
	width: 100%;
	max-width: 320px;
	flex-direction: column;
	box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px 0px,
		rgba(0, 0, 0, 0.23) 0px 3px 6px 0px;
	border-radius: 205px 15px 180px 5px/7px 225px 25px 235px;
	border: solid 3px ${(props) => props.theme.mainColor};
`;

const ViewReceipt = styled.a`
	color: ${(props) => props.theme.highlightColor};
	/* color: #2f3542; */
`;

function TradeRecord() {
	const history = useHistory();
	const [isLoading, setIsLoading] = useState(true);
	const [userInfo, setUserInfo] = useState<any>(null);
	const [sellingRecord, setSellingRecord] = useState<any>([]);
	const [buyingRecord, setBuyingRecord] = useState<any>([]);
	const [transactionRecord, setTransactionRecord] = useState<any>([]);
	const [showBuyingRecord, setShowBuyingRecord] = useState(false);
	const [showSellingRecord, setShowSellingRecord] = useState(false);

	const userObject = useRecoilValue(userObjectAtom);
	const setSelectedPosting = useSetRecoilState(selectedPostingAtom);
	const [paymentInfo, setPaymentInfo] = useRecoilState(paymentInfoAtom);
	const setTransaction = useSetRecoilState(transactionAtom);

	async function fetchPaymentInfo(uid) {
		dbService
			.collection("PaymentInfo")
			.where("uid", "==", uid)
			.onSnapshot((snapshot) => {
				const recordSnapshot = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setPaymentInfo(recordSnapshot);
			});
	}

	async function fetchAllTransactions(uid) {
		dbService
			.collection("Transaction")
			.where("uidInTransaction", "array-contains", uid)
			.orderBy("timeStamp", "desc")
			.onSnapshot((snapshot) => {
				const recordSnapshot = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setTransactionRecord(recordSnapshot);
				const date = Date.parse(recordSnapshot[0]?.timeStamp);
				console.log(date);
			});
	}

	const onReceiptClick = (transaction) => {
		console.log(transaction);
		setTransaction(transaction);
		// history.push(`/${userObject.uid}/profile/address`);
		// history.push(`/${userObject.uid}/profile/payment`);
		history.push(`/${userObject.uid}/profile/receipt`);
	};

	useEffect(() => {
		fetchAllTransactions(userObject.uid);
		fetchPaymentInfo(userObject.uid);

		setIsLoading(false);
	}, []);

	const onPaymentClick = async () => {
		if (paymentInfo.length == 0 || paymentInfo === undefined) {
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
		}
	};

	// console.log(userInfo);
	// console.log(paymentInfo);
	// console.log(sellingRecord);
	// console.log(buyingRecord);

	return (
		<>
			{isLoading ? (
				"Please Wait..."
			) : (
				<Container>
					<Link to={`/${userObject.uid}/profile/payment`}>
						<GoPaymentBtn
							onClick={() => {
								onPaymentClick();
							}}
						>
							Go to Payment Info
						</GoPaymentBtn>
					</Link>

					{transactionRecord.length == 0 ? (
						<>"You have no transaction record"</>
					) : (
						<TransactionDiv>
							<RecordContainer>
								{transactionRecord.map((transaction, index) => (
									<>
										<Record key={index}>
											<RowDiv>
												<HeaderText>Buyer: </HeaderText>
												<Text>{transaction.buyerDispalyName}</Text>
											</RowDiv>
											<RowDiv>
												<HeaderText>Seller: </HeaderText>
												{transaction.sellerDisplayNames.length > 3 ? (
													<>
														{transaction.sellerDisplayNames
															.slice(0, 2)
															.map((name, index) => (
																<Text key={index}>{name},</Text>
															))}
														<Text>...</Text>
													</>
												) : (
													<>
														{transaction.sellerDisplayNames.map(
															(name, index) => (
																<Text key={index}>{name}</Text>
															)
														)}
													</>
												)}
											</RowDiv>
											<RowDiv>
												<HeaderText>Date: </HeaderText>
												<Text>{transaction.timeString}</Text>
											</RowDiv>
											<LinkDiv>
												<ViewReceipt
													href="#"
													onClick={() => {
														onReceiptClick(transaction);
													}}
												>
													View Receipt
												</ViewReceipt>
											</LinkDiv>
											{/* {transaction.timeStamp} */}
										</Record>
									</>
								))}
							</RecordContainer>
						</TransactionDiv>
					)}
				</Container>
			)}
		</>
	);
}

export default TradeRecord;
