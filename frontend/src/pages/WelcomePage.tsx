import React from "react";
import PopularityItem from "../components/PopularityItems";
import "../css/Homepage.css";
class WelcomePage extends React.Component<{}, {}> {
	render(): React.ReactNode {
		return (
			<div>
				<p className="textHome">
					Welcome to RepFinder, where we scout yupoo
					<br />
					to find your item!
				</p>

				
			</div>
		);
	}
}
export default WelcomePage;
