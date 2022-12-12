import React from "react";
import ItemsDataServices from "../services/ItemsServices";
import CardGroup from "react-bootstrap/CardGroup";
import { Card } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import "../css/PopularityItems.css";
import gsap from "gsap";

class PopularityItem extends React.Component<
	{},
	{
		items: [];
		tl: GSAPTimeline;
	}
> {
	constructor(props: any) {
		super(props);
		this.state = {
			items: [],
			tl: gsap.timeline(),
		};
	}

	componentDidMount(): void {
		ItemsDataServices.getPopularity().then((res) => {
			this.setState({ items: res.items });
		});
	}

	render(): React.ReactNode {
		return (
			<Container>
				<h3>Favourite Items:</h3>
				<CardGroup>
					{this.state.items.length !== 0 ? (
						<div>
							<Row>
								{this.state.items.map((item: any, index: number) => (
									<Col sm={6} xl="auto" className="ColCard" key={index}>
										<Card
											className="cardElement"
											id={`cardEl${index}`}
											onLoad={(e) => {
												this.state.tl.to(
													`#cardEl${index}`,
													{ opacity: 1, y: 0, duration: 0.5 },
													`0.${index}`,
												);
											}}
										>
											<Card.Img
												className="cardImage"
												src={
													item.imageBuffer.slice(0, 4) === "data"
														? `${item.imageBuffer}`
														: `data:image/jpeg;base64,${item.imageBuffer}`
												}
											></Card.Img>
										</Card>
									</Col>
								))}
							</Row>
						</div>
					) : (
						""
					)}
				</CardGroup>
			</Container>
		);
	}
}
export default PopularityItem;
