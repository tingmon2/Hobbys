// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// @ts-nocheck
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Collapse from "@mui/material/Collapse";
import SwitchUnstyled from "@mui/base/SwitchUnstyled";
import { useEffect, useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import { createTheme } from "@mui/material/styles";

import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
//////////
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookMessenger } from "@fortawesome/free-brands-svg-icons";
import {
	faShoppingCart,
	faUser,
	faSearch,
	faHeart,
	faPlusSquare,
	faChevronUp,
	faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
	selectedCommentAtom,
	selectedIconAtom,
	selectedPostingAtom,
	uidAtom,
} from "../atoms";
import { padding } from "@mui/system";

const theme = createTheme({
	status: {
		danger: "#e53e3e",
	},
	palette: {
		primary: {
			main: "#0971f1",
			darker: "#053e85",
		},
		neutral: {
			main: "#64748B",
			contrastText: "#fff",
		},
	},
});

const NavContainer = styled.nav`
	display: flex;
	justify-content: center;
	position: fixed; /* Set the navbar to fixed position */
	bottom: 0px; /* Position the navbar at the bottom of the page */
	width: 100%; /* Full width */
	max-width: 450px;
	z-index: 1;
	flex-direction: column;

	// display: flex;
	// justify-content: start;
	// align-items: center;
	// margin-bottom: 10px;
	// width: 100%;
	// background-color: ${(props) => props.theme.postingBgColor};
	// flex-direction: column;
`;
const NavList = styled.ul`
	display: flex;
	width: 100%;
	justify-content: space-around;
	background-color: ${(props) => props.theme.mainColor};
`;
const NavList2 = styled.div`
	display: flex;
	width: 100%;
	justify-content: center;
`;
const NavItem = styled.li`
	font-size: 15px;
	margin: 0px 2px 0px 5px;
	a {
		padding: 10px;
		transition: color 0.2s ease-in;
		display: block;
	}
	&:hover {
		a {
			color: ${(props) => props.theme.mainColor};
		}
	}
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
	align-items: start;
	height: 30px;
	background-color: ${(props) => props.theme.mainColor};
	margin: 5px 5px;
	width: 30px;
`;

const Navigation = () => {
	const [open, setOpen] = useState(true);
	const [selectedIcon, setSelectedIcon] = useRecoilState(selectedIconAtom);
	const uid = useRecoilValue(uidAtom);

	const handleOpen = () => {
		setOpen((prev) => !prev);
	};

	const OnIconClick = (iconName) => {
		setSelectedIcon(iconName);
	};

	return (
		<>
			{uid !== "" && (
				<NavContainer>
					<NavList2>
						{open ? (
							<FormControlLabel
								style={{ marginRight: 0 }}
								control={
									<ToggleButton checked={open} onChange={handleOpen}>
										<FontAwesomeIcon
											icon={faChevronDown}
											color={"#fab73d"}
											size="2x"
										/>
									</ToggleButton>
								}
								label=""
							/>
						) : (
							<FormControlLabel
								control={
									<ToggleButton checked={open} onChange={handleOpen}>
										<FontAwesomeIcon
											icon={faChevronUp}
											color={"#fab73d"}
											size="2x"
										/>
									</ToggleButton>
								}
								label=""
							/>
						)}
					</NavList2>

					<Collapse in={open} collapsedSize={"0px"}>
						<NavList>
							<NavItem
								onClick={() => {
									OnIconClick("add");
								}}
							>
								<Link to="/addposting">
									{selectedIcon === "add" ? (
										<FontAwesomeIcon
											icon={faPlusSquare}
											color={"#ff4757"}
											size="2x"
										/>
									) : (
										<FontAwesomeIcon
											icon={faPlusSquare}
											color={"#edece8"}
											size="2x"
										/>
									)}
								</Link>
							</NavItem>
							<NavItem
								onClick={() => {
									OnIconClick("search");
								}}
							>
								<Link to="/search">
									{selectedIcon === "search" ? (
										<FontAwesomeIcon
											icon={faSearch}
											color={"#ff4757"}
											size="2x"
										/>
									) : (
										<FontAwesomeIcon
											icon={faSearch}
											color={"#edece8"}
											size="2x"
										/>
									)}
								</Link>
							</NavItem>
							<NavItem
								onClick={() => {
									OnIconClick("list");
								}}
							>
								<Link to="/likelist">
									{selectedIcon === "list" ? (
										<FontAwesomeIcon
											icon={faHeart}
											color={"#ff4757"}
											size="2x"
										/>
									) : (
										<FontAwesomeIcon
											icon={faHeart}
											color={"#edece8"}
											size="2x"
										/>
									)}
								</Link>
							</NavItem>
							<NavItem
								onClick={() => {
									OnIconClick("cart");
								}}
							>
								<Link to="/cart">
									{selectedIcon === "cart" ? (
										<FontAwesomeIcon
											icon={faShoppingCart}
											color={"#ff4757"}
											size="2x"
										/>
									) : (
										<FontAwesomeIcon
											icon={faShoppingCart}
											color={"#edece8"}
											size="2x"
										/>
									)}
								</Link>
							</NavItem>
						</NavList>
					</Collapse>
				</NavContainer>
			)}
		</>
	);
};

export default Navigation;
