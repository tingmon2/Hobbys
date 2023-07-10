import styled from "styled-components";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import PostingForm from "../components/PostingForm";
import { photoURLAtom, uidAtom, userObjectAtom } from "../atoms";

const FormContainer = styled.div`
	display: flex;
	flex-direction: column;
	height: 110vh;
	justify-content: center;
	align-items: center;
	width: 320px;
`;

function AddPostingDetail() {
	return (
		<FormContainer>
			<PostingForm />
		</FormContainer>
	);
}

export default AddPostingDetail;
