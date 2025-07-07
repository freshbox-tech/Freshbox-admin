// components/ServiceAreaMap.js
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: '/Images/marker-icon-2x.png',
});

const LocationMarker = ({ position, onClick }) => {
  const map = useMapEvents({
    click(e) {
      onClick(e);
    },
  });

  return position ? (
    <Marker position={position}>
      <Popup>Selected Location</Popup>
    </Marker>
  ) : null;
};

const ServiceAreaMarkers = ({ markers, onMarkerClick }) => {
  return (
    <>
      {markers.map((marker) => (
        <Marker 
          key={marker.id} 
          position={marker.position}
          eventHandlers={{
            click: () => onMarkerClick(marker),
          }}
        >
          <Popup>
            <div>
              <strong>{marker.name}</strong>
              <div>ZIP: {marker.zipCode}</div>
              <div>{marker.city}, {marker.state}</div>
              <div>Status: {marker.isActive ? 'Active' : 'Inactive'}</div>
              <div>Coverage: {marker.coverage}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

const ServiceAreaMap = ({ 
  markers = [], 
  center = [51.505, -0.09], 
  zoom = 13, 
  onClick = () => {}, 
  onMarkerClick = () => {},
  selectedPosition = null,
  interactive = true
}) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
      doubleClickZoom={false}
      zoomControl={true}
      dragging={interactive}
      touchZoom={interactive}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ServiceAreaMarkers markers={markers} onMarkerClick={onMarkerClick} />
      {selectedPosition && (
        <LocationMarker position={selectedPosition} onClick={onClick} />
      )}
    </MapContainer>
  );
};

export default ServiceAreaMap;