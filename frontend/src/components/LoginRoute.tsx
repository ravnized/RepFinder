import { Navigate } from "react-router-dom";
import { withCookies } from "react-cookie";

function LoginRedirect(props: any) {
	const { cookies } = props;
	const token = cookies.get("token") || "";
	if (token !== "") {
		return <Navigate to="/" replace={true} />;
	} else {
		return props.children;
	}
}

export default withCookies(LoginRedirect);
