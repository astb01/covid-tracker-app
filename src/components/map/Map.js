import React from "react";
import { Map as LeafletMap, TileLayer, Circle, Popup } from "react-leaflet";
import numeral from "numeral";

import "./Map.css";

const caseTypeColors = {
  cases: {
    hex: "#CC1034",
    multiplier: 800,
  },
  recovered: {
    hex: "#7dd71d",
    multiplier: 1200,
  },
  deaths: {
    hex: "#fb4443",
    multiplier: 2000,
  },
};

const Map = ({ countries, caseType, center, zoom }) => {
  const showDataOnMap = (data, caseType = "cases") =>
    data.map((country) => (
      <Circle
        center={[country.countryInfo.lat, country.countryInfo.long]}
        fillOpacity={0.4}
        color={caseTypeColors[caseType].hex}
        fillColor={caseTypeColors[caseType].hex}
        radius={
          Math.sqrt(country[caseType]) * caseTypeColors[caseType].multiplier
        }
      >
        <Popup>
          <div className="country-container">
            <div
              className="country-container__flag"
              style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
            ></div>
            <div className="country-container__name">{country.country}</div>
            <div className="country-container__confirmed">
              Cases: {numeral(country.cases).format("0,0")}
            </div>
            <div className="country-container__recovered">
              Recovered: {numeral(country.recovered).format("0,0")}
            </div>
            <div className="country-container__deaths">
              Deaths: {numeral(country.deaths).format("0,0")}
            </div>
          </div>
        </Popup>
      </Circle>
    ));

  return (
    <div className="map">
      <LeafletMap center={center} zoom={zoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {showDataOnMap(countries, caseType)}
      </LeafletMap>
    </div>
  );
};

export default Map;
