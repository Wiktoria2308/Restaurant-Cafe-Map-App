import { Row } from "react-bootstrap";
import RestaurantsListCard from "./RestaurantsListCard";

const RestaurantsList = ({ restaurants }) => {
	return (
		<>
			<Row className="overflow-scroll" style={{ height: "100vh" }}>
				{restaurants &&
					restaurants.map((restaurant, index) => (
						<RestaurantsListCard
							key={index}
							restaurant={restaurant}
						></RestaurantsListCard>
					))}
			</Row>
		</>
	);
};

export default RestaurantsList;
