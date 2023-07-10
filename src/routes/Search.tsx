// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// @ts-nocheck
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authService, dbService, storageService } from "../fbase";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import Carousel from "react-material-ui-carousel";
import { Paper, Button } from "@mui/material";
import carouselStyle from "../styles/Carousel.module.css";
import {
	postingInfoAtom,
	uidAtom,
	postingsObject,
	selectedPostingAtom,
} from "../atoms";
import { Link, Route, Switch } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faMitten } from "@fortawesome/free-solid-svg-icons";
import { faHandMiddleFinger } from "@fortawesome/free-solid-svg-icons";

import SkateboardingIcon from "@mui/icons-material/Skateboarding";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import { IoMdCellular, IoMdFlower } from "react-icons/io";
import { IoPaw } from "react-icons/io5";

import { GiDropEarrings, GiWinterGloves } from "react-icons/gi";
import { text } from "stream/consumers";

const PostingCenter = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
	height: 100%;
`;

const PostingPreviewImg = styled.img`
	min-width: 100%;
	min-height: 100%;
	max-width: 100%;
	max-height: 100%;
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

const Item = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: start;
	/* background-color: ${(props) => props.theme.postingBgColor}; */
	margin: 2px;
	width: 100%;
	display: flex;
`;
const InputField = styled.input`
	max-width: 300px;
	width: 100%;
	padding: 10px;
	border-radius: 3px;
	margin-top: 10px;
	margin-bottom: 10px;
	margin-left: 20px;
	font-size: 15px;
	color: #2f3542;
	box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 1px 0px,
		rgba(0, 0, 0, 0.1) 0px 4px 2px 0px;
	border-radius: 105px 5px 125px 5px/5px 125px 5px 155px;
	border: solid 3px ${(props) => props.theme.secondColor};
`;

const SubmitBtn = styled.button`
	text-align: center;
	padding: 3px;
	margin: 10px;
	background-color: ${(props) => props.theme.secondColor};
	letter-spacing: 2px;
	font-size: 20px;
	box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 1px 0px,
		rgba(0, 0, 0, 0.1) 0px 4px 2px 0px;
	border-radius: 205px 35px 180px 20px/15px 225px 10px 235px;
	border: solid 4px ${(props) => props.theme.secondColor};
	cursor: pointer;
	color: #ffffff;
`;
const IconContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	grid-template-rows: repeat(4, 40px);
	grid-auto-rows: 40px;
	height: 80px;
	width: 100vw;
`;

const Icons = styled.button`
	font-family: "Sniglet", cursive;
	color: #ffffff;
	display: flex;
	cursor: pointer;
	justify-content: center;
	align-items: center;
	overflow: hidden;
	a {
		width: 100%;
		height: 100%;
	}
	margin: 2px;
	box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 1px 0px,
		rgba(0, 0, 0, 0.1) 0px 4px 2px 0px;
	border-radius: 205px 10px 180px 20px/15px 225px 15px 235px;
	border: solid 4px ${(props) => props.theme.secondColor};
	background-color: ${(props) => props.theme.secondColor}; ;
`;
const PostingContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-template-rows: repeat(3, 150px);
	grid-auto-rows: 100px;
	z-index: 0;
`;

const Posting = styled.div`
	border: 1px solid #ffffff;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
	a {
		width: 100%;
		height: 100%;
	}
`;

const Text = styled.span`
	margin: 5px 5px;
	/* font-weight: bold; */
	color: #000;
`;

const NameText = styled.span`
	max-width: 300px;
	width: 100%;
	padding: 10px;
	border-radius: 10px;
	background-color: ${(props) => props.theme.postingBgColor};
	margin-top: 10px;
	margin-left: 20px;
	font-size: 12px;
	color: #ffffff;
