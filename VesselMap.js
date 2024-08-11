// src/VesselMap.js
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";

const VesselMap = () => {
  const startCoords = [22.1696, 91.4996];
  const endCoords = [22.2637, 91.7159];
  const speed = 20; // km/h
  const refreshRate = 500; // 2 FPS (500 ms interval)

  const [position, setPosition] = useState(startCoords);
  const [distanceTraveled, setDistanceTraveled] = useState(0);

  const totalDistance = useRef(L.latLng(startCoords).distanceTo(L.latLng(endCoords)));

  useEffect(() => {
    const interval = setInterval(() => {
      moveVessel();
    }, refreshRate);

    return () => clearInterval(interval);
  }, [position]);

  const moveVessel = () => {
    const distancePerStep = (speed * 1000) / (60 * 60 * (1000 / refreshRate));
    let nextDistance = distanceTraveled + distancePerStep;

    if (nextDistance >= totalDistance.current) {
      setPosition(endCoords);
      clearInterval(interval);
    } else {
      const newLat = position[0] + ((endCoords[0] - startCoords[0]) / totalDistance.current) * nextDistance;
      const newLng = position[1] + ((endCoords[1] - startCoords[1]) / totalDistance.current) * nextDistance;
      setPosition([newLat, newLng]);
      setDistanceTraveled(nextDistance);
    }
  };

  return (
    <MapContainer center={startCoords} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position} />
      <Polyline positions={[startCoords, endCoords]} color="blue" />
    </MapContainer>
  );
};

export default VesselMap;
