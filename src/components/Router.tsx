// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// @ts-nocheck
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
	cartAtom,
	isLoggedInState,
	photoURLAtom,
	selectedPostingAtom,
	uidAtom,
	userObjectAtom,
} from "../atoms";
import Navigation from "./Navigation";
import Header from "./Header";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import Search from "../routes/Search";
import LikeList from "../routes/LikeList";
import AddPosting from "../routes/AddPostingPhoto";
import Message from "../routes/Message";
import Posting from "../routes/Posting";
import Auth from "../routes/Auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Cart from "../routes/Cart";
import AddPostingDetail from "../routes/AddPostingDetail";
import AddPostingPhoto from "../routes/AddPostingPhoto";
import PostingDetail from "../routes/PostingDetail";
import Checkout from "../routes/Checkout";
import AddressInfo from "../routes/AddressInfo";

function AppRouter({ refreshUser }) {
	const isLoggedIn = useRecoilValue(isLoggedInState);
	const uid = useRecoilValue(uidAtom);
	const userObject = useRecoilValue(userObjectAtom);
	const selectedPostingInfo = useRecoilValue(selectedPostingAtom);

	console.log("router");

	return (
		<Router>
			<Header userObject={userObject} />
			<Navigation userObject={userObject} />
			<Switch>
				{isLoggedIn ? (
					<>
						<Route exact path="/Hobbys/">
							<Home userObject={userObject} />
						</Route>

						<Route path={`/:uid/profile`}>
							<Profile userObject={userObject} refreshUser={refreshUser} />
						</Route>

						<Route exact path="/search">
							<Search />
						</Route>

						<Route exact path="/likelist">
							<LikeList />
						</Route>

						<Route exact path={`/postingDetail/${selectedPostingInfo?.id}`}>
							<PostingDetail />
						</Route>

						<Route exact path="/addposting">
							<AddPostingPhoto
								userObject={userObject}
								refreshUser={refreshUser}
							/>
						</Route>
						<Route path={`/addposting/${uid}`}>
							<AddPostingDetail />
						</Route>

						<Route exact path="/message">
							<Message />
						</Route>

						<Route exact path={`/cart`}>
							<Cart />
						</Route>
						<Route exact path={`/cart/${uid}`}>
							<Checkout />
						</Route>
					</>
				) : (
					<Route exact path="/Hobbys/">
						<Auth />
					</Route>
				)}
			</Switch>
		</Router>
	);
}

export default AppRouter;
