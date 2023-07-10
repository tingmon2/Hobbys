import react, { useState } from "react";
import { authService, firebaseInstance } from "../fbase";
// import AuthForm from "components/AuthForm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faTwitter,
	faGoogle,
	faGithub,
} from "@fortawesome/free-brands-svg-icons";
import AuthForm from "../components/AuthForm";
import styled from "styled-components";

const FormContainer = styled.div`
	display: flex;
	flex-direction: column;
	height: 100vh;
	justify-content: center;
	align-items: center;
	width: 320px;
`;

function Auth() {
	return (
		<FormContainer>
			<AuthForm />
		</FormContainer>
	);
}

export default Auth;
