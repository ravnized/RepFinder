import { useEffect } from "react";
import { useCookies } from "react-cookie";

function Logout(props: any) {
	const [cookies,, removeCookie] = useCookies();

	useEffect(() => {
		if (cookies.token !== undefined) {
			removeCookie("token");
			window.location.href = "/";
		}
	}, [cookies, removeCookie]);
	return <></>;
}
export default Logout;
