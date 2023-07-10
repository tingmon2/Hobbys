export function fetchCoins() {
	return fetch(`https://api.coinpaprika.com/v1/coins`).then((response) => {
		response.json();
	});
}

// const { isLoading, data } = useQuery<ICoin[]>("CoinData", fetchCoins);
//->
// this line is where you want to use the API
// 'data' is where your json retured -> use this
// always have to make interface for API inside components
//->
// interface ICoin {
// 	id: string;
// 	name: string;
// 	symbol: string;
// 	rank: number;
// 	is_new: boolean;
// 	is_active: boolean;
// 	type: string;
// }
