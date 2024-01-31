import axios from "axios";

export const getLocations = async () => {
  try {
    return await axios.get(`http://localhost:8080/api/v1/locations/get`);
  } catch (e) {
    throw e;
  }
};

export const getVehicles = async () => {
  try {
    return await axios.get(
      `http://basic-spring-api-env-1.eba-m8penzcg.eu-central-1.elasticbeanstalk.com/api/v1/vehicles/get`
    );
  } catch (e) {
    throw e;
  }
};

export const saveVehicle = async (vehicle) => {
  try {
    return await axios.post(
      `http://localhost:8082/api/v1/vehicles/add`,
      vehicle
    );
  } catch (e) {
    throw e;
  }
};

export const updateVehicle = async (id, update) => {
  try {
    return await axios.put(
      `http://localhost:8082/api/v1/vehicles/${id}`,
      update
    );
  } catch (e) {
    throw e;
  }
};

export const deleteVehicle = async (id) => {
  try {
    return await axios.delete(`http://localhost:8082/api/v1/vehicles/${id}`);
  } catch (e) {
    throw e;
  }
};
