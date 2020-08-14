import React, { useState, useEffect } from "react";
import {
  FormControl,
  MenuItem,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";

import "./App.css";
import "leaflet/dist/leaflet.css";
import InfoBox from "./components/infobox/InfoBox";
import Map from "./components/map/Map";
import Table from "./components/table/Table";

import _ from "lodash";
import LineGraph from "./components/graph/LineGraph";

const COVID_ALL_ENDPOINT = "https://disease.sh/v3/covid-19/all";
const COVID_ENDPOINT = "https://disease.sh/v3/covid-19/countries";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    lat: 34.80746,
    lng: -40.4796,
  }); // center of world
  const [mapZoom, setMapZoom] = useState(3);
  const [caseType, setCaseType] = useState("cases");

  useEffect(() => {
    getAllCountryInfo();
  }, []);

  useEffect(() => {
    fetchCountries();
  }, []);

  const sortData = (data) => _.orderBy(data, ["cases"], ["desc"]);

  const getAllCountryInfo = async () => {
    const response = await fetch(COVID_ALL_ENDPOINT);
    const data = await response.json();
    setCountryInfo(data);
  };

  const fetchCountries = async () => {
    const response = await fetch(COVID_ENDPOINT);
    const data = await response.json();

    const parsedCountries = data.map((item) => ({
      name: item.country,
      value: item.countryInfo.iso2,
    }));

    setCountries(parsedCountries);

    setMapCountries(data);

    const sortedCountries = sortData(data);
    setTableData(sortedCountries);
  };

  const onCountryChange = async (e) => {
    const selectedCountry = e.target.value;

    const url =
      selectedCountry === "worldwide"
        ? COVID_ALL_ENDPOINT
        : `${COVID_ENDPOINT}/${selectedCountry}`;

    const response = await fetch(url);
    const data = await response.json();

    setCountry(selectedCountry);

    setCountryInfo(data);
    setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
    setMapZoom(4);
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>

          <FormControl className="app__dropDown">
            <Select
              variant={"outlined"}
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem key={"worldwide"} value={"worldwide"}>
                Worldwide
              </MenuItem>

              {countries.map((item) => (
                <MenuItem key={item.name} value={item.value}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            isRed
            active={caseType === "cases"}
            onClick={(e) => setCaseType("cases")}
            numCases={countryInfo.todayCases}
            total={countryInfo.cases}
            title={"Corona Virus Cases"}
          />

          <InfoBox
            active={caseType === "recovered"}
            onClick={(e) => setCaseType("recovered")}
            numCases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
            title={"Recoveries"}
          />

          <InfoBox
            isRed
            active={caseType === "deaths"}
            onClick={(e) => setCaseType("deaths")}
            numCases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
            title={"Deaths"}
          />
        </div>

        <Map
          caseType={caseType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData}></Table>

          <h3 className="app__right_graphTitle">Worldwide new {caseType}</h3>

          <LineGraph caseType={caseType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
