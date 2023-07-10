import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
	selectedCommentAtom,
	selectedIconAtom,
	selectedPostingAtom,
	uidAtom,
	userObjectAtom,
} from "../atoms";

const NavContainer = styled.nav`
	display: flex;
	justify-content: center;
	overflow: hidden;
	position: fixed; /* Set the navbar to fixed position */
	top: 0; /* Position the navbar at the top of the page */
	width: 100%; /* Full width */
	background-color: ${(props) => props.theme.mainColor};
	max-width: 450px;
	max-height: 55px;
	z-index: 1;
	box-shadow: 0 4px 4px -4px #000;
`;

const NavList = styled.ul`
	display: flex;
	width: 100%;
	justify-content: flex-end;
	background-color: ${(props) => props.theme.mainColor};
`;

const NavItem = styled.li`
	font-size: 15px;
	margin: -3px 2px 0px 5px;
	a {
		padding: 10px 5px 10px 5px;
		transition: color 0.2s ease-in;
		display: block;
	}
	&:hover {
		a {
			color: ${(props) => props.theme.mainColor};
		}
	}
`;
const LogoContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	margin-left: 15px;
`;

//const Logo = styled.img``;

const Hobbys = styled.h1`
	font-family: "Sniglet", cursive;
	margin: 0px 1px 3px 2px;
	font-size: 35px;
	font-weight: bold;
	text-shadow: 1px 2px 3px #ff3f34;

	color: ${(props) => props.theme.logoColor};
`;

const HobbysClicked = styled.h1`
	font-family: "Sniglet", cursive;
	margin: 0px 1px 3px 2px;
	font-size: 35px;
	font-weight: bold;
	text-shadow: 1px 2px 3px #05c46b;
	color: #ff4757;

	/* color: #ef5777; */
`;

const ProfileImage = styled.img`
	width: 40px;
	height: 40px;
	border-radius: 50%;
	margin-right: 5px;
	line-height: 50px;
	text-align: center;
	background-color: ${(props) => props.theme.textColor};
	box-shadow: 0px 0px 1px 1px #ffffff;
`;

const ProfileImageClicked = styled.img`
	width: 40px;
	height: 40px;
	border-radius: 50%;
	margin-right: 5px;
	line-height: 50px;
	text-align: center;
	background-color: #ff4757;
	box-shadow: 0px 0px 2px 2px #ff4757;
	/* border: 1px solid #e15f41; */
`;
//<FontAwesomeIcon icon={faTools} color={"#F9C963"} size="1x" />

function Header() {
	const uid = useRecoilValue(uidAtom);
	const userObject = useRecoilValue(userObjectAtom);
	const setSelectedPosting = useSetRecoilState(selectedPostingAtom);
	const setSelectedComment = useSetRecoilState(selectedCommentAtom);
	const selectedIcon = useRecoilValue(selectedIconAtom);

	const MyProfileClicked = () => {
		setSelectedPosting(null);
		setSelectedComment(null);
		console.log("nav work");
	};

	console.log(userObject);

	return (
		<>
			{uid !== "" && ""}
			<NavContainer>
				<LogoContainer>
					<Link to="/Hobbys/">
						{selectedIcon === "home" ? (
							<HobbysClicked>HOBBY'S</HobbysClicked>
						) : (
							<Hobbys>HOBBY'S</Hobbys>
						)}
					</Link>
				</LogoContainer>
				<NavList>
					{userObject ? (
						<>
							{userObject?.photoURL !== null ? (
								<NavItem>
									<Link
										to={`/${uid}/profile`}
										onClick={() => MyProfileClicked()}
									>
										{selectedIcon === "profile" ? (
											<ProfileImageClicked
												src={userObject?.photoURL}
												alt="No Img"
											/>
										) : (
											<ProfileImage src={userObject?.photoURL} alt="No Img" />
										)}

										{/* <FontAwesomeIcon icon={faUser} color={"#E8EBED"} size="2x" /> */}
									</Link>
								</NavItem>
							) : (
								<NavItem>
									<Link
										to={`/${uid}/profile`}
										onClick={() => MyProfileClicked()}
									>
										{selectedIcon === "profile" ? (
											<FontAwesomeIcon
												icon={faUser}
												color={"#2F5597"}
												size="2x"
											/>
										) : (
											<FontAwesomeIcon
												icon={faUser}
												color={"#E8EBED"}
												size="2x"
											/>
										)}
									</Link>
								</NavItem>
							)}
						</>
					) : (
						<NavItem>
							<Link to={`/${uid}/profile`} onClick={() => MyProfileClicked()}>
								{selectedIcon === "profile" ? (
									<FontAwesomeIcon icon={faUser} color={"#E8EBED"} size="2x" />
								) : (
									<FontAwesomeIcon icon={faUser} color={"#E8EBED"} size="2x" />
								)}
							</Link>
						</NavItem>
					)}
				</NavList>
			</NavContainer>
		</>
	);
}

export default Header;
