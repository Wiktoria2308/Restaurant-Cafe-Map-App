import React from "react";
import Map from "../components/Map";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import useRestaurant from '../hooks/useRestaurant'
import { useParams } from 'react-router-dom'



const RestaurantPage = () => {

	const { id } = useParams()
	const { data: restaurant, loading } = useRestaurant(id)
	
	return (
		<Container className="py-3 center-y">
			<Row>
				<Col md={{ span: 6, offset: 3 }}>
					<Card>
						<Card.Body>
							<Card.Title>{restaurant.name}</Card.Title>
							<Card.Title>{restaurant.adress}</Card.Title>
							<Card.Title>{restaurant.tel}</Card.Title>
							<Card.Text>{restaurant.description}</Card.Text>
							
						</Card.Body>
					</Card>
					<Map />
				</Col>
			</Row>
			<Row>
				<Col md={{ span: 6, offset: 3 }}></Col>
			</Row>
		</Container>
	);
};

export default RestaurantPage;
