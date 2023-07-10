// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// @ts-nocheck

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPlus,
	faTimes,
	faCloudUploadAlt,
	faCamera,
} from "@fortawesome/free-solid-svg-icons";
import { authService, dbService, storageService } from "../fbase";
import react, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useRecoilState, useSetRecoilState } from "recoil";
import { addressInfoAtom, uidAtom } from "../atoms";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

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
	font-family: "Sniglet", cursive;
	max-width: 295px;
	width: 100%;
	padding: 10px;
	margin-bottom: 10px;
	font-size: 14px;
	color: #ffffff;

	box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px 0px;
	border-radius: 205px 15px 180px 5px/7px 225px 25px 235px;
	border: solid 2px ${(props) => props.theme.secondColor};
`;

const UserNameInputField = styled.input`
	font-family: "Sniglet", cursive;
	max-width: 295px;
	width: 100%;
	padding: 10px;
	margin-bottom: 10px;
	font-size: 14px;
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

const EditForm = styled.form`
	width: 100%;
	max-width: 320px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const LogoutBtn = styled.button`
	cursor: pointer;
	font-family: "Sniglet", cursive;
	text-align: center;
	padding: 10px;
	max-width: 300px;
	width: 100%;
	margin-top: 10px;
	margin-bottom: 10px;
	background-color: ${(props) => props.theme.redColor};
	font-size: 16px;
	color: ${(props) => props.theme.logoColor};
	letter-spacing: 2px;
	box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 1px 0px,
		rgba(0, 0, 0, 0.1) 0px 4px 2px 0px;
	border-radius: 205px 35px 180px 20px/15px 225px 10px 235px;
	border: solid 4px ${(props) => props.theme.redColor};
`;

const PreviewImg = styled.img`
	border-radius: 50%;
	width: 170px;
	height: 170px;
	margin-bottom: 10px;
`;

const PhotoInput = styled.span`
	color: #ffffff;
	font-family: "Sniglet", cursive;
	text-align: center;
	margin: 10px;
	background-color: ${(props) => props.theme.secondColor};
	letter-spacing: 2px;
	font-size: 17px;
	box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 1px 0px,
		rgba(0, 0, 0, 0.1) 0px 4px 2px 0px;
	border-radius: 205px 35px 180px 20px/15px 225px 10px 235px;
	border: solid 4px ${(props) => props.theme.secondColor};
	cursor: pointer;
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
	font-size: 15px;
	color: blanchedalmond;
	padding: 3px;
	margin: 10px;
	background-color: #04aaff;
	letter-spacing: 2px;
	box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px 0px,
		rgba(0, 0, 0, 0.23) 0px 3px 6px 0px;
	border-radius: 205px 15px 180px 5px/7px 225px 25px 235px;
	border: solid 4px #04aaff;
	cursor: pointer;
`;

const ErrorMessage = styled.span`
	color: ${(props) => props.theme.redColor};
`;

const GoAddressBtn = styled.button`
	display: block;
	font-family: "Sniglet", cursive;
	text-align: center;
	margin-top: 10px;
	border-color: ${(props) => props.theme.secondColor};
	max-width: 300px;
	width: 100%;
	padding: 10px;
	border-radius: 15px;
	font-size: 15px;
	color: #ffffff;
	padding: 3px;

	background-color: ${(props) => props.theme.secondColor};
	letter-spacing: 2px;
	box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px 0px,
		rgba(0, 0, 0, 0.23) 0px 3px 6px 0px;
	border-radius: 205px 15px 180px 5px/7px 225px 25px 235px;
	border: solid 4px ${(props) => props.theme.secondColor};
	cursor: pointer;
`;

// const GoAddressBtnRed = styled.button`
// 	text-align: center;
// 	background: #ea2027;
// 	color: white;
// 	margin-top: 10px;
// 	cursor: pointer;
// 	width: 300px;
// 	padding: 10px;
// 	border-radius: 30px;
// 	background-color: #ea2027;

// 	font-size: 12px;
// 	color: white;
// 	font-weight: bold;
// `;

