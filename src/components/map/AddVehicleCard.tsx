import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import Title from "../muitemplate/Title";
import DeleteIcon from "@mui/icons-material/Delete";
import { saveVehicle } from "../../services/client.js";

let vehiclesCount = 1;

export default function AddVehicleCard({ location }) {
  const [vehicleSpeed, setVehicleSpeed] = useState(70);

  return (
    <Stack spacing={2}>
      <TextField
        id="outlined-basic"
        label="Average speed, km/h"
        variant="outlined"
        value={vehicleSpeed}
        onChange={(e) => {
          setVehicleSpeed(e.target.value);
        }}
      />
      <Button
        variant="outlined"
        onClick={() =>
          saveVehicle({
            id: vehiclesCount++,
            latitude: location.latitude,
            longitude: location.longitude,
            speed: vehicleSpeed,
          })
        }
      >
        Locate vehicle
      </Button>
    </Stack>
  );
}
