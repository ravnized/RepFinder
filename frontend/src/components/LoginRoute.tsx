import React from "react";
import { Navigate } from "react-router-dom";
import { withCookies } from "react-cookie";
class LoginRedirect extends React.Component<{children: any,cookies: any }, { token: string }> {
	
	constructor(props: any) {
		super(props);
		const { cookies } = props;
		this.state = {
			token: cookies.get("token") || "",
		};
        
	}

	render():React.ReactNode {
        //console.log(this);
		const token = this.state.token;
        //console.log(token);
        if(token !== ""){
            return <Navigate to="/" replace={true} />
        }else{
            return this.props.children;
        }
		
	}
}
export default withCookies(LoginRedirect);
