import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Chart from "./muitemplate/Chart";
import Deposits from "./muitemplate/Deposits";
import Orders from "./muitemplate/Orders";
import SockJsClient from "react-stomp";
import Gauges from "./dashboard/Gauges";
import Title from "./muitemplate/Title";
import FuelConsumptionChart from "./dashboard/FuelConsumptionChart";
import FuelEffeciencyChart from "./dashboard/FuelEffeciencyChart";
import OdometerChart from "./dashboard/OdometerChart";

export default function Dashboard() {
  const [telemetry, setTelemetry] = useState({
    speed: 0,
    odometer: 0.1,
    fuelGauge: 0.03,
  });

  const SOCKET_URL = "http://localhost:8080/ws-message";
  let onConnected = () => {
    console.log("Connected!!");
  };
  const handleTelemetryMessage = (newMessage) => {
    setTelemetry(newMessage);
  };

  let onMessageReceived = (msg) => {
    console.log(JSON.stringify(msg));
    handleTelemetryMessage(msg);
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8} lg={9}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
            }}
          >
            <OdometerChart value={telemetry.odometer} />
          </Paper>
        </Grid>
        {/* Recent Deposits */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
            }}
          >
            <Gauges value={telemetry.speed} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper
            sx={{ p: 2, display: "flex", flexDirection: "column", height: 240 }}
          >
            <FuelConsumptionChart value={telemetry.fuelGauge} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
            }}
          >
            <Title>Fuel per 100km</Title>
            <h3>{telemetry.fuelGauge * (100 / telemetry.odometer)} L/100KM</h3>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8} lg={9}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
            }}
          >
            <FuelEffeciencyChart
              value={telemetry.fuelGauge * (100 / telemetry.odometer)}
            />
          </Paper>
        </Grid>
        {/* Recent Orders */}
        {/* <Grid item xs={12}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <Orders />
          </Paper>
        </Grid> */}
      </Grid>

      <SockJsClient
        url={SOCKET_URL}
        topics={["/topic/telemetry"]}
        onConnect={onConnected}
        onDisconnect={console.log("Disconnected!")}
        onMessage={(msg) => onMessageReceived(msg)}
        debug={false}
      />
    </>
  );
}
