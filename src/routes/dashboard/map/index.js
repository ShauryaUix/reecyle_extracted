import React, { useEffect, useRef } from "react";
import styled, { useTheme } from "styled-components";

import {
  MarkerClusterer,
  DefaultRenderer as MarkerClusterRendererDefault,
} from "@googlemaps/markerclusterer";

import Admin from "hive-admin";
import PageArchiveTable from "hive-admin/src/components/PageArchiveTable";

import getFilterWithCol from "../../../helpers/getFilterWithCol";

import cageSrc from "../../../common/assets/icons/cage-inactive@3x.png";
// eslint-disable-next-line max-len
import customerRegularSrc from "../../../common/assets/icons/customer-regular@3x.png";
// eslint-disable-next-line max-len
import customerPremiumSrc from "../../../common/assets/icons/customer-premium@3x.png";
// eslint-disable-next-line max-len
import customerClusterSrc from "../../../common/assets/icons/cluster@3x.png";

const MARKER_ICON = {
  scaledSize: new global.google.maps.Size(100 / 2, 110 / 2),
  anchor: new global.google.maps.Point(50 / 2, 90 / 2),
  origin: new global.google.maps.Point(0, 0),
  rotation: 0,
};

class MarkerClusterRenderer extends MarkerClusterRendererDefault {
  render({ count, position }) {
    const size = 130;
    return new global.google.maps.Marker({
      icon: {
        scaledSize: new global.google.maps.Size(size / 2, size / 2),
        anchor: new global.google.maps.Point(size / 4, size / 4),
        origin: new global.google.maps.Point(0, 0),
        labelOrigin: new global.google.maps.Point(size / 4, size / 4 - 2),
        rotation: 0,
        url: customerClusterSrc,
      },
      title: `${count} ${count === 1 ? "Customer" : "Customers"}`,
      label: {
        text: `${count}`,
        color: "#fff",
        fontWeight: "100",
      },
      position,
    });
  }
}

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  border-radius: ${({ theme }) => theme.less.borderRadius};
`;

function Map({ location, zoom, history, data }) {
  const theme = useTheme();
  const wrapperRef = useRef();
  const mapRef = useRef();
  const geometryRef = useRef([]);
  const customersClusterRef = useRef(null);
  const historyRef = useRef(history);
  historyRef.current = history;
  useEffect(
    () => {
      if (!mapRef.current) {
        mapRef.current = new global.google.maps.Map(wrapperRef.current, {
          zoom,
          center: { ...location },
          disableDefaultUI: true,
          zoomControl: true,
          scaleControl: true,
          gestureHandling: "greedy",
          clickableIcons: false,
          mapId: "f7b88d1b7848c940",
        });
        customersClusterRef.current = new MarkerClusterer({
          map: mapRef.current,
          markers: [],
          renderer: new MarkerClusterRenderer({}),
        });
      }
      if (mapRef.current) {
        mapRef.current.panTo({ ...location });
        mapRef.current.setZoom(zoom);
        mapRef.current.panBy(0, 150);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location, zoom],
  );
  useEffect(
    () => {
      if (data) {
        geometryRef.current.forEach(({ item }) => item.setMap(null));
        geometryRef.current = [];
        const bounds = new global.google.maps.LatLngBounds();
        data.areas.forEach((area) => {
          const coords = area.polygon.coordinates[0].slice(0, -1);
          coords.forEach(([lng, lat]) => bounds.extend({ lng, lat }));
          const polygon = new global.google.maps.Polygon({
            paths: coords.map(([lng, lat]) => ({ lng, lat })),
            map: mapRef.current,
            fillColor: area.serviced ? theme.less.primaryColor : "#aaa",
            fillOpacity: area.serviced ? 0.3 : 0.3,
            strokeWidth: 0,
            strokeWeight: 0,
            strokeOpacity: 0,
          });
          polygon.addListener("click", () =>
            historyRef.current.push(`/areas/${area._id}`),
          );
          geometryRef.current.push({ item: polygon, data: area });
        });
        data.cages.forEach((cage) => {
          const position = {
            lng: cage.address.coordinates[0],
            lat: cage.address.coordinates[1],
          };
          bounds.extend(position);
          const marker = new global.google.maps.Marker({
            icon: { ...MARKER_ICON, url: cageSrc },
            position,
            title: `${cage.organization.name} - ${cage.name}`,
            map: mapRef.current,
          });
          geometryRef.current.push({ item: marker, data: cage });
          return marker;
        });
        const customersMarkers = data.customers.map((customer) => {
          const position = {
            lng: customer.address.coordinates[0],
            lat: customer.address.coordinates[1],
          };
          bounds.extend(position);
          const marker = new global.google.maps.Marker({
            icon: {
              ...MARKER_ICON,
              url:
                customer.tier === "REGULAR" || customer.tier === "PRO"
                  ? customerRegularSrc
                  : customer.tier === "PREMIUM"
                    ? customerPremiumSrc
                    : null,
            },
            title: customer.name,
            position,
            map: mapRef.current,
          });
          geometryRef.current.push({ item: marker, data: customer });
          return marker;
        });
        customersClusterRef.current.clearMarkers();
        customersClusterRef.current.addMarkers(customersMarkers);
        if (geometryRef.current.length) {
          mapRef.current.fitBounds(bounds, 20);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data],
  );
  return <Wrapper ref={wrapperRef} />;
}

Map.defaultProps = {
  zoom: 15,
  location: {
    lng: 55.19885206855022,
    lat: 25.113897110259508,
  },
};

class PageMap extends PageArchiveTable {
  renderArchiveContentRows() {
    return (
      <Map
        data={this.props.data ? this.props.data.data : null}
        history={this.props.history}
        // pageProps={props}
      />
    );
  }
}

export default Admin.compileFromLibrary([
  (config) => PageMap.create(config),
  {
    // icon: 'environment',
    title: "Map",
    path: "/map",
    exact: true,
    hidden: false,
    activity: "edit",
    redirect: [["redirect.unauthorized"]],
    // loadExtractData: PageDashboard.config.loadExtractData,
    loadUrl: "/map",
    createButtonSupported: false,
    filters: [
      ...[
        [
          [
            "FilterField",
            {
              id: "search",
              label: null,
              section: "top",
              buildQuery: (value, builder) =>
                value &&
                builder.add("where", { name: { REGEX: value, OPTIONS: "i" } }),
              getValueForField: (value) => value || "",
              getValueForQuery: (value) => {
                value = !value
                  ? undefined
                  : value.target
                    ? value.target.value
                    : value;
                return !value || !value.length ? undefined : value;
              },
              field: [
                "FieldText",
                {
                  name: "search",
                  placeholder: "Search",
                },
              ],
            },
          ],
          12,
        ],
        [
          [
            "FilterField",
            {
              id: "tier",
              label: null,
              section: "top",
              VALUES_MAP: {
                regular: "REGULAR",
                pro: "PRO",
                premium: "PREMIUM",
              },
              buildQuery: (value, builder, filter) =>
                filter.VALUES_MAP[value]
                  ? builder.add("custom", { tier: filter.VALUES_MAP[value] })
                  : null,
              getValueForField: (value) =>
                value && value.length ? value : "any",
              field: [
                "FieldSelect",
                {
                  name: "status",
                  placeholder: "Status",
                  prepareValueForInput: (value) => (value ? value : "any"),
                  initialValue: "any",
                  choices: [
                    {
                      label: "All Customers",
                      value: "any",
                    },
                    {
                      label: "Regular",
                      value: "regular",
                    },
                    {
                      label: "Pro",
                      value: "pro",
                    },
                    {
                      label: "VIP",
                      value: "premium",
                    },
                  ],
                },
              ],
            },
          ],
          12,
        ],
      ].map((args) => getFilterWithCol(...args)),
    ],
    renderContent: (props) => (
      <Map
        data={props.data}
        history={props.history}
        // pageProps={props}
      />
    ),
    actions: [],
  },
]);
