export const fieldName = [
  "FieldText",
  {
    name: "name",
    label: null,
    prefix: "Name:",
    rules: [["validation.isRequired"]],
  },
];

export const fieldPolygonTitle = [
  "FieldTitle",
  {
    title: "Area Boundaries",
  },
];

export const fieldPolygon = [
  "FieldGooglePolygon",
  {
    name: "polygon",
    label: null,
    mapContainerHeight: "250px",
    polygonExtraParameters: {
      strokeColor: "#60c85d",
      fillColor: "#60c85dff",
    },
    initialMapConfig: {
      // UAE
      zoom: 7,
      center: {
        lng: 54.71720030880409,
        lat: 24.659754289090323,
      },
      mapId: "847580dfe908bb8e",
      zoomControl: true,
      mapTypeControl: true,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: true,
    },
  },
];

export const fieldStatus = [
  "FieldRadio",
  {
    name: "status",
    label: null,
    initialValue: "SERVICED",
    choices: [
      {
        label: "Active",
        value: "SERVICED",
      },
      {
        label: "Inactive",
        value: "NOT_SERVICED",
      },
      {
        label: "Hidden",
        value: "INACTIVE",
      },
    ],
  },
];

export const ADMIN = [fieldName, fieldStatus, fieldPolygonTitle, fieldPolygon];
