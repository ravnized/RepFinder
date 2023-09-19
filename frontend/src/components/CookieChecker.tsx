import React, { useEffect, useState } from "react";
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
/*
class TokenChecker extends React.Component<
	{ invert: boolean; name: string; link: string; cookies: any },
	{ token: string }
> {
	constructor(props: any) {
		super(props);
		const { cookies } = props;
		this.state = {
			token: cookies.get("token") || "",
		};
	}
	componentDidMount(): void {
		const { cookies } = this.props;
		this.setState({
			token: cookies.get("token") || "",
		});
	}

	public render(): React.ReactNode {
		if (this.state.token === "" && !this.props.invert) {
			return <Link to={`/${this.props.link}`}>{this.props.name}</Link>;
		} else if (this.state.token !== "" && this.props.invert) {
			return <Link to={`/${this.props.link}`}>{this.props.name}</Link>;
		}
		return <div></div>;
	}
}
*/
export default withCookies(TokenChecker);
