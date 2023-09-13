import React from "react";
import {withCookies} from "react-cookie";
import { Link } from "react-router-dom";
class TokenChecker extends React.Component<
	{ invert: boolean ,name: string; link: string; cookies: any },
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
		}else if(this.state.token !== "" && this.props.invert){
			return <Link to={`/${this.props.link}`}>{this.props.name}</Link>;
		}
		return <div></div>;
	}
}
export default withCookies(TokenChecker);
