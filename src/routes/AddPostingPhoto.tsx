// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// @ts-nocheck

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes, faCamera } from "@fortawesome/free-solid-svg-icons";
import { authService, dbService, storageService } from "../fbase";
import react, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import Carousel from "react-material-ui-carousel";
import { Paper, Button } from "@mui/material";
import carouselStyle from "../styles/Carousel.module.css";
import {
	photoURLAtom,
	postingInfoAtom,
	uidAtom,
	userObjectAtom,
	userObjectUidAtom,
} from "../atoms";
import { Link, Route, Switch } from "react-router-dom";
import AddPostingDetail from "./AddPostingDetail";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

const Container = styled.div`
	max-width: 480px;
	margin: 0 auto;
	width: 100%;
	height: 80vh;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const InputField = styled.input`
	max-width: 295px;
	width: 100%;
	padding: 10px;
	border-radius: 30px;
	background-color: rgba(255, 255, 255, 1);
	margin-bottom: 10px;
	font-size: 12px;
	color: black;
	font-weight: bold;
`;
const SubmitBtn = styled.button`
	text-align: center;
	background: #04aaff;
	color: white;
	margin-top: 10px;
	cursor: pointer;

	max-width: 320px;
	width: 100%;
	padding: 10px;
	background-color: rgba(255, 255, 255, 1);
	margin-bottom: 10px;
	font-size: 12px;
	color: #ffffff;
	font-weight: bold;
	box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px 0px,
		rgba(0, 0, 0, 0.23) 0px 3px 6px 0px;
	border-radius: 205px 35px 180px 20px/15px 225px 10px 235px;
	border: solid 4px ${(props) => props.theme.secondColor};
`;

const PostingForm = styled.form`
	width: 100%;
	max-width: 320px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const NextBtn = styled.button`
	font-family: "Sniglet", cursive;
	text-align: center;
	cursor: pointer;
	min-width: 300px;
	width: 100%;
	color: #ffffff;
	a {
		display: block;
	}
	padding: 3px;
	margin: 10px;
	margin-bottom: 90px;
	background-color: ${(props) => props.theme.secondColor};
	letter-spacing: 2px;
	font-size: 20px;
	box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px 0px,
		rgba(0, 0, 0, 0.23) 0px 3px 6px 0px;
	border-radius: 205px 35px 180px 20px/15px 225px 10px 235px;
	border: solid 4px ${(props) => props.theme.secondColor};
	cursor: pointer;
`;

const PreviewImg = styled.img`
	border-radius: 50%;
	width: 170px;
	height: 170px;
`;

const PhotoInput = styled.span`
	font-family: "Sniglet", cursive;
	color: blanchedalmond;
	text-align: center;
	padding: 3px;
	margin: 10px;
	background-color: #04aaff;
	letter-spacing: 2px;
	font-size: 20px;
	box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 1px 0px,
		rgba(0, 0, 0, 0.1) 0px 4px 2px 0px;
	border-radius: 205px 35px 180px 20px/15px 225px 10px 235px;
	border: solid 4px #04aaff;
	cursor: pointer;
`;

interface IForm {
	userName?: string;
	streetName?: string;
	city?: string;
	province?: string;
	postalCode?: string;
}

function AddPostingPhoto() {
	// const [newPhotoURLs, setNewPhotoURLs] = useState<string>([]);
	// const [previewImgs, setpreviewImgs] = useState<string>([]);
	const uid = useRecoilValue(uidAtom);
	const [photoURL, setPhotoURLAtom] = useRecoilState(photoURLAtom);

	const onFileChange = (event) => {
		// setNewPhotoURLs([]);
		// setpreviewImgs([]);
		setPhotoURLAtom([]);
		const {
			target: { files },
		} = event;
		// console.log(files);
		// const imgFile: string[];
		for (let i = 0; i < files.length; i++) {
			const imgFile = files[i];
			// console.log(imgFile);
			const reader = new FileReader();
			reader.readAsDataURL(imgFile);
			reader.onloadend = (finishedEvent) => {
				const {
					currentTarget: { result },
				} = finishedEvent;
				// console.log(result);
				setPhotoURLAtom((prev) => [result, ...prev]);
			};
		}
	};

	useEffect(() => {
		// setNewPhotoURLs(photoURL);
		// setpreviewImgs(photoURL);
		// console.log("asdf", photoURL);
		// console.log(newPhotoURLs);
		// console.log(previewImgs);
	}, []);

	// console.log(newPhotoURLs);
	// console.log(previewImgs);
	// console.log("fff", photoURL);

	function Item(props) {
		return (
			<Paper>
				<img style={{ height: 350, width: 350 }} src={props.item} />
			</Paper>
		);
	}

	// setPhotoURLAtom(newPhotoURLs);

	// console.log(photos);

	return (
		<Container className="container">
			<PostingForm>
				<label style={{ color: "#04aaff", marginTop: 10, marginBottom: 15 }}>
					<input
						multiple
						type="file"
						accept="image/*"
						onChange={onFileChange}
						style={{ marginTop: 10, height: 27, paddingBottom: 3 }}
					/>
					<PhotoInput>
						<FontAwesomeIcon icon={faCamera} />
						<span> Upload Photos</span>
					</PhotoInput>
				</label>
			</PostingForm>
			<Carousel
				className={carouselStyle.carousel}
				navButtonsAlwaysVisible={false}
				autoPlay={false}
			>
				{photoURL &&
					photoURL.map((item, index) => <Item key={index} item={item}></Item>)}
			</Carousel>
			{photoURL && (
				<Link
					to={{
						pathname: `/addposting/${uid}`,
					}}
				>
					<NextBtn>Next</NextBtn>
				</Link>
			)}
		</Container>
	);
}

export default AddPostingPhoto;
