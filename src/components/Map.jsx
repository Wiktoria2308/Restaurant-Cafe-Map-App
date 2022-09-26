import React, { useState, useEffect } from 'react'
import { GoogleMap, useJsApiLoader, Marker, StandaloneSearchBox } from '@react-google-maps/api';
import usePosition from '../hooks/usePosition'
import MarkerIcon from '../assets/icons/marker.png'
import LoadingSpinner from '../components/LoadingSpinner'
import { collection, orderBy, query } from 'firebase/firestore'
import { useFirestoreQueryData } from '@react-query-firebase/firestore'
import { db } from '../firebase'
import Markers from './Markers';

const Map = () => {
  const [currentPosition, setCurrentPosition] = useState();
  const [currentZoom, setCurrentZoom] = useState(12);
  const position = usePosition();
  const [libraries] = useState(['places']);
  const [searchBox, setSearchBox] = useState(null);
  const [myPosition, setMyPosition] = useState();
  const [isMyLocation, setIsMyLocation] = useState(false);

	const queryRef = query(
		collection(db, 'restaurants'),
		orderBy('geolocation')
	)
	const { data: restaurants } = useFirestoreQueryData(['restaurants'], queryRef, {
		idField: 'id',
		subscribe: true,
	})

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const containerStyle = {
    width: '100%',
    height: '500px'
  };

  const inputStyle = {
    boxSizing: `border-box`,
    border: `1px solid transparent`,
    width: `240px`,
    height: `32px`,
    padding: `0 12px`,
    borderRadius: `3px`,
    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
    fontSize: `14px`,
    outline: `none`,
    textOverflow: `ellipses`,
    position: 'absolute',
    top: '10px',
    right: '55px',
  }
  const onSearchLoad = ref => setSearchBox(ref);

  const onPlacesChanged = () => {
    setIsMyLocation(false)
    const places = searchBox.getPlaces();
    places.forEach(place => {
      setCurrentPosition(place.geometry.location)
      setCurrentZoom(12)
    })
  }


  const locationButton = document.createElement("button");
  locationButton.textContent = "Go to Your Location";
  locationButton.classList.add("custom-map-control-button");

  const handleMapOnLoad = map => {
    map.controls[google.maps.ControlPosition.BOTTOM].push(locationButton);
  }

  locationButton.addEventListener("click", () => {
    if(position.error){
      setIsMyLocation(false)
      console.log(position.error)
    }
    else {
      setIsMyLocation(true)
    }
     
  });

  useEffect(() => {
    if(isMyLocation && position.latitude){
      setMyPosition({ lat: position.latitude, lng: position.longitude });
      setCurrentPosition({ lat: position.latitude, lng: position.longitude })
      setCurrentZoom(14)
    }
  }, [isMyLocation])


  return (
    <>
      {!isLoaded && <LoadingSpinner />}
      {isLoaded && <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentPosition ? currentPosition : {lat: 55.606,lng: 13.021}}
        zoom={currentZoom}
        onLoad={map => handleMapOnLoad(map)}
      >
        {isMyLocation && <Marker position={myPosition} icon={MarkerIcon} />}
        {restaurants && <Markers restaurants={restaurants}/>}

        { /* Child components, such as markers, info windows, etc. */}
        <StandaloneSearchBox onLoad={onSearchLoad} onPlacesChanged={onPlacesChanged}>
          <input
            type='text'
            placeholder='Search location'
            style={inputStyle}
          />
        </StandaloneSearchBox>
      </GoogleMap>}
    </>
  )
}

export default Map
