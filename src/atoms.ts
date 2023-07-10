import { atom, selector } from "recoil";
import { isNullishCoalesce } from "typescript";

export interface IUserMetaData {
	creationTime: string;
	lastSignInTime: string;
}

export interface IMultiFactorInfo {
	displayName: string | null;
	enrollmentTime: string;
	factorId: string;
	uid: string;
}

export interface IMultiFactorUser {
	enrolledFactors: IMultiFactorInfo;
}

export interface IUserInfo {
	displayName: string | null;
	email: string | null;
	phoneNumber: string | null;
	photoURL: string | null;
	providerId: string;
	uid: string;
}

export interface IUserObject {
	displayName: string | null;
	email: string | null;
	emailVerified: boolean;
	isAnonymous: boolean;
	metadata: IUserMetaData;
	multiFactor: IMultiFactorUser;
	phoneNumber: string | null;
	photoURL: string | null;
	providerData: IUserInfo[];
	providerId: string;
	refreshToken: string;
	tenantId: string | null;
	uid: string;
}

export enum Ranks {
	"Bronze" = "Bronze",
	"Silver" = "Silver",
	"Gold" = "Gold",
	"Platinum" = "Platinum",
	"Master" = "Master",
	"HallofFamer" = "HallofFamer",
}

export interface ISellerRank {
	rank: Ranks;
}

interface IPostingInfo {
	photos: string[];
	userObject: any;
}

export const isLoggedInState = atom<boolean>({
	key: "isLoggedIn",
	default: false,
});

export const isVisitorAtom = atom<boolean>({
	key: "isVisitor",
	default: false,
});

export const isNewUserAtom = atom<any>({
	key: "isNewUserAtom",
	default: false,
});

export const isInitialized = atom<any>({
	key: "isInitialized",
	default: false,
});

// uid of current user
export const uidAtom = atom<string>({
	key: "uid",
	default: "",
});

// userObject atom to use anywhere
export const userObjectAtom = atom<any>({
	key: "userObject",
	default: null,
});

export const postingsObject = atom<any>({
	key: "postingsObject",
	default: null,
});

export const photoURLAtom = atom<string>({
	key: "photoURL",
	default: "",
});

export const selectedPostingAtom = atom<any>({
	key: "selectedPosting",
	default: null,
});

export const cartAtom = atom<any>({
	key: "cart",
	default: null,
});

export const selectedCommentAtom = atom<any>({
	key: "selectedCommentAtom",
	default: null,
});

export const priceTotalInfoAtom = atom<any>({
	key: "totalInfo",
	default: null,
});

export const addressInfoAtom = atom<any>({
	key: "addressInfoAtom",
	default: null,
});

export const paymentInfoAtom = atom<any>({
	key: "paymentInfoAtom",
	default: null,
});

export const cartItemsAtom = atom<any>({
	key: "cartItemsAtom",
	default: null,
});

export const transactionAtom = atom<any>({
	key: "transactionAtom",
	default: null,
});

export const selectedIconAtom = atom<string>({
	key: "transactionAtom",
	default: "",
});
// export const userObjectState = atom<IUserObject>({
// 	key: "userObject",
// 	default: {
// 		displayName: "",
// 		email: "",
// 		emailVerified: false,
// 		isAnonymous: false,
// 		metadata: { creationTime: "", lastSignInTime: "" },
// 		multiFactor: {
// 			enrolledFactors: {
// 				displayName: "",
// 				enrollmentTime: "",
// 				factorId: "",
// 				uid: "",
// 			},
// 		},
// 		phoneNumber: "",
// 		photoURL: "",
// 		providerData: [
// 			{
// 				displayName: "",
// 				email: "",
// 				phoneNumber: "",
// 				photoURL: "",
// 				providerId: "",
// 				uid: "",
// 			},
// 		],
// 		providerId: "",
// 		refreshToken: "",
// 		tenantId: "",
// 		uid: "",
// 	},
// });
