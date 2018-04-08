import React, { Component } from 'react';
import "./map.css"

import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';


export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.getMarkerList = this.getMarkerList.bind(this);

    window.googleHack = this.props.google;
  }

  getMarkerList(markers) {
    const listItems = markers.map((marker) =>
        <Marker
          key={marker.name.toString()}
          name={marker.name.toString()}
          position={{
            lat: marker.lat,
            lng: marker.lng
          }}
        />
    );

    return (
      listItems
    );
  }

  fetchPlaces(mapProps, map) {
    window.globalMap = map;
    window.directionsService = new window.googleHack.maps.DirectionsService;
    window.directionsDisplay = new window.googleHack.maps.DirectionsRenderer;
    window.directionsDisplay.setMap(map);
  }


  render() {
    const markers = this.getMarkerList(this.props.markers);

    return (
      <Map google={this.props.google}
                  initialCenter={{
                    lat: -23.5505200,
                    lng: -46.6333090
                  }}
                  onReady={this.fetchPlaces}
                  zoom={13}>

        {markers}

        <InfoWindow onClose={this.onInfoWindowClose}>
          <div>
            <h1>ssssdd</h1>
          </div>
        </InfoWindow>
      </Map>
    );
  }
}


export default GoogleApiWrapper({
  apiKey: "AIzaSyAaVZuqrJbAYSsLNqHoHPpz1TvJr83shHE"
})(MapContainer)
