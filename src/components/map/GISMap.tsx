import React, { useEffect, useState, useRef, forwardRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Slider from "@mui/material/Slider";
import MarkerClusterGroup from "react-leaflet-cluster";
import LocalShippingTwoToneIcon from "@mui/icons-material/LocalShippingTwoTone";
import UpdateVehicleCard from "./UpdateVehicleCard";
import RotatedMarker from "./RotatedMarker";
import { Icon } from "leaflet";
import {
  saveVehicle,
  updateVehicle,
  getVehicles,
  getLocations,
  deleteVehicle,
} from "../../services/client.js";
import SockJsClient from "react-stomp";
import L from "leaflet";
import "leaflet-rotatedmarker";
import "leaflet/dist/leaflet.css";
import "./GISMap.css";
import { Button } from "@mui/material";
import AddVehicleCard from "./AddVehicleCard";

const vehicleIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/870/870130.png",
  iconSize: [38, 38],
});
const locationIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
  iconSize: [38, 38],
});

const SOCKET_URL = "http://localhost:8080/ws-message";
let onConnected = () => {
  console.log("Connected!!");
};

export default function GISMap() {
  const [vehicles, setVehicles] = useState([]);
  const [locations, setLocations] = useState([]);

  const fetchLocations = () => {
    getLocations()
      .then((res) => {
        setLocations(res.data);
      })
      .catch((err) => {
        console.log("Error trying feth locations: ", JSON.stringify(err));
      })
      .finally(() => {});
  };

  const fetchVehicles = () => {
    getVehicles()
      .then((res) => {
        setVehicles(res.data);
      })
      .catch((err) => {
        console.log("Error trying feth vehicles", JSON.stringify(err));
      })
      .finally(() => {});
  };

  useEffect(() => {
    fetchLocations();
    fetchVehicles();
  }, []);

  const handleVehicleMessage = (newMessage) => {
    const index = vehicles.findIndex((vehicle) => vehicle.id === newMessage.id);

    if (index !== -1) {
      vehicles[index] = newMessage;
    } else {
      vehicles.push(newMessage);
    }
    setVehicles([...vehicles]);
  };

  let onMessageReceived = (msg) => {
    console.log(JSON.stringify(msg));
    handleVehicleMessage(msg);
  };

  return (
    <>
      <MapContainer center={[48.8566, 2.3522]} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* WATERCOLOR CUSTOM TILES */}
        {/* <TileLayer
        attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg"
      /> */}
        {/* GOOGLE MAPS TILES */}
        {/* <TileLayer
          attribution="Google Maps"
          // url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" // regular
          url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}" // satellite
          // url="http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}" // terrain
          maxZoom={20}
          subdomains={["mt0", "mt1", "mt2", "mt3"]}
        /> */}

        {locations.map((location, index) => (
          <Marker
            icon={locationIcon}
            position={[location.latitude, location.longitude]}
            key={index}
          >
            <Popup>
              <AddVehicleCard location={location} />
            </Popup>
          </Marker>
        ))}

        {vehicles.map((vehicle) => (
          <RotatedMarker
            position={vehicle.location}
            icon={vehicleIcon}
            rotationOrigin="center"
            rotationAngle={vehicle.heading * (180 / Math.PI)}
          >
            <Popup>
              <UpdateVehicleCard
                vehicleId={vehicle.id}
                onSpeedChange={handleSpeedChange}
                fetchVehicles={fetchVehicles}
              />
            </Popup>
          </RotatedMarker>
        ))}
      </MapContainer>

      <SockJsClient
        url={SOCKET_URL}
        topics={["/topic/message"]}
        onConnect={onConnected}
        onDisconnect={console.log("Disconnected!")}
        onMessage={(msg) => onMessageReceived(msg)}
        debug={false}
      />
    </>
  );
}
