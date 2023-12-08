import React, { useState } from "react";
import { Col, Row } from "antd";
import PlacesAutocomplete from "../../../components/maps/PlacesAutocomplete"
import { useJsApiLoader, GoogleMap, Marker, MarkerF } from '@react-google-maps/api'

const Home = () => {
  const { isLoaded } = useJsApiLoader({
    id: process.env.REACT_APP_MAP_ID,
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_KEY,
    libraries: ['places']
  })

  console.log(isLoaded)
  const [position, setPosition] = useState({ lat: 21.0469701, lng: 105.8021347 });
  const containerStyle = {
    height: "50vh", width: "100%"
  };



  return (
    <Col span={24} style={{ paddingTop: 20, paddingLeft: 40 }}>
      {isLoaded ? <Row>
        <Col span={6}>
          <Row>
            <PlacesAutocomplete setPosition={setPosition} />
          </Row>
        </Col>
        <Col span={18}>
          <Row style={{justifyContent: 'end'}}>
            <GoogleMap
              center={position}
              mapContainerStyle={containerStyle}
              zoom={15}
            >
              {position && <MarkerF position={position} />}
            </GoogleMap>
          </Row>
        </Col>
      </Row> : <Row>...Loading</Row>}

    </Col>
  );
};

export default Home;
