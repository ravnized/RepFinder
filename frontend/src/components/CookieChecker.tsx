import React from "react";
import {withCookies} from "react-cookie";
import { Link } from "react-router-dom";
class TokenChecker extends React.Component<
	{ name: string; link: string; cookies: any },
	{ token: string }
> {
	constructor(props: any) {
		super(props);
		const { cookies } = props;
		this.state = {
			token: cookies.get("token") || "",
		};
	}
	public render(): React.ReactNode {
		if (this.state.token !== "") {
			return <Link to={`/${this.props.link}`}>{this.props.name}</Link>;
		}
		return <div></div>;
	}
}
export default withCookies(TokenChecker);
