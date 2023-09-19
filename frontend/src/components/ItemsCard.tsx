import { ReactNode } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import React from "react";
import gsap from "gsap";
import { BsExclamationLg } from "react-icons/bs";
import Offcanvas from "react-bootstrap/Offcanvas";
import "../css/ItemCard.css";
import ReportServices from "../services/ReportServices";
class ItemsCard extends React.Component<
	{
		responseValue: [];
	},
	{
		tl: GSAPTimeline;
		items: [];
		handle: boolean;
		idItem: string;
		itemName: string;
		itemCost: number;
		needToBeDeleted: boolean;
		_id: string;
	}
> {
	constructor(props: any) {
		super(props);
		this.state = {
			tl: gsap.timeline(),
			items: [],
			handle: false,
			idItem: "",
			itemName: "",
			itemCost: 0,
			needToBeDeleted: false,
			_id: "",
		};
	}

	componentDidUpdate(prevProps: any): void {
		if (this.props.responseValue !== prevProps.responseValue) {
			this.setState({ items: this.props.responseValue });
		}
	}

	render(): ReactNode {
		return (
			<>
				<Offcanvas
					show={this.state.handle}
					onHide={() => {
						this.setState({ handle: false });
					}}
				>
					<Offcanvas.Header closeButton>
						<Offcanvas.Title>Report</Offcanvas.Title>
					</Offcanvas.Header>
					<Offcanvas.Body>
						<input
							type="hidden"
							id="itemId"
							value={this.state.idItem}
							onChange={(e: any) => this.setState({ idItem: e.target.value })}
						/>
						<Row>
							<Col>
								<label>Item Name</label>
							</Col>
							<Col>
								<input
									id="itemName"
									value={this.state.itemName}
									onChange={(e: any) =>
										this.setState({ itemName: e.target.value })
									}
								/>
							</Col>
						</Row>
						<Row>
							<Col>
								<label>Cost</label>
							</Col>
							<Col>
								<input
									id="itemCost"
									value={this.state.itemCost}
									onChange={(e: any) =>
										this.setState({ itemCost: e.target.value })
									}
								/>
							</Col>
						</Row>
						<Row>
							<Col>
								<label>Delete?</label>
							</Col>
							<Col>
								<input
									id="needToBeDeleted"
									type="checkbox"
									onChange={(e: any) => {
										if (e.target.value === "on")
											this.setState({ needToBeDeleted: true });
										else this.setState({ needToBeDeleted: false });
									}}
								/>
							</Col>
						</Row>
						<Button
							onClick={() => {
								ReportServices.reportItem(
									this.state._id,
									this.state.idItem,
									this.state.itemCost,
									this.state.itemName,
									this.state.needToBeDeleted,
								);
								this.setState({ handle: false });
							}}
						>
							Invia{" "}
						</Button>
					</Offcanvas.Body>
				</Offcanvas>
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
												<BsExclamationLg
													className="reportIcon"
													onClick={() => {
														console.log(item);
														this.setState({
															_id: item._id,
															idItem: item.idItem,
															itemName: item.itemName,
															itemCost: item.cost,
															handle: true,
														});
													}}
												/>

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
													<ListGroup.Item>
														Costo: {item.cost} Yuan
													</ListGroup.Item>
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
			</>
		);
	}
}
export default ItemsCard;