`;

function Search() {
	const history = useHistory();
	const [postings, setPostings] = useRecoilState(postingsObject);
	const [selectedPostingInfo, setSelectedPostingInfo] =
		useRecoilState(selectedPostingAtom);

	const [input, setInput] = useState("");
	async function fetchPosting(event) {
		dbService
			.collection("Posting")
			.where("category", "==", event)
			.onSnapshot((snapshot) => {
				console.log(snapshot);
				const postingSnapshot = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				console.log(postingSnapshot);
				if (history.location.pathname === `/search`) {
					setPostings(postingSnapshot);
				}
			});
	}

	const Clicked = async (event) => {
		fetchPosting(event);
		setSelectedPostingInfo(event);
		console.log(event);
	};

	const SubmitClicked = async (text) => {
		console.log(text);
		setPostings(null);
		dbService
			.collection("Posting")
			.where("creatorDisplayName", ">=", text)
			.where("creatorDisplayName", "<=", text + "\uf8ff")
			.onSnapshot((snapshot) => {
				const postingSnapshot = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				console.log(postingSnapshot);
				console.log(history.location.pathname);
				if (history.location.pathname === `/search`) {
					setPostings(postingSnapshot);
				}
			});

		console.log(postings);
	};

	const InputOnChange = (event) => {
		const {
			target: { value },
		} = event;
		setInput(value);
	};

	useEffect(async () => {
		setPostings(null);
	}, []);

	const changeBackgroundColor = (page) => {
		if (page === "Cooking") {
			document.getElementById("Cooking").style.backgroundColor = "#ef5777";
			document.getElementById("Woodwork").style.backgroundColor = "#9cc4ab";
			document.getElementById("Outdoor").style.backgroundColor = "#9cc4ab";
			document.getElementById("Art").style.backgroundColor = "#9cc4ab";
			document.getElementById("Knitting").style.backgroundColor = "#9cc4ab";
			document.getElementById("Gardening").style.backgroundColor = "#9cc4ab";
			document.getElementById("Accessory").style.backgroundColor = "#9cc4ab";
			document.getElementById("Others").style.backgroundColor = "#9cc4ab";
			//-----------------------------------------------------------------------
			document.getElementById("Cooking").style.borderColor = "#ef5777";
			document.getElementById("Woodwork").style.borderColor = "#9cc4ab";
			document.getElementById("Outdoor").style.borderColor = "#9cc4ab";
			document.getElementById("Art").style.borderColor = "#9cc4ab";
			document.getElementById("Knitting").style.borderColor = "#9cc4ab";
			document.getElementById("Gardening").style.borderColor = "#9cc4ab";
			document.getElementById("Accessory").style.borderColor = "#9cc4ab";
			document.getElementById("Others").style.borderColor = "#9cc4ab";
			//-----------------------------------------------------------------------
			document.getElementById("Cooking").style.color = "#2f3542";
			document.getElementById("Woodwork").style.color = "#ffffff";
			document.getElementById("Outdoor").style.color = "#ffffff";
			document.getElementById("Art").style.color = "#ffffff";
			document.getElementById("Knitting").style.color = "#ffffff";
			document.getElementById("Gardening").style.color = "#ffffff";
			document.getElementById("Accessory").style.color = "#ffffff";
			document.getElementById("Others").style.color = "#ffffff";
		} else if (page === "Woodwork") {
			document.getElementById("Cooking").style.backgroundColor = "#9cc4ab";
			document.getElementById("Woodwork").style.backgroundColor = "#ef5777";
			document.getElementById("Outdoor").style.backgroundColor = "#9cc4ab";
			document.getElementById("Art").style.backgroundColor = "#9cc4ab";
			document.getElementById("Knitting").style.backgroundColor = "#9cc4ab";
			document.getElementById("Gardening").style.backgroundColor = "#9cc4ab";
			document.getElementById("Accessory").style.backgroundColor = "#9cc4ab";
			document.getElementById("Others").style.backgroundColor = "#9cc4ab";
			//-----------------------------------------------------------------------
			document.getElementById("Cooking").style.borderColor = "#9cc4ab";
			document.getElementById("Woodwork").style.borderColor = "#ef5777";
			document.getElementById("Outdoor").style.borderColor = "#9cc4ab";
			document.getElementById("Art").style.borderColor = "#9cc4ab";
			document.getElementById("Knitting").style.borderColor = "#9cc4ab";
			document.getElementById("Gardening").style.borderColor = "#9cc4ab";
			document.getElementById("Accessory").style.borderColor = "#9cc4ab";
			document.getElementById("Others").style.borderColor = "#9cc4ab";
			//-----------------------------------------------------------------------
			document.getElementById("Cooking").style.color = "#ffffff";
			document.getElementById("Woodwork").style.color = "#2f3542";
			document.getElementById("Outdoor").style.color = "#ffffff";
			document.getElementById("Art").style.color = "#ffffff";
			document.getElementById("Knitting").style.color = "#ffffff";
			document.getElementById("Gardening").style.color = "#ffffff";
			document.getElementById("Accessory").style.color = "#ffffff";
			document.getElementById("Others").style.color = "#ffffff";
		} else if (page === "Outdoor") {
			document.getElementById("Cooking").style.backgroundColor = "#9cc4ab";
			document.getElementById("Woodwork").style.backgroundColor = "#9cc4ab";
			document.getElementById("Outdoor").style.backgroundColor = "#ef5777";
			document.getElementById("Art").style.backgroundColor = "#9cc4ab";
			document.getElementById("Knitting").style.backgroundColor = "#9cc4ab";
			document.getElementById("Gardening").style.backgroundColor = "#9cc4ab";
			document.getElementById("Accessory").style.backgroundColor = "#9cc4ab";
			document.getElementById("Others").style.backgroundColor = "#9cc4ab";
			//-----------------------------------------------------------------------
			document.getElementById("Cooking").style.borderColor = "#9cc4ab";
			document.getElementById("Woodwork").style.borderColor = "#9cc4ab";
			document.getElementById("Outdoor").style.borderColor = "#ef5777";
			document.getElementById("Art").style.borderColor = "#9cc4ab";
			document.getElementById("Knitting").style.borderColor = "#9cc4ab";
			document.getElementById("Gardening").style.borderColor = "#9cc4ab";
			document.getElementById("Accessory").style.borderColor = "#9cc4ab";
			document.getElementById("Others").style.borderColor = "#9cc4ab";
			//-----------------------------------------------------------------------
			document.getElementById("Cooking").style.color = "#ffffff";
			document.getElementById("Woodwork").style.color = "#ffffff";
			document.getElementById("Outdoor").style.color = "#2f3542";
			document.getElementById("Art").style.color = "#ffffff";
			document.getElementById("Knitting").style.color = "#ffffff";
			document.getElementById("Gardening").style.color = "#ffffff";
			document.getElementById("Accessory").style.color = "#ffffff";
			document.getElementById("Others").style.color = "#ffffff";
		} else if (page === "Art") {
			document.getElementById("Cooking").style.backgroundColor = "#9cc4ab";
			document.getElementById("Woodwork").style.backgroundColor = "#9cc4ab";
			document.getElementById("Outdoor").style.backgroundColor = "#9cc4ab";
			document.getElementById("Art").style.backgroundColor = "#ef5777";
			document.getElementById("Knitting").style.backgroundColor = "#9cc4ab";
			document.getElementById("Gardening").style.backgroundColor = "#9cc4ab";
			document.getElementById("Accessory").style.backgroundColor = "#9cc4ab";
			document.getElementById("Others").style.backgroundColor = "#9cc4ab";
			//-----------------------------------------------------------------------
			document.getElementById("Cooking").style.borderColor = "#9cc4ab";
			document.getElementById("Woodwork").style.borderColor = "#9cc4ab";
			document.getElementById("Outdoor").style.borderColor = "#9cc4ab";
			document.getElementById("Art").style.borderColor = "#ef5777";
			document.getElementById("Knitting").style.borderColor = "#9cc4ab";
			document.getElementById("Gardening").style.borderColor = "#9cc4ab";
			document.getElementById("Accessory").style.borderColor = "#9cc4ab";
			document.getElementById("Others").style.borderColor = "#9cc4ab";
			//-----------------------------------------------------------------------
			document.getElementById("Cooking").style.color = "#ffffff";
			document.getElementById("Woodwork").style.color = "#ffffff";
			document.getElementById("Outdoor").style.color = "#ffffff";
			document.getElementById("Art").style.color = "#2f3542";
			document.getElementById("Knitting").style.color = "#ffffff";
			document.getElementById("Gardening").style.color = "#ffffff";
			document.getElementById("Accessory").style.color = "#ffffff";
			document.getElementById("Others").style.color = "#ffffff";
		} else if (page === "Knitting") {
			document.getElementById("Cooking").style.backgroundColor = "#9cc4ab";
			document.getElementById("Woodwork").style.backgroundColor = "#9cc4ab";
			document.getElementById("Outdoor").style.backgroundColor = "#9cc4ab";
			document.getElementById("Art").style.backgroundColor = "#9cc4ab";
			document.getElementById("Knitting").style.backgroundColor = "#ef5777";
			document.getElementById("Gardening").style.backgroundColor = "#9cc4ab";
			document.getElementById("Accessory").style.backgroundColor = "#9cc4ab";
			document.getElementById("Others").style.backgroundColor = "#9cc4ab";
			//-----------------------------------------------------------------------
			document.getElementById("Cooking").style.borderColor = "#9cc4ab";
			document.getElementById("Woodwork").style.borderColor = "#9cc4ab";
			document.getElementById("Outdoor").style.borderColor = "#9cc4ab";
			document.getElementById("Art").style.borderColor = "#9cc4ab";
			document.getElementById("Knitting").style.borderColor = "#ef5777";
			document.getElementById("Gardening").style.borderColor = "#9cc4ab";
			document.getElementById("Accessory").style.borderColor = "#9cc4ab";
			document.getElementById("Others").style.borderColor = "#9cc4ab";
			//-----------------------------------------------------------------------
			document.getElementById("Cooking").style.color = "#ffffff";
			document.getElementById("Woodwork").style.color = "#ffffff";
			document.getElementById("Outdoor").style.color = "#ffffff";
			document.getElementById("Art").style.color = "#ffffff";
			document.getElementById("Knitting").style.color = "#2f3542";
			document.getElementById("Gardening").style.color = "#ffffff";
			document.getElementById("Accessory").style.color = "#ffffff";
			document.getElementById("Others").style.color = "#ffffff";
		} else if (page === "Gardening") {
			document.getElementById("Cooking").style.backgroundColor = "#9cc4ab";
			document.getElementById("Woodwork").style.backgroundColor = "#9cc4ab";
			document.getElementById("Outdoor").style.backgroundColor = "#9cc4ab";
			document.getElementById("Art").style.backgroundColor = "#9cc4ab";
			document.getElementById("Knitting").style.backgroundColor = "#9cc4ab";
			document.getElementById("Gardening").style.backgroundColor = "#ef5777";
			document.getElementById("Accessory").style.backgroundColor = "#9cc4ab";
			document.getElementById("Others").style.backgroundColor = "#9cc4ab";
			//-----------------------------------------------------------------------
			document.getElementById("Cooking").style.borderColor = "#9cc4ab";
			document.getElementById("Woodwork").style.borderColor = "#9cc4ab";
			document.getElementById("Outdoor").style.borderColor = "#9cc4ab";
			document.getElementById("Art").style.borderColor = "#9cc4ab";
			document.getElementById("Knitting").style.borderColor = "#9cc4ab";
			document.getElementById("Gardening").style.borderColor = "#ef5777";
			document.getElementById("Accessory").style.borderColor = "#9cc4ab";
			document.getElementById("Others").style.borderColor = "#9cc4ab";
			//-----------------------------------------------------------------------
			document.getElementById("Cooking").style.color = "#ffffff";
			document.getElementById("Woodwork").style.color = "#ffffff";
			document.getElementById("Outdoor").style.color = "#ffffff";
			document.getElementById("Art").style.color = "#ffffff";
			document.getElementById("Knitting").style.color = "#ffffff";
			document.getElementById("Gardening").style.color = "#2f3542";
			document.getElementById("Accessory").style.color = "#ffffff";
			document.getElementById("Others").style.color = "#ffffff";
		} else if (page === "Accessory") {
			document.getElementById("Cooking").style.backgroundColor = "#9cc4ab";
			document.getElementById("Woodwork").style.backgroundColor = "#9cc4ab";
			document.getElementById("Outdoor").style.backgroundColor = "#9cc4ab";
			document.getElementById("Art").style.backgroundColor = "#9cc4ab";
			document.getElementById("Knitting").style.backgroundColor = "#9cc4ab";
			document.getElementById("Gardening").style.backgroundColor = "#9cc4ab";
			document.getElementById("Accessory").style.backgroundColor = "#ef5777";
			document.getElementById("Others").style.backgroundColor = "#9cc4ab";
			//-----------------------------------------------------------------------
			document.getElementById("Cooking").style.borderColor = "#9cc4ab";
			document.getElementById("Woodwork").style.borderColor = "#9cc4ab";
			document.getElementById("Outdoor").style.borderColor = "#9cc4ab";
			document.getElementById("Art").style.borderColor = "#9cc4ab";
			document.getElementById("Knitting").style.borderColor = "#9cc4ab";
			document.getElementById("Gardening").style.borderColor = "#9cc4ab";
			document.getElementById("Accessory").style.borderColor = "#ef5777";
			document.getElementById("Others").style.borderColor = "#9cc4ab";
			//-----------------------------------------------------------------------
			document.getElementById("Cooking").style.color = "#ffffff";
			document.getElementById("Woodwork").style.color = "#ffffff";
			document.getElementById("Outdoor").style.color = "#ffffff";
			document.getElementById("Art").style.color = "#ffffff";
			document.getElementById("Knitting").style.color = "#ffffff";
			document.getElementById("Gardening").style.color = "#ffffff";
			document.getElementById("Accessory").style.color = "#2f3542";
			document.getElementById("Others").style.color = "#ffffff";
		} else if (page === "Others") {
			document.getElementById("Cooking").style.backgroundColor = "#9cc4ab";
			document.getElementById("Woodwork").style.backgroundColor = "#9cc4ab";
			document.getElementById("Outdoor").style.backgroundColor = "#9cc4ab";
			document.getElementById("Art").style.backgroundColor = "#9cc4ab";
			document.getElementById("Knitting").style.backgroundColor = "#9cc4ab";
			document.getElementById("Gardening").style.backgroundColor = "#9cc4ab";
			document.getElementById("Accessory").style.backgroundColor = "#9cc4ab";
			document.getElementById("Others").style.backgroundColor = "#ef5777";
			//-----------------------------------------------------------------------
			document.getElementById("Cooking").style.borderColor = "#9cc4ab";
			document.getElementById("Woodwork").style.borderColor = "#9cc4ab";
			document.getElementById("Outdoor").style.borderColor = "#9cc4ab";
			document.getElementById("Art").style.borderColor = "#9cc4ab";
			document.getElementById("Knitting").style.borderColor = "#9cc4ab";
			document.getElementById("Gardening").style.borderColor = "#9cc4ab";
			document.getElementById("Accessory").style.borderColor = "#9cc4ab";
			document.getElementById("Others").style.borderColor = "#ef5777";
			//-----------------------------------------------------------------------
			document.getElementById("Cooking").style.color = "#ffffff";
			document.getElementById("Woodwork").style.color = "#ffffff";
			document.getElementById("Outdoor").style.color = "#ffffff";
			document.getElementById("Art").style.color = "#ffffff";
			document.getElementById("Knitting").style.color = "#ffffff";
			document.getElementById("Gardening").style.color = "#ffffff";
			document.getElementById("Accessory").style.color = "#ffffff";
			document.getElementById("Others").style.color = "#2f3542";
		}
	};

	// console.log(postings);
	console.log(history.location.pathname);

	return (
		<Container>
			<Item>
				<InputField
					onChange={InputOnChange}
					type="text"
					placeholder="Enter user name"
				/>
				<SubmitBtn
					onClick={() => {
						SubmitClicked(input);
					}}
				>
					<FontAwesomeIcon icon={faSearch} />
				</SubmitBtn>
			</Item>
			<Item>
				<IconContainer>
					<Icons
						id="Art"
						onClick={() => {
							Clicked("Art");
							changeBackgroundColor("Art");
						}}
					>
						Art
					</Icons>
					<Icons
						id="Cooking"
						onClick={() => {
							Clicked("Cooking");
							changeBackgroundColor("Cooking");
						}}
					>
						Cooking
					</Icons>
					<Icons
						id="Woodwork"
						onClick={() => {
							Clicked("Woodwork");
							changeBackgroundColor("Woodwork");
						}}
					>
						Woodwork
					</Icons>
					<Icons
						id="Outdoor"
						onClick={() => {
							Clicked("Outdoor");
							changeBackgroundColor("Outdoor");
						}}
					>
						Outdoor
					</Icons>
					<Icons
						id="Knitting"
						onClick={() => {
							Clicked("Knitting");
							changeBackgroundColor("Knitting");
						}}
					>
						Knitting
					</Icons>
					<Icons
						id="Gardening"
						onClick={() => {
							Clicked("Gardening");
							changeBackgroundColor("Gardening");
						}}
					>
						Gardening
					</Icons>
					<Icons
						id="Accessory"
						onClick={() => {
							Clicked("Accessory");
							changeBackgroundColor("Accessory");
						}}
					>
						Accessory
					</Icons>
					<Icons
						id="Others"
						onClick={() => {
							Clicked("Others");
							changeBackgroundColor("Others");
						}}
					>
						Others
					</Icons>
				</IconContainer>
			</Item>
			<Item>
				<PostingContainer>
					{postings !== null && (
						<>
							{postings?.map((posting, index) => (
								<Posting key={index}>
									<Link
										to={`/postingDetail/${posting?.id}`}
										onClick={() => Clicked(posting)}
									>
										<PostingCenter>
											<PostingPreviewImg src={posting.photoUrl[0]} />
										</PostingCenter>
									</Link>
								</Posting>
							))}
						</>
					)}
				</PostingContainer>
			</Item>
			<div style={{ width: 300, height: 150 }}></div>
		</Container>
	);
}

export default Search;
