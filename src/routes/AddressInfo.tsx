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
import { ConnectingAirportsOutlined } from "@mui/icons-material";

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

const ShippingAddressForm = styled.form`
	font-family: "Sniglet", cursive;
	color: #000;
	width: 100%;
	max-width: 320px;
	display: flex;
	flex-direction: column;
`;

const BillingAddressForm = styled.form`
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

const SubmitBtn = styled.button`
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

const CategorySelect = styled.select`
	font-family: "Sniglet", cursive;
	max-width: 320px;
	width: 100%;
	padding: 10px;
	border-radius: 15px;
	border-color: ${(props) => props.theme.secondColor};

	background-color: rgba(255, 255, 255, 1);
	margin-bottom: 10px;
	font-size: 12px;
	color: black;
`;

interface IForm {
	firstNameShipping: string;
	lastNameShipping: string;
	phoneNumberShipping: string;
	address1Shipping: string;
	address2Shipping: string;
	cityShipping: string;
	provinceShipping: string;
	postalcodeShipping: string;
	firstNameBilling: string;
	lastNameBilling: string;
	phoneNumberBilling: string;
	address1Billing: string;
	address2Billing: string;
	cityBilling: string;
	provinceBilling: string;
	postalcodeBilling: string;
}

function AddressInfo({ fromCheckout }) {
	const [isShipping, setIsShipping] = useState(true);
	const [isBilling, setIsBilling] = useState(false);
	const [isSame, setIsSame] = useState(false);
	const [formName, setFormName] = useState("");

	const [addressInfo, setAddressInfo] = useRecoilState(addressInfoAtom);
	const userObject = useRecoilValue(userObjectAtom);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		setError,
	} = useForm<IForm>({
		defaultValues: {
			firstNameShipping: addressInfo[0]?.shippingAddress.firstName || "",
			lastNameShipping: addressInfo[0]?.shippingAddress.lastName || "",
			phoneNumberShipping: addressInfo[0]?.shippingAddress.phoneNumber || "",
			address1Shipping: addressInfo[0]?.shippingAddress.address1 || "",
			address2Shipping: addressInfo[0]?.shippingAddress.address2 || "",
			cityShipping: addressInfo[0]?.shippingAddress.city || "",
			provinceShipping: addressInfo[0]?.shippingAddress.province || "",
			postalcodeShipping: addressInfo[0]?.shippingAddress.postalcode || "",

			firstNameBilling: addressInfo[0]?.billingAddress.firstName || "",
			lastNameBilling: addressInfo[0]?.billingAddress.lastName || "",
			phoneNumberBilling: addressInfo[0]?.billingAddress.phoneNumber || "",
			address1Billing: addressInfo[0]?.billingAddress.address1 || "",
			address2Billing: addressInfo[0]?.billingAddress.address2 || "",
			cityBilling: addressInfo[0]?.billingAddress.city || "",
			provinceBilling: addressInfo[0]?.billingAddress.province || "",
			postalcodeBilling: addressInfo[0]?.billingAddress.postalcode || "",
		},
	});

	const onBillingValid = async (data: IForm) => {
		let isError = false;
		console.log(data, " onBillingValid");
		if (data.firstNameBilling == "" || data.firstNameBilling.length < 2) {
			setError(
				"firstNameBilling",
				{ message: "First Name is empty or too short" },
				{ shouldFocus: true }
			);
			isError = true;
		}
		if (data.lastNameBilling == "" || data.lastNameBilling.length < 2) {
			setError(
				"lastNameBilling",
				{ message: "Last Name is empty or too short" },
				{ shouldFocus: true }
			);
			isError = true;
		}
		if (data.phoneNumberBilling == "" || data.phoneNumberBilling.length < 2) {
			setError(
				"phoneNumberBilling",
				{ message: "Phone Number is empty or too short" },
				{ shouldFocus: true }
			);
			isError = true;
		}
		if (data.address1Billing == "" || data.address1Billing.length < 2) {
			setError(
				"address1Billing",
				{ message: "Address1 is empty or too short" },
				{ shouldFocus: true }
			);
			isError = true;
		}
		if (data.cityBilling == "" || data.cityBilling.length < 2) {
			setError(
				"cityBilling",
				{ message: "City is empty or too short" },
				{ shouldFocus: true }
			);
			isError = true;
		}
		if (data.postalcodeBilling == "" || data.postalcodeBilling.length < 2) {
			setError(
				"postalcodeBilling",
				{ message: "Postalcode is empty or too short" },
				{ shouldFocus: true }
			);
			isError = true;
		}
		if (
			!/^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/.test(
				data.postalcodeBilling
			)
		) {
			setError(
				"postalcodeBilling",
				{ message: "Enter valid postal code pattern" },
				{ shouldFocus: true }
			);
			isError = true;
		}

		if (
			!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(
				data.phoneNumberBilling
			)
		) {
			setError(
				"phoneNumberBilling",
				{ message: "Enter valid phone number pattern" },
				{ shouldFocus: true }
			);
			isError = true;
		}
		if (!isError) {
			dbService.doc(`AddressInfo/${addressInfo[0].id}`).update({
				billingAddress: {
					firstName: data.firstNameBilling,
					lastName: data.lastNameBilling,
					phoneNumber: data.phoneNumberBilling,
					address1: data.address1Billing,
					address2: data.address2Billing,
					city: data.cityBilling,
					province: data.provinceBilling,
					postalcode: data.postalcodeBilling,
				},
			});
			console.log("billing address edit");
			Swal.fire({
				title: "Your Billing Address is Updated",
				confirmButtonText: "Got It",
			}).then((result) => {
				/* Read more about isConfirmed, isDenied below */
				if (result.isConfirmed) {
					// Swal.fire("Saved!", "", "success");
				}
			});
		}

		//message box?
	};

	const onShippingValid = async (data: IForm) => {
		console.log(data, " onShippingValid");
		dbService.doc(`AddressInfo/${addressInfo[0].id}`).update({
			shippingAddress: {
				firstName: data.firstNameShipping,
				lastName: data.lastNameShipping,
				phoneNumber: data.phoneNumberShipping,
				address1: data.address1Shipping,
				address2: data.address2Shipping,
				city: data.cityShipping,
				province: data.provinceShipping,
				postalcode: data.postalcodeShipping,
			},
		});
		console.log("shipping address edit");
		Swal.fire({
			title: "Your Shipping Address is Updated",
			confirmButtonText: "Got It",
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				// Swal.fire("Saved!", "", "success");
			}
		});
	};

	function fetchAddressInfo(uid) {
		dbService
			.collection("AddressInfo")
			.where("uid", "==", uid)
			.onSnapshot((snapshot) => {
				const recordSnapshot = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setAddressInfo(recordSnapshot);
			});
	}

	// fetch address info if no address info create one
	useEffect(() => {
		fetchAddressInfo(userObject.uid);
	}, []);

	const handleIsShipping = () => {
		setIsShipping((prev) => !prev);
	};
	const handleIsBilling = () => {
		setIsBilling((prev) => !prev);
	};

	const handleIsSame = () => {
		setIsSame((prev) => !prev);
	};

	const onSubmitClick = (formNameValue) => {
		setFormName(formNameValue);
	};

	const onSameAddress = (shippingAddress) => {
		console.log(shippingAddress);
		dbService.doc(`AddressInfo/${addressInfo[0].id}`).update({
			billingAddress: {
				firstName: shippingAddress.firstName,
				lastName: shippingAddress.lastName,
				phoneNumber: shippingAddress.phoneNumber,
				address1: shippingAddress.address1,
				address2: shippingAddress.address2,
				city: shippingAddress.city,
				province: shippingAddress.province,
				postalcode: shippingAddress.postalcode,
			},
		});
		console.log(shippingAddress);
		console.log("same as shipping address");
		document.getElementById("firstNameBilling").value =
			shippingAddress.firstName;
		document.getElementById("lastNameBilling").value = shippingAddress.lastName;
		document.getElementById("phoneNumberBilling").value =
			shippingAddress.phoneNumber;
		document.getElementById("address1Billing").value = shippingAddress.address1;
		document.getElementById("address2Billing").value = shippingAddress.address2;
		document.getElementById("cityBilling").value = shippingAddress.city;
		document.getElementById("provinceBilling").value = shippingAddress.province;
		document.getElementById("postalcodeBilling").value =
			shippingAddress.postalcode;
		console.log("billing address edit");
		Swal.fire({
			title: "Your Billing Address is Updated",
			confirmButtonText: "Got It",
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				// Swal.fire("Saved!", "", "success");
			}
		});
	};

	const onNotSameAddress = () => {
		document.getElementById("firstNameBilling").value = "";
		document.getElementById("lastNameBilling").value = "";
		document.getElementById("phoneNumberBilling").value = "";
		document.getElementById("address1Billing").value = "";
		document.getElementById("address2Billing").value = "";
		document.getElementById("cityBilling").value = "";
		document.getElementById("provinceBilling").value = "";
		document.getElementById("postalcodeBilling").value = "";
	};

	// console.log(addressInfo);
	// console.log(fromCheckout);

	return (
		<Container>
			{fromCheckout && <button>Back to checkout</button>}
			<ItemContainer>
				<FormControlLabel
					control={<Switch checked={isShipping} onChange={handleIsShipping} />}
					label="SHIPPING ADDRESS"
				/>

				<Collapse in={isShipping}>
					<Item>
						<ShippingAddressForm onSubmit={handleSubmit(onShippingValid)}>
							<InputField
								type="text"
								{...register("firstNameShipping", {
									required: "First Name is Required",
									minLength: { value: 2, message: "Name is too Short" },
								})}
								placeholder="First Name"
							/>
							<ErrorMessage>{errors?.firstNameShipping?.message}</ErrorMessage>
							<InputField
								type="text"
								{...register("lastNameShipping", {
									required: "Last Name is Required",
									minLength: { value: 2, message: "Name is too Short" },
								})}
								placeholder="Last Name"
							/>
							<ErrorMessage>{errors?.lastNameShipping?.message}</ErrorMessage>
							<InputField
								type="text"
								{...register("phoneNumberShipping", {
									required: "Phone Number is Required",
									pattern: {
										value: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
										message: "Invalid Phone Number Pattern",
									},
								})}
								placeholder="Phone Number"
							/>
							<ErrorMessage>
								{errors?.phoneNumberShipping?.message}
							</ErrorMessage>
							<InputField
								type="text"
								{...register("address1Shipping", {
									required: "Address is Required",
									minLength: { value: 2, message: "Address is too Short" },
								})}
								placeholder="Address Line 1"
							/>
							<ErrorMessage>{errors?.address1Shipping?.message}</ErrorMessage>
							<InputField
								type="text"
								{...register("address2Shipping", {
									minLength: { value: 2, message: "Address is too Short" },
								})}
								placeholder="Address Line 2"
							/>
							<ErrorMessage>{errors?.address2Shipping?.message}</ErrorMessage>
							<InputField
								type="text"
								{...register("cityShipping", {
									required: "City is Required",
									minLength: { value: 2, message: "City is too Short" },
								})}
								placeholder="City"
							/>
							<ErrorMessage>{errors?.cityShipping?.message}</ErrorMessage>
							<CategorySelect {...register("provinceShipping", {})}>
								<option value="ON">Ontario</option>
								<option value="QC">Quebec</option>
								<option value="BC">British Columbia</option>
								<option value="AB">Alberta</option>
								<option value="MB">Manitoba</option>
								<option value="SK">Saskatchewan</option>
								<option value="NS">Nova Scotia</option>
								<option value="NB">New Brunswick</option>
								<option value="PE">Prince Edward Island</option>
								<option value="NL">Newfoundland and Labrador</option>
								<option value="NT">Northwest Territories</option>
								<option value="YT">Yukon</option>
								<option value="NU">Nunavut</option>
							</CategorySelect>
							<ErrorMessage>{errors?.provinceShipping?.message}</ErrorMessage>
							<InputField
								type="text"
								{...register("postalcodeShipping", {
									pattern: {
										value:
											/^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/,
										message: "Invalid Postal Code Pattern",
									},
								})}
								placeholder="Postal Code"
							/>
							<ErrorMessage>{errors?.postalcodeShipping?.message}</ErrorMessage>
							<SubmitBtn
								onClick={() => {
									onSubmitClick("shipping");
								}}
							>
								Submit
							</SubmitBtn>
						</ShippingAddressForm>
					</Item>
				</Collapse>
			</ItemContainer>

			<ItemContainer>
				<FormControlLabel
					control={<Switch checked={isBilling} onChange={handleIsBilling} />}
					label="BILLING ADDRESS"
				/>
				<Collapse in={isBilling}>
					<Item>
						<FormControlLabel
							control={
								<Checkbox
									sx={{
										color: pink[800],
										"&.Mui-checked": {
											color: pink[600],
										},
									}}
								/>
							}
							label="Same as Shipping Address"
							onChange={(event) => {
								if (event.target.checked) {
									onSameAddress(addressInfo[0].shippingAddress);
									// setIsBilling((prev) => !prev);
									handleIsSame();
								} else {
									console.log("not same");
									onNotSameAddress();
									handleIsSame();
								}
							}}
						/>
						<BillingAddressForm onSubmit={handleSubmit(onBillingValid)}>
							<InputField
								id="firstNameBilling"
								type="text"
								{...register("firstNameBilling", {
									// required: "First Name is Required",
									// minLength: { value: 2, message: "Name is too Short" },
								})}
								placeholder="First Name"
							/>
							<ErrorMessage>{errors?.firstNameBilling?.message}</ErrorMessage>
							<InputField
								id="lastNameBilling"
								type="text"
								{...register("lastNameBilling", {
									// required: "Last Name is Required",
									// minLength: { value: 2, message: "Name is too Short" },
								})}
								placeholder="Last Name"
							/>
							<ErrorMessage>{errors?.lastNameBilling?.message}</ErrorMessage>
							<InputField
								id="phoneNumberBilling"
								type="text"
								{...register("phoneNumberBilling", {
									// required: "Phone Number is Required",
									// pattern: {
									// 	value: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
									// 	message: "Invalid Phone Number Pattern",
									// },
								})}
								placeholder="Phone Number"
							/>
							<ErrorMessage>{errors?.phoneNumberBilling?.message}</ErrorMessage>
							<InputField
								id="address1Billing"
								type="text"
								{...register("address1Billing", {
									// required: "Address is Required",
									// minLength: { value: 2, message: "Address is too Short" },
								})}
								placeholder="Address Line 1"
							/>
							<ErrorMessage>{errors?.address1Billing?.message}</ErrorMessage>
							<InputField
								id="address2Billing"
								type="text"
								{...register("address2Billing", {
									// minLength: { value: 2, message: "Address is too Short" },
								})}
								placeholder="Address Line 2"
							/>
							<ErrorMessage>{errors?.address2Billing?.message}</ErrorMessage>
							<InputField
								id="cityBilling"
								type="text"
								{...register("cityBilling", {
									// required: "City is Required",
									// minLength: { value: 2, message: "City is too Short" },
								})}
								placeholder="City"
							/>
							<ErrorMessage>{errors?.cityBilling?.message}</ErrorMessage>
							<CategorySelect
								id="provinceBilling"
								{...register("provinceBilling", {})}
							>
								<option value="ON">Ontario</option>
								<option value="QC">Quebec</option>
								<option value="BC">British Columbia</option>
								<option value="AB">Alberta</option>
								<option value="MB">Manitoba</option>
								<option value="SK">Saskatchewan</option>
								<option value="NS">Nova Scotia</option>
								<option value="NB">New Brunswick</option>
								<option value="PE">Prince Edward Island</option>
								<option value="NL">Newfoundland and Labrador</option>
								<option value="NT">Northwest Territories</option>
								<option value="YT">Yukon</option>
								<option value="NU">Nunavut</option>
							</CategorySelect>
							<ErrorMessage>{errors?.provinceBilling?.message}</ErrorMessage>
							<InputField
								id="postalcodeBilling"
								type="text"
								{...register("postalcodeBilling", {
									// pattern: {
									// 	value:
									// 		/^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i,
									// 	message: "Invalid Postal Code Pattern",
									// },
								})}
								placeholder="Postal Code"
							/>
							<ErrorMessage>{errors?.postalcodeBilling?.message}</ErrorMessage>
							{!isSame && (
								<SubmitBtn
									onClick={() => {
										onSubmitClick("billing");
									}}
								>
									Submit
								</SubmitBtn>
							)}
						</BillingAddressForm>
					</Item>
					<div style={{ width: 300, height: 50 }}></div>
				</Collapse>
			</ItemContainer>
		</Container>
	);
}

export default AddressInfo;
