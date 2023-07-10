// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// @ts-nocheck

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import {
	addressInfoAtom,
	cartAtom,
	paymentInfoAtom,
	priceTotalInfoAtom,
	totalInfoAtom,
	userObjectAtom,
} from "../atoms";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dbService, firebaseInstance } from "../fbase";
import { Link } from "react-router-dom";
// import { Collapse } from "react-bootstrap";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import Paper from "@mui/material/Paper";
import Collapse from "@mui/material/Collapse";
import FormControlLabel from "@mui/material/FormControlLabel";
import AddressForm from "../components/AddressForm";
import Checkbox from "@mui/material/Checkbox";
import { pink } from "@mui/material/colors";
import Swal from "sweetalert2";

const Container = styled.div`
	max-width: 480px;
	margin: 0 auto;
	width: 100%;
	height: 80vh;
	display: flex;
	flex-direction: column;
`;

const ItemContainer = styled.div`
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	z-index: 0;
`;

const Item = styled.div`
	display: flex;
	justify-content: flex-start;
	flex-direction: column;
	align-items: center;
	min-height: 100px;
	background-color: ${(props) => props.theme.postingBgColor};
	margin: 5px 5px;
	width: 100%;
`;

const HeaderText = styled.span`
	margin: 2px 5px;
	font-weight: bold;
`;

const Text = styled.span`
	margin: 2px 5px;
`;

const PaymentForm = styled.form`
	font-family: "Sniglet", cursive;
	color: #000;
	width: 100%;
	max-width: 320px;
	display: flex;
	flex-direction: column;
`;

const InputField = styled.input`
	font-family: "Sniglet", cursive;
	max-width: 295px;
	width: 100%;
	padding: 10px;
	margin-bottom: 10px;
	font-size: 12px;
	color: black;
	box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px 0px;
	border-radius: 205px 15px 180px 5px/7px 225px 25px 235px;
	border: solid 2px ${(props) => props.theme.secondColor};
`;

const DateContainer = styled.div`
	display: flex;
	justify-content: space-between;
	z-index: 0;
`;

const ExpiryDateInputField = styled.input`
	font-family: "Sniglet", cursive;
	max-width: 295px;
	width: 20%;
	padding: 10px;
	margin-bottom: 10px;
	font-size: 12px;
	color: black;
	box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px 0px;
	border-radius: 205px 15px 180px 5px/7px 225px 25px 235px;
	border: solid 2px ${(props) => props.theme.secondColor};
`;

const SubmitBtn = styled.button`
	display: block;
	font-family: "Sniglet", cursive;
	text-align: center;
	margin-top: 10px;
	cursor: pointer;
	border-color: ${(props) => props.theme.secondColor};
	max-width: 300px;
	width: 100%;
	padding: 10px;
	border-radius: 15px;
	margin-bottom: 100px;
	font-size: 20px;
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

const ErrorMessage = styled.span`
	color: red;
