// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// @ts-nocheck

import React, { useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { ReactQueryDevtools } from "react-query/devtools";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
	isLoggedInState,
	IUserObject,
	Ranks,
	uidAtom,
	userObjectAtom,
	userObjectUidAtom,
	isNewUserAtom,
	isInitialized,
} from "./atoms";
import { authService, dbService } from "./fbase";
import AppRouter from "./components/Router";

const GlobalStyle = createGlobalStyle`
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, menu, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
main, menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	font-family: 'Lato', sans-serif;
	margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, main, menu, nav, section {
	font-family: 'Lato', sans-serif;
	display: block;
}
/* HTML5 hidden-attribute fix for newer browsers */
*[hidden] {
    display: none;
}
body {
	font-family: 'Lato', sans-serif;
	line-height: 1;
}
menu, ol, ul {
	
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
a{
  text-decoration: none;
  color:inherit;
}
html, body{
	padding: 0;
	margin: 0;
  }
  html{
	height: 100%;
  }
  body{
	min-height: 100%;
	background-color: #ffffff;
  }
  input[type="file"] {
    display: none;
}
`;

const Title = styled.h1`
	color: ${(props) => props.theme.textColor};
`;

const Wrapper = styled.div`
	display: flex;
	height: 100vh;
	min-height: 100%;
	width: 100vw;
	justify-content: center;
	align-items: center;
	background-color: #ffffff;
	margin: 0 auto;
`;

const Container = styled.div`
	font-family: "Noto Sans", sans-serif;
	width: 450px;
	height: 100vh;
	min-height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 0 auto;
	background-color: #ffffff;
`;

function App() {
	const setIsLoggedIn = useSetRecoilState(isLoggedInState);
	const [init, setInit] = useRecoilState(isInitialized);
	const [userObject, setUserObject] = useState(null);
	const setUidAtom = useSetRecoilState(uidAtom);
	const setUserObjectAtom = useSetRecoilState(userObjectAtom);
	const [isNewUser, setIsNewUser] = useRecoilState(isNewUserAtom);
	// console.log(authService.currentUser);
	// console.log(isLoggedInState);

	const assignDisplayName = async () => {
		const user = authService.currentUser;
		// console.log("maybe problem ", user?.displayName);
		const noDNUser = await dbService
			.collection("UserInfo")
			.where("uid", "==", user?.uid)
			.get();

		const newDisplayName = noDNUser.docs[0]?.data().displayName;
		// console.log(newDisplayName);
		await user?.updateProfile({
			displayName: newDisplayName,
		});
		// console.log("maybe problem ", user?.displayName);
		refreshUser();
	};

	useEffect(() => {
		authService.onAuthStateChanged((user) => {
			console.log(user);
			if (user) {
				// setIsLoggedIn(true);
				// console.log(user.displayName);
				setUserObject({
					displayName: user.displayName,
					uid: user.uid,
					photoURL: user.photoURL,
					updateProfile: (args: any) => {
						user.updateProfile(args);
					},
				});
				// console.log(userObject);
				setIsLoggedIn(true);
				setUidAtom(user.uid);
				// 불필요한 리프레시를 방지하기 위해 isNewUser따져서 그때만 실행하도록 나중에 바꿔야함
				assignDisplayName();
				setUserObjectAtom(userObject);
			} else {
				setIsLoggedIn(false);
				setUserObject(null);
				setUidAtom("");
			}
			// else{
			//   setIsLoggedIn(false);
			// }
			setInit(true);
		});
	}, []);

	const refreshUser = () => {
		console.log("refreshing");
		const user = authService.currentUser; // too big object for noticing subtle change.
		// console.log(user?.displayName);
		setUserObject({
			displayName: user.displayName,
			uid: user.uid,
			photoURL: user.photoURL,
			updateProfile: (args: any) => user.updateProfile(args),
		});
	};

	setUserObjectAtom(userObject);
	// console.log(userObjectAtom);

	return (
		<>
			<GlobalStyle></GlobalStyle>
			<Wrapper>
				<Container>
					{init ? (
						<AppRouter
							userObject={userObject}
							refreshUser={refreshUser}
						></AppRouter>
					) : (
						"Please Wait..."
					)}
				</Container>
			</Wrapper>
			<ReactQueryDevtools initialIsOpen={true}></ReactQueryDevtools>
		</>
	);
}

export default App;
