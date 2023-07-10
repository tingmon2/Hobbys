import react, { useState } from "react";
import { authService, dbService, firebaseInstance } from "../fbase";
// import AuthForm from "components/AuthForm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faTwitter,
	faGoogle,
	faGithub,
} from "@fortawesome/free-brands-svg-icons";
import styled from "styled-components";
import { isNewUserAtom, Ranks } from "../atoms";
import { useRecoilState } from "recoil";

const AuthBtns = styled.div`
	display: flex;
	justify-content: space-between;
	width: 100%;
	max-width: 320px;
`;

const AuthBtn = styled.button`
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
	font-size: 10px;
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

interface IAdditionalUserInfo {
	uid?: string;
	displayName?: string;
	streetName?: string;
	city?: string;
	province?: string;
	postalCode?: string;
	sellerPoint: number;
	buyerPoint: number;
	cashback: number;
	rank: Ranks;
	photoURL?: string;
	isPromoted: boolean;
}

function SocialLogin() {
	const [isNewUser, setIsNewUser] = useRecoilState<any>(isNewUserAtom);
	const onSocialClick = async (event: any) => {
		const {
			target: { name },
		} = event;
		let provider: any;
		if (name === "google") {
			provider = new firebaseInstance.auth.GoogleAuthProvider();
		} else if (name === "github") {
			provider = new firebaseInstance.auth.GithubAuthProvider();
		}
		const data = await authService.signInWithPopup(provider);
		const flag = data.additionalUserInfo?.isNewUser;
		console.log(data);
		console.log(data.additionalUserInfo);
		console.log(data.additionalUserInfo?.isNewUser);
		setIsNewUser(flag);

		if (data.additionalUserInfo?.isNewUser) {
			const userInfo: IAdditionalUserInfo = {
				uid: data.user?.uid,
				displayName: data.user?.displayName || "New User",
				sellerPoint: 0,
				buyerPoint: 0,
				cashback: 0,
				isPromoted: false,
				rank: Ranks.Bronze,
				photoURL: data.user?.photoURL || undefined,
			};
			await dbService.collection("UserInfo").add(userInfo);
		}
	};
	return (
		<AuthBtns>
			<AuthBtn onClick={onSocialClick} name="google" className="authBtn">
				Continue with Google <FontAwesomeIcon icon={faGoogle} />
			</AuthBtn>
			<AuthBtn onClick={onSocialClick} name="github" className="authBtn">
				Continue with Github <FontAwesomeIcon icon={faGithub} />
			</AuthBtn>
		</AuthBtns>
	);
}

export default SocialLogin;
