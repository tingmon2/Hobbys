<SignUpForm onSubmit={handleSubmit(onValid)}>
	<InputField
		type="email"
		{...register("email", {
			required: "Email is Required",
			pattern: {
				value:
					/^[a-zA-Z0-9.!#$%&’*+=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
				message: "Invalid Email Pattern",
			},
		})}
		placeholder="*Enter Email"
	/>
	<ErrorMessage>{errors?.email?.message}</ErrorMessage>
	<InputField
		type="password"
		{...register("password", {
			required: "Password is Required",
			minLength: { value: 5, message: "Password is too Short" },
		})}
		placeholder="*Enter Password"
	/>
	<ErrorMessage>{errors?.password?.message}</ErrorMessage>
	<InputField
		type="password"
		{...register("passwordConfirm", {
			required: "Confirm is Required",
			minLength: { value: 5, message: "Password is too Short" },
		})}
		placeholder="*Confirm Password"
	/>
	<ErrorMessage>{errors?.passwordConfirm?.message}</ErrorMessage>
	<InputField
		type="text"
		{...register("userName", {
			required: "User Name is Required",
			minLength: { value: 2, message: "User Name is too Short" },
		})}
		placeholder="*Enter User Name"
	/>
	<ErrorMessage>{errors?.userName?.message}</ErrorMessage>
	<InputField
		type="text"
		{...register("streetName")}
		placeholder="Enter Street Name"
	/>
	<ErrorMessage>{errors?.streetName?.message}</ErrorMessage>
	<InputField type="text" {...register("city")} placeholder="Enter City" />
	<ErrorMessage>{errors?.city?.message}</ErrorMessage>
	<InputField
		type="text"
		{...register("province")}
		placeholder="Enter Province"
	/>
	<ErrorMessage>{errors?.province?.message}</ErrorMessage>
	<InputField
		type="text"
		{...register("postalCode", {
			pattern: {
				value:
					/^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i,
				message: "Invalid Postal Code Pattern",
			},
		})}
		placeholder="Enter Postal Code"
	/>
	<ErrorMessage>{errors?.postalCode?.message}</ErrorMessage>
	<SubmitBtn>Sign Up</SubmitBtn>
</SignUpForm>;