`;

interface IForm {
	cardOwner: string;
	cardNumber: string;
	expiryMonth: string;
	expiryYear: string;
	cvv: string;
}

function PaymentInfo({ fromCheckout }) {
	const [paymentInfo, setPaymentInfo] = useRecoilState(paymentInfoAtom);
	const userObject = useRecoilValue(userObjectAtom);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		setError,
	} = useForm<IForm>({
		defaultValues: {
			cardOwner: paymentInfo[0]?.cardOwner || "",
			cardNumber: paymentInfo[0]?.cardNumber || "",
			expiryMonth: paymentInfo[0]?.expiryMonth || "",
			expiryYear: paymentInfo[0]?.expiryYear || "",
			cvv: paymentInfo[0]?.cvv || "",
		},
	});

	function fetchPaymentInfo(uid) {
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

	useEffect(() => {
		fetchPaymentInfo(userObject.uid);
	}, []);

	const onValid = async (data: IForm) => {
		let cardVendor = "";
		if (/^3[47][0-9]{13}$/.test(data.cardNumber)) {
			cardVendor = "Amex";
		} else if (
			/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(
				data.cardNumber
			)
		) {
			cardVendor = "Master";
		} else if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(data.cardNumber)) {
			cardVendor = "Visa";
		} else if (/^(62[0-9]{14,17})$/.test(data.cardNumber)) {
			cardVendor = "UnionPay";
		} else if (/^(?:2131|1800|35\d{3})\d{11}$/.test(data.cardNumber)) {
			cardVendor = "JCB";
		} else if (
			/^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/.test(
				data.cardNumber
			)
		) {
			cardVendor = "Discover";
		} else if (/^3(?:0[0-5]|[68][0-9])[0-9]{11}$/.test(data.cardNumber)) {
			cardVendor = "Diners Club";
		} else {
			cardVendor = "Other";
		}
		console.log(data, " onShippingValid");
		console.log(cardVendor);
		dbService.doc(`PaymentInfo/${paymentInfo[0].id}`).update({
			cardOwner: data.cardOwner,
			cardNumber: data.cardNumber,
			expiryMonth: data.expiryMonth,
			expiryYear: data.expiryYear,
			cvv: data.cvv,
			vendor: cardVendor,
		});
		Swal.fire({
			title: "Your Payment Info is Updated",
			confirmButtonText: "Got It",
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				// Swal.fire("Saved!", "", "success");
			}
		});
	};

	return (
		<Container>
			{fromCheckout && <button>Back to checkout</button>}

			<ItemContainer>
				<Item>
					<HeaderText>ENTER PAYMENT DETAILS</HeaderText>
					<PaymentForm onSubmit={handleSubmit(onValid)}>
						<InputField
							type="text"
							{...register("cardOwner", {
								required: "Owner Name is Required",
								minLength: { value: 2, message: "Name is too Short" },
							})}
							placeholder="Card Owner"
						/>
						<ErrorMessage>{errors?.cardOwner?.message}</ErrorMessage>
						<InputField
							type="text"
							{...register("cardNumber", {
								required: "Card Number is Required",
								// exact 16 digits
								pattern: {
									value: /^\b\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}\b$/,
									message: "Invalid Card Number Pattern",
								},
							})}
							placeholder="Card Number(16 digits)"
						/>
						<ErrorMessage>{errors?.cardNumber?.message}</ErrorMessage>
						<DateContainer>
							<Text>Expiry Date(MM/YY)</Text>
							<ExpiryDateInputField
								type="text"
								{...register("expiryMonth", {
									required: "Month is Required",
									// 01 - 12
									pattern: {
										value: /^\b\d{2}\b$/,
										message: "Invalid Month Pattern",
									},
									min: {
										value: 1,
										message: "Month must be bigger than 0",
									},
									max: {
										value: 12,
										message: "Month must be less than 13",
									},
								})}
								placeholder="MM"
							/>
							<Text>/</Text>
							<ExpiryDateInputField
								type="text"
								{...register("expiryYear", {
									required: "Year is Required",
									// 21 < x < 28
									pattern: {
										value: /^\b\d{2}\b$/,
										message: "Invalid Year Pattern",
									},
									min: {
										value: 22,
										message: "Year must be later than 2021",
									},
									max: {
										value: 30,
										message: "Year must be before than 2030",
									},
								})}
								placeholder="YY"
							/>
						</DateContainer>

						<ErrorMessage>{errors?.expiryMonth?.message}</ErrorMessage>

						<ErrorMessage>{errors?.expiryYear?.message}</ErrorMessage>
						<InputField
							type="text"
							{...register("cvv", {
								required: "CVV is Required",
								// exact 3 digits
								pattern: {
									value: /^\b\d{3}\b$/,
									message: "Invalid CVV Pattern",
								},
							})}
							placeholder="CVV(3 digits)"
						/>
						<ErrorMessage>{errors?.cvv?.message}</ErrorMessage>
						<SubmitBtn>Submit</SubmitBtn>
					</PaymentForm>
				</Item>
			</ItemContainer>
		</Container>
	);
}

export default PaymentInfo;
