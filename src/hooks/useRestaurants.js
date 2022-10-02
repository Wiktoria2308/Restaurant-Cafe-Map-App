import { useFirestoreQueryData } from '@react-query-firebase/firestore'
import { collection, query } from 'firebase/firestore'
import { db } from '../firebase'
import { useSearchParams } from 'react-router-dom'
import usePosition from './usePosition'
import { useEffect } from 'react'
import getDistance from 'geolib/es/getPreciseDistance'

const useRestaurants = () => {

	const [searchParams, setSearchParams] = useSearchParams()
	const position = usePosition()

	let params = {
		cuisine: searchParams.get('cuisine'),
		type: searchParams.get('type'),
		sort: searchParams.get('sort')
	}

	let queryRef = query(collection(db, 'restaurants'))

	const restaurantQuery = useFirestoreQueryData(['restaurants'], queryRef, {
		idField: 'id',
		subscribe: true,
	})

	let restaurantsData

	if (restaurantQuery.data) {

		if (position.latitude) {

			restaurantQuery.data.forEach(data => {
				let distance = getDistance(
					{ latitude: data.geolocation.lat, longitude: data.geolocation.lat },
					{ latitude: position.latitude, longitude: position.latitude }
				)
				data.distance = distance
			})
		} else {
			restaurantQuery.data.forEach(data => { data.distance = '' })
		}

		if (params.cuisine || params.type || params.sort) {

			let restaurants = restaurantQuery.data

			if (params.cuisine) {
				restaurants = restaurants.filter(rest => {
					return rest.cuisine === params.cuisine
				})
			}

			if (params.type) {
				restaurants = restaurants.filter(rest => {
					return rest.type === params.type
				})
			}

			if (params.sort) {
				if (params.sort === 'asc') {
					restaurants.sort((a, b) => a.name.localeCompare(b.name))
				}
				if (params.sort === 'dec') {
					restaurants.sort((a, b) => b.name.localeCompare(a.name))
				}
			}

			restaurantsData = restaurants
		} else {
			restaurantsData = restaurantQuery.data
		}
	}

	return restaurantsData
}

export default useRestaurants
