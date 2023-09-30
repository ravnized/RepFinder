import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import "../css/Homepage.css";
import { Accordion, Col, Container, Row } from "react-bootstrap";
import { BsGithub } from "react-icons/bs";
function WelcomePage() {
	let tl = useRef() as React.MutableRefObject<GSAPTimeline>;
	let [translate, setTranslate] = React.useState(0);
	useLayoutEffect(() => {
		tl.current = gsap.timeline();
	});

	function resize() {
		let width = window.innerWidth;
		width = width / 100;
		setTranslate(width);
	}

	window.addEventListener("resize", resize);

	useLayoutEffect(() => {
		if (translate === 0) {
			resize();
		}
	});

	return (
		<>
			<h2 className="textHome">
				Welcome to RepFinder, <br></br>
				Where we scrape yupoo to find your item!
			</h2>
			<Container>
				<Row
					style={{
						alignItems: "center",
						alignContent: "center",
						padding: "2rem",
					}}
				>
					<h3>
						You can find the code here:{" "}
						<a href="https://github.com/ravnized/RepFinder">
							<BsGithub color="black" />
						</a>
					</h3>
				</Row>
				<Row style={{ alignItems: "center" }}>
					<Col>
						<h3>What can you do?</h3>
					</Col>
					<Col>
						<Accordion>
							<Accordion.Item eventKey="0">
								<Accordion.Header>Search</Accordion.Header>
								<Accordion.Body>
									- Search for an item in the search bar
									<br /> - Click on the item to go to the item page
									<br /> - You can filter the items by price and store
								</Accordion.Body>
							</Accordion.Item>
							<Accordion.Item eventKey="1">
								<Accordion.Header>Report</Accordion.Header>
								<Accordion.Body>
									- Report an item by clicking on the report button <br /> - You
									can report for blacklisted items, wrong price, wrong name
								</Accordion.Body>
							</Accordion.Item>
							<Accordion.Item eventKey="2">
								<Accordion.Header>
									Don't bother registering pls
								</Accordion.Header>
								<Accordion.Body>
									There is not much to do here, you can just search for items{" "}
									<br />
									There is not a feature that requires you to register
								</Accordion.Body>
							</Accordion.Item>
							<Accordion.Item eventKey="3">
								<Accordion.Header>Need another Store?</Accordion.Header>
								<Accordion.Body>
									If your favorite store is not in the list you can request it
									by sending and email to <br />
									<a href="mailto:ravndeveloper@gmail.com">Me</a>
								</Accordion.Body>
							</Accordion.Item>
						</Accordion>
					</Col>
				</Row>
			</Container>
			<div className="blob">
				<svg
					style={{ transform: `translate(0, -${translate}%)` }}
					xmlns="http://www.w3.org/2000/svg"
					viewBox="-16.236 -52.2935 34.02 48.53"
					preserveAspectRatio="xMidYMid"
				>
					<path
						fill="#0B1354"
						d="M 0 0 H -20 C -20 -6.667 -20 -20 -10 -20 C 0 -20 0 -30 10 -30 C 20 -30 20 -20 20 -20 V 0 H 0"
					></path>
				</svg>
			</div>
		</>
	);
}

export default WelcomePage;
