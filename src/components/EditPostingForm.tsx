// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// @ts-nocheck

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { authService, dbService, storageService } from "../fbase";
import SocialLogin from "./SocialLogin";
import CheckIcon from "@mui/icons-material/Check";
import ToggleButton from "@mui/material/ToggleButton";
import {
	photoURLAtom,
	postingInfoAtom,
	Ranks,
	selectedPostingAtom,
	userObjectAtom,
} from "../atoms";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { pink } from "@mui/material/colors";

const SignUpForm = styled.form`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 320px;
`;

const LoginForm = styled.form`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 320px;
`;

const InputField = styled.input`
	font-family: "Sniglet", cursive;
	max-width: 295px;
	width: 100%;
	padding: 10px;
	margin-bottom: 10px;
	font-size: 12px;
	color: #000;
	box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px 0px;
	border-radius: 205px 15px 180px 5px/7px 225px 25px 235px;
	border: solid 2px ${(props) => props.theme.secondColor};
`;

const SubmitBtn = styled.button`
	display: block;
	width: 100%;

	font-family: "Sniglet", cursive;
	text-align: center;
	max-width: 300px;
	width: 100%;
	color: black;
	padding: 3px;
	margin: 10px;
	background-color: ${(props) => props.theme.highlightColor};
	letter-spacing: 2px;
	font-size: 20px;
	box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px 0px,
		rgba(0, 0, 0, 0.23) 0px 3px 6px 0px;
	border-radius: 205px 35px 180px 20px/15px 225px 10px 235px;
	border: solid 4px ${(props) => props.theme.highlightColor};
	cursor: pointer;
`;

const GoBackBtn = styled.button`
	text-align: center;
	cursor: pointer;
	max-width: 320px;
	width: 100%;
	padding: 10px;
	border-radius: 30px;
	background-color: rgba(255, 255, 255, 1);
	margin-bottom: 10px;
	font-size: 12px;
	color: black;
	font-weight: bold;
`;

const ErrorMessage = styled.span`
	color: red;
`;

const PageTitle = styled.span`
	margin: 5px 0px 5px 0px;
`;

const PreviewImg = styled.img`
	border-radius: 10%;
	width: 150px;
	height: 150px;
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
	color: #000;
	box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px 0px;
	border-radius: 205px 15px 180px 5px/7px 225px 25px 235px;
	border: solid 2px ${(props) => props.theme.secondColor};
`;

interface IForm {
	text: string;
	forSale: boolean;
	price: number;
	category: string;
	itemName: string;
}

interface IPosting {
	creatorUid: string;
	creatorImgUrl: string;
	photoUrl: string;
	createdAt: number;
	text: string;
	forSale: boolean;
	soldOut: boolean;
	price: number;
	category: string;
}

function EditPostingForm() {
	const history = useHistory();
	const [isLoading, setIsLoading] = useState(false);
	const [forSale, setForSale] = useState(true);
	const userObject = useRecoilValue(userObjectAtom);
	const selectedPosting = useRecoilValue(selectedPostingAtom);
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		setError,
	} = useForm<IForm>({
		defaultValues: {
			text: selectedPosting.text,
			category: selectedPosting.category,
			price: selectedPosting.price,
			itemName: selectedPosting.itemName,
		},
	});

	useEffect(() => {
		setForSale(selectedPosting.forSale);
	}, []);

	const onEditClicked = (event) => {
		event.stopPropagation();
	};

	const onValid = async (data: IForm) => {
		console.log(data);
		// console.log(photoURL);
		if (data.price > 9999) {
			setError(
				"price",
				{ message: "Too Expensive! Enter Less Than 9999$" },
				{ shouldFocus: true }
			);
			throw "too expensive";
		}
		if (data.price < 0) {
			setError(
				"price",
				{ message: "Negative Number is not Allowed!" },
				{ shouldFocus: true }
			);
			throw "negative number";
		}
		try {
			setIsLoading(true);

			if (forSale) {
				dbService.doc(`Posting/${selectedPosting.id}`).update({
					text: data.text,
					forSale: forSale,
					price: data.price,
					category: data.category,
					itemName: data.itemName,
				});
				console.log("forSale success");
				// data.username
			} else {
				dbService.doc(`Posting/${selectedPosting.id}`).update({
					text: data.text,
					forSale: forSale,
					price: 0,
					category: data.category,
					itemName: "",
				});
				console.log("not forSale success");
			}
			alert("Posting Edited!");
			history.push("/Hobbys");
			// console.log(user);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<>
			<FormGroup>
				<FormControlLabel
					control={
						<Checkbox
							checked={forSale}
							sx={{
								color: pink[800],
								"&.Mui-checked": {
									color: pink[600],
								},
							}}
						/>
					}
					label="For Sale?"
					onChange={(event) => {
						if (event.target.checked) {
							setForSale(true);
						} else {
							setForSale(false);
						}
					}}
				/>
			</FormGroup>
			{!forSale ? (
				<>
					<SignUpForm onSubmit={handleSubmit(onValid)}>
						<InputField
							type="text"
							{...register("text", {})}
							placeholder="Enter Text"
						/>
						<ErrorMessage>{errors?.text?.message}</ErrorMessage>
						<InputField
							type="text"
							{...register("category", {})}
							placeholder="Enter Category"
						/>
						<ErrorMessage>{errors?.category?.message}</ErrorMessage>
						{isLoading ? (
							<>
								<SubmitBtn disabled style={{ cursor: "wait" }}>
									Uploading...
								</SubmitBtn>
							</>
						) : (
							<>
								<SubmitBtn onClick={onEditClicked}>Edit Posting</SubmitBtn>
							</>
						)}
					</SignUpForm>
				</>
			) : (
				<>
					<PageTitle></PageTitle>
					<LoginForm onSubmit={handleSubmit(onValid)}>
						<InputField
							type="text"
							{...register("text", {})}
							placeholder="*Enter Text"
						/>
						<ErrorMessage>{errors?.text?.message}</ErrorMessage>

						<CategorySelect
							{...register("category", {})}
							placeholder="*Enter Category"
						>
							<option value="Accessory">Accessory</option>
							<option value="Cooking">Cooking</option>
							<option value="Woodwork">Woodwork</option>
							<option value="Knitting">Knitting</option>
							<option value="Art">Art</option>
							<option value="Outdoor">Outdoor</option>
							<option value="Gardening">Gardening</option>
							<option value="Others">Others</option>
						</CategorySelect>
						<ErrorMessage>{errors?.category?.message}</ErrorMessage>

						<InputField
							type="text"
							{...register("itemName", { required: "Item Name is Required" })}
							placeholder="*Enter Item Name"
						/>
						<ErrorMessage>{errors?.itemName?.message}</ErrorMessage>

						<InputField
							type="number"
							step="0.01"
							{...register("price", { required: "Price is Required" })}
							placeholder="*Enter price"
						/>
						<ErrorMessage>{errors?.price?.message}</ErrorMessage>
						{isLoading ? (
							<>
								<SubmitBtn disabled style={{ cursor: "wait" }}>
									Uploading...
								</SubmitBtn>
							</>
						) : (
							<>
								<SubmitBtn onClick={onEditClicked}>Edit Posting</SubmitBtn>
							</>
						)}
					</LoginForm>
				</>
			)}
		</>
	);
}

export default EditPostingForm;
