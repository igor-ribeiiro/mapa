import React, { Component } from 'react';
import "./map.css"

import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

var originIcon = 'https://chart.googleapis.com/chart?' +
            'chst=d_map_spin&chld=0.45|0|16A085|13|_|O';

var originSelectedIcon = 'https://chart.googleapis.com/chart?' +
            'chst=d_map_pin_letter&chld=O|FFFF42|000000';

let x;

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.getMarkerList = this.getMarkerList.bind(this);

    this.showingInfoWindow = false;
    this.position = {lat: -23.5505200, lng: -46.6333090};
    this.html = <div>This should not appear</div>;

    x = this;
    window.googleHack = this.props.google;
    window.directionsServices = [null, null, null, null];
    window.directionsDisplays = [null, null, null, null];
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

  getPlacesList(places) {
    let listItems = null;
    if (places !== undefined)
    {
        listItems = places.map((place, key) =>
        {
          if(key < 3) {
            if (key === this.props.activePlace)
            {

              this.showingInfoWindow = true;
              this.position = {lat: place.lat, lng: place.lng};
              this.html = <h3>{place.name}</h3>;

              this.html = (
                <div className="media-map">
                  <img className="d-flex align-self-start" src={x.props.cafes[place.index]} alt="Gatinho!"/>
                </div>
              );

              return(
                <Marker
                  key = {place.name.toString()}
                  position ={{
                    lat: place.lat,
                    lng: place.lng
                  }}
                  icon = {originSelectedIcon}
                />
              )
            }
            else
            {
              return(
                <Marker
                  key = {place.name.toString()}
                  position ={{
                    lat: place.lat,
                    lng: place.lng
                  }}
                  icon = {originIcon}
                  onClick = {() => {this.props.changeActive(key);}}
                />
              )
            }
          }
      })
    }

    return listItems;
  }

  fetchPlaces(mapProps, map) {
    window.globalMap = map;
  }

  Draw(origin, destination, directionsDisplay, directionsService){
    directionsDisplay.setOptions({suppressMarkers: true});
    directionsDisplay.setMap(window.globalMap);
    directionsService.route({
      origin: origin,
      destination: destination,
      travelMode: 'DRIVING'
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        console.log('Directions request failed due to ' + status);
      }
    });
  }

  DrawAll(markers, places){
    if(places != undefined){
      for(var i in markers){
        if(window.directionsDisplays[i] == null) {
          var rendererOptions = { preserveViewport: true };
          window.directionsDisplays[i] = new window.googleHack.maps.DirectionsRenderer(rendererOptions);
        }
        if(window.directionsServices[i] == null)
          window.directionsServices[i] = new window.googleHack.maps.DirectionsService;
        this.Draw(markers[i], places[this.props.activePlace], window.directionsDisplays[i], window.directionsServices[i]);
      }
    }
  }

  render() {
    const markers = this.getMarkerList(this.props.markers);
    const places = this.getPlacesList(this.props.places);
    this.DrawAll(this.props.markers, this.props.places);
    return (
      <Map google={this.props.google}
                  initialCenter={{
                    lat: -23.5505200,
                    lng: -46.6333090
                  }}
                  onReady={this.fetchPlaces}
                  zoom={13}>
        {markers}
        {places}
      </Map>
    );
  }
}


export default GoogleApiWrapper({
  apiKey: "AIzaSyAaVZuqrJbAYSsLNqHoHPpz1TvJr83shHE"
})(MapContainer)
