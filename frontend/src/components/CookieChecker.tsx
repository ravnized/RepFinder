import { useEffect, useState } from "react";
import { withCookies } from "react-cookie";
import { Link } from "react-router-dom";

function TokenChecker(props: any) {
	const { cookies } = props;
	let [token, setToken] = useState(cookies.get("token") || "");

	useEffect(() => {
		setToken(cookies.get("token") || "");
	}, [cookies]);

	if (token === "" && !props.invert) {
		return <Link className="navBarLink" to={`/${props.link}`}>{props.name}</Link>;
	} else if (token !== "" && props.invert) {
		return <Link className="navBarLink" to={`/${props.link}`}>{props.name}</Link>;
	}
	return <div></div>;
}
export default withCookies(TokenChecker);
