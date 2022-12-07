import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
class ButtonsForm extends React.Component<
	{
		page: (page: number) => void;
	},
	{
		page: number;
	}
> {
	constructor(props: any) {
		super(props);
		this.state = {
			page: 0,
		};
	}

	render() {
		return (
			<div className="buttons-bot">
				<Row>
					<Col xs="auto">
						<Button
							variant="primary"
							onClick={(e) => {
								if (this.state.page > 0) {
									this.props.page(this.state.page - 1);
									this.setState({ page: this.state.page - 1 });
								}
							}}
						>
							Previous page
						</Button>
					</Col>
					<Col xs="auto">
						<Button
							variant="primary"
							onClick={(e) => {
								this.props.page(this.state.page + 1);
								this.setState({ page: this.state.page + 1 });
							}}
						>
							Next page
						</Button>
					</Col>
				</Row>
			</div>
		);
	}
}
export default ButtonsForm;
