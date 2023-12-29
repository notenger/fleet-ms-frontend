import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import { Button } from "@mui/material";
import Title from "../muitemplate/Title";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  saveVehicle,
  updateVehicle,
  getVehicles,
  getLocations,
  deleteVehicle,
} from "../../services/client.js";

export default function UpdateVehicleCard({ vehicleId, fetchVehicles }) {
  const [vehicleSpeed, setVehicleSpeed] = useState(70);

  return (
    <Stack spacing={2}>
      <Title>{"ID " + vehicleId}</Title>
      <Title>{vehicleSpeed + " km/h"}</Title>
      <Slider
        aria-label="Volume"
        value={vehicleSpeed}
        min={70}
        max={300}
        onChange={(vehicleId, newValue: number | number[]) => {
          setVehicleSpeed(newValue);
          updateVehicle(vehicleId, { speed: newValue })
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            })
            .finally(() => {});
        }}
      />

      <Button
        variant="outlined"
        startIcon={<DeleteIcon />}
        onClick={() => {
          deleteVehicle(id)
            .then((res) => {
              console.log(res);
              fetchVehicles();
            })
            .catch((err) => {
              console.log(err);
            })
            .finally(() => {});
        }}
      >
        Delete
      </Button>
    </Stack>
  );
}