interface IForm {
	userName?: string;
	streetName?: string;
	city?: string;
	province?: string;
	postalCode?: string;
}

function EditProfile({ userObject, refreshUser, userInfo, uid }) {
	const history = useHistory();
	const [newPhotoURL, setNewPhotoURL] = useState(userObject.photoURL);
	const [previewImg, setpreviewImg] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [addressInfo, setAddressInfo] = useRecoilState(addressInfoAtom);
	const setUid = useSetRecoilState(uidAtom);

	// const userInfo = await dbService
	// 	.collection("UserInfo")
	// 	.where("uid", "==", userObject?.uid)
	// 	.get();

	console.log(userInfo.docs[0]?.data());

	async function fetchAddressInfo(uid) {
		dbService
			.collection("AddressInfo")
			.where("uid", "==", uid)
			.onSnapshot((snapshot) => {
				const recordSnapshot = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				console.log(recordSnapshot);
				setAddressInfo(recordSnapshot);
			});
	}

	useEffect(() => {
		fetchAddressInfo(uid);
		setIsLoading(false);
	}, []);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		setError,
	} = useForm<IForm>({
		defaultValues: {
			userName: userInfo.docs[0].data().displayName,
		},
	});

	const onLogOutClick = () => {
		authService.signOut();
		setUid("");
		history.push("/Hobbys/");
	};

	const onAddressClick = async () => {
		if (addressInfo.length == 0 || addressInfo === undefined) {
			const addressInfoValue = {
				uid: userObject.uid,
				shippingAddress: {
					firstName: "",
					lastName: "",
					phoneNumber: "",
					address1: "",
					address2: "",
					city: "",
					province: "",
					postalcode: "",
				},
				billingAddress: {
					firstName: "",
					lastName: "",
					phoneNumber: "",
					address1: "",
					address2: "",
					city: "",
					province: "",
					postalcode: "",
				},
			};
			await dbService.collection("AddressInfo").add(addressInfoValue);
			console.log("new address info");
		}
	};

	const onEditClick = (event) => {
		event.stopPropagation();
		setIsLoading(true);
	};

	const onValid = async (data: IForm) => {
		// make your own error conditions(address validation)
		// if (data.price > 9999) {
		// 	setError(
		// 		"price",
		// 		{ message: "Too Expensive! Enter Less Than 9999$" },
		// 		{ shouldFocus: true }
		// 	);
		// 	throw "too expensive";
		// }
		console.log("on valid: " + data);
		const userInfo = await dbService
			.collection("UserInfo")
			.where("uid", "==", userObject?.uid)
			.get();
		const posting = await dbService
			.collection("Posting")
			.where("creatorUid", "==", userObject.uid)
			.orderBy("createdAt", "desc")
			.get();

		const appliedPosting = posting.docs.map((doc) => doc.id);

		if (data.userName !== "") {
			console.log(data);
			const userUpdate = {
				displayName: data.userName,
			};
			await userInfo.docs[0].ref.update(userUpdate);
		}

		if (userObject.displayName !== data.userName && data.userName !== "") {
			await userObject.updateProfile({
				displayName: data.userName,
			});

			appliedPosting.forEach((element) => {
				dbService.doc(`Posting/${element}`).update({
					creatorDisplayName: data.userName,
				});
			});
			// userInfo.docs[0].data().userName = data.userName;
			refreshUser();
		}
		if (userObject.photoURL !== newPhotoURL) {
			let imgFileUrl = "";
			try {
				console.log(userObject.photoURL);
				// google account is not applicable for this occasion
				if (userObject.photoURL !== null) {
					await storageService.refFromURL(userObject.photoURL).delete();
				}
				const imgFileRef = storageService
					.ref()
					.child(`${userObject.uid}/profile/${uuidv4()}`);

				const response = await imgFileRef.putString(newPhotoURL, "data_url");

				imgFileUrl = await response.ref.getDownloadURL();

				await userObject.updateProfile({
					photoURL: imgFileUrl,
				});
				refreshUser();
				setpreviewImg(null);

				//해당 if문의 경우 사진이 변경 되었으므로 유저의 프사정보를 트윗에도 함께 업데이트 해줘야함
				//트윗 콜렉션 불러서 WHERE, MAP 써서 일일이 변경
				console.log("error? 2");

				console.log(posting);
				// appliedTweets는 해당 유저의 게시물의 아이디를 갖는 배열
				if (posting !== null) {
					// 게시물 아이디의 작성자 프사 정보를 전부 수정
					appliedPosting.forEach((element) => {
						dbService.doc(`Posting/${element}`).update({
							creatorImgUrl: imgFileUrl,
						});
					});
				}
			} catch (error) {
				const imgFileRef = storageService
					.ref()
					.child(`${userObject.uid}/profile/${uuidv4()}`);

				const response = await imgFileRef.putString(newPhotoURL, "data_url");

				imgFileUrl = await response.ref.getDownloadURL();

				await userObject.updateProfile({
					photoURL: imgFileUrl,
				});
				refreshUser();
				setpreviewImg(null);

				//해당 if문의 경우 사진이 변경 되었으므로 유저의 프사정보를 트윗에도 함께 업데이트 해줘야함
				//트윗 콜렉션 불러서 WHERE, MAP 써서 일일이 변경
				console.log("error? 2");

				console.log(posting);
				// appliedTweets는 해당 유저의 게시물의 아이디를 갖는 배열
				if (posting !== null) {
					// 게시물 아이디의 작성자 프사 정보를 전부 수정
					appliedPosting.forEach((element) => {
						dbService.doc(`Posting/${element}`).update({
							creatorImgUrl: imgFileUrl,
						});
					});
				}
			}
		}
		Swal.fire({
			title: "Your Profile is Updated!",
			confirmButtonText: "Got It",
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				// Swal.fire("Saved!", "", "success");
			}
		});
		history.push("/Hobbys/");
	};

	const onFileChange = (event) => {
		const {
			target: { files },
		} = event;
		const imgFile = files[0];
		const reader = new FileReader();
		reader.readAsDataURL(imgFile);
		//This onloadend is triggered each time the reading operation is completed
		reader.onloadend = (finishedEvent) => {
			const {
				currentTarget: { result },
			} = finishedEvent;
			setNewPhotoURL(result);
			setpreviewImg(result);
		};
	};

	console.log(addressInfo);

	return (
		<Container className="container">
			<EditForm onSubmit={handleSubmit(onValid)} className="profileForm">
				<Link to={`/${userObject.uid}/profile/address`}>
					<GoAddressBtn
						onClick={() => {
							onAddressClick();
						}}
					>
						Go to Address Info
					</GoAddressBtn>
				</Link>

				<label style={{ color: "#04aaff", marginRight: 20 }}>
					<InputField
						type="file"
						accept="image/*"
						onChange={onFileChange}
						className="formBtn"
						style={{ marginTop: 10, height: 27, paddingBottom: 3 }}
					/>
					<PhotoInput>
						<FontAwesomeIcon icon={faCloudUploadAlt} />
						<span> Choose Profile Photo</span>
					</PhotoInput>
				</label>

				{previewImg && <PreviewImg src={previewImg}></PreviewImg>}
				<UserNameInputField
					type="text"
					{...register("userName", {
						minLength: { value: 2, message: "User Name is too Short" },
					})}
					placeholder="Edit User Name"
				/>
				<ErrorMessage>{errors?.email?.message}</ErrorMessage>
				{isLoading ? (
					<>
						<SubmitBtn disabled style={{ cursor: "wait" }}>
							Applying...
						</SubmitBtn>
						<LogoutBtn
							className="formBtn cancelBtn logOut"
							disabled
							style={{ cursor: "wait" }}
						>
							Log Out
						</LogoutBtn>
					</>
				) : (
					<>
						<SubmitBtn onClick={onEditClick}>Edit Profile</SubmitBtn>
						<LogoutBtn
							className="formBtn cancelBtn logOut"
							onClick={onLogOutClick}
						>
							Log Out
						</LogoutBtn>
					</>
				)}
			</EditForm>
		</Container>
	);
}

export default EditProfile;
