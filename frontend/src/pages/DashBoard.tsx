import React from "react";

class DashBoard extends React.Component<
	{},
	{ message: string; error: string }
> {
	constructor(props: any) {
		super(props);
		this.state = {
			message: "",
			error: "",
		};
	}

	render(): React.ReactNode {
		return (
			<div>
				<h1>Dashboard</h1>
			</div>
		);
	}
}
export default DashBoard;