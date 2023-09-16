import { ReactNode } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import React from "react";
import gsap from "gsap";
import { FaBeer } from "react-icons/fa";
import "../css/ItemCard.css";
class ItemsCard extends React.Component<
	{
		responseValue: [];
	},
	{
		tl: GSAPTimeline;
		items: [];
	}
> {
	constructor(props: any) {
		super(props);
		this.state = {
			tl: gsap.timeline(),
			items: [],
		};
	}

	componentDidUpdate(prevProps: any): void {
		if (this.props.responseValue !== prevProps.responseValue) {
			this.setState({ items: this.props.responseValue });
		}
	}

	render(): ReactNode {
		return (
			<div className="allItems">
				{this.state.items !== undefined && this.state.items.length !== 0 ? (
					<Container>
						<Row lg={3} xs={1} md={2}>
							{this.state.items.map((item: any, index: number) => (
								<div
									className="cardElement"
									key={index}
									id={`cardEl${index}`}
									onLoad={(e: any) => {
										this.state.tl.to(
											`#cardEl${index}`,
											{ opacity: 1, y: 0, duration: 0.5 },
											`0.${index}`,
										);
									}}
								>
									<Col className="column">
										<Card>
											<Button
												onClick={() => {
													console.log(item._id);
												}}
												className="deleteButton"
												variant="danger"
											>
												{" "}
												<FaBeer />
											</Button>
											<Card.Img
												variant="top"
												src={
													item.image.slice(0, 4) === "data"
														? `${item.image}`
														: `data:image/jpeg;base64,${item.image}`
												}
											></Card.Img>
											<Card.Body>
												<Card.Title>{item.itemName}</Card.Title>
											</Card.Body>
											<ListGroup className="list-group-flush">
												<ListGroup.Item>Costo: {item.cost} Yuan</ListGroup.Item>
												<ListGroup.Item>
													Store name: {item.storeName}
												</ListGroup.Item>
											</ListGroup>
											<Card.Body>
												<a href={item.link} target="_blank" rel="noreferrer">
													<Button variant="primary">Go to the item</Button>
												</a>
											</Card.Body>
										</Card>
									</Col>
								</div>
							))}
						</Row>
					</Container>
				) : (
					<Container>
						<p>Search something</p>
					</Container>
				)}
			</div>
		);
	}
}
export default ItemsCard;
