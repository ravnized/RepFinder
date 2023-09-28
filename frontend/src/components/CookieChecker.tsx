import { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import { withCookies } from "react-cookie";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import "../css/NavbarCustom.css";

function TokenChecker(props: any) {
	const { cookies } = props;
	let [token, setToken] = useState(cookies.get("token") || "");
	useEffect(() => {
		setToken(cookies.get("token") || "");
	}, [cookies]);

	if (token === "" && !props.invert) {
		return (
			<LinkContainer to={`/${props.link}`}>
				<Nav.Link>{props.name}</Nav.Link>
			</LinkContainer>
		);
	} else if (token !== "" && props.invert) {
		return (
			<LinkContainer to={`/${props.link}`}>
				<Nav.Link>{props.name}</Nav.Link>
			</LinkContainer>
		);
	}
	return <></>;
}
export default withCookies(TokenChecker);
