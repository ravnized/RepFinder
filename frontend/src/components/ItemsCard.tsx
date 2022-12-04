import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import ItemsDataServices from "../services/ItemsServices";
let ItemsCard = (responseValue: any) => {
	let [items, setItems] = useState([]);
	useEffect(() => {
		setItems(responseValue.responseValue);
	}, [items, responseValue]);

	return (
		<div className="allItems">
			{items[0] ? (
				<Container>
					<Row lg={3} xs={1} md={2}>
						{items.map((item: any, index: number) => (
							<div className="CardElement" key={index} id={`card${index}`}>
								<Col className="column">
									<Card>
										<Card.Img
											variant="top"
											src={
												item.imageBuffer.slice(0, 4) == "data"
													? `${item.imageBuffer}`
													: `data:image/jpeg;base64,${item.imageBuffer}`
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
};
export default ItemsCard;
