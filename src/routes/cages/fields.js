import tests from "../../helpers/tests";

import { fieldPointsTitle, fieldPoints } from "../users/fields";

import Types from "../../common/modules/types";

const { viewerIsNotAdmin, isNotEditActivity } = tests;

const skipPoints = [viewerIsNotAdmin, isNotEditActivity];

export const fieldName = [
  "FieldText",
  {
    name: "name",
    label: null,
    prefix: "Name:",
    rules: [["validation.isRequired"]],
  },
];

export const fieldOrganization = [
  "FieldConnectionSelect",
  {
    name: "organization",
    label: null,
    prefix: "Organization:",
    formItemConfig: { style: { marginBottom: "8px" } },
    searchPaths: ["name"],
    placeholder: "Type to search",
    url: "/organizations",
  },
];

export const fieldAddress = [
  "FieldGoogleAddress",
  {
    name: "address",
    label: null,
    placeholder: "Location",
    formItemConfig: { style: { marginBottom: "20px" } },
    rules: [["validation.isRequired"]],
    initialValue: {
      coordinates: [55.23235540546874, 25.170403219172076],
    },
    initialMapConfig: {
      zoom: 15,
      mapId: "f7b88d1b7848c940",
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      // fullscreenControl: true,
    },
    extraGeocodingParams: {
      componentRestrictions: {
        country: Types.COUNTRY,
      },
    },
    extraAutocompleteParams: {
      componentRestrictions: {
        country: Types.COUNTRY,
      },
    },
    line2Props: null,
    postalCodeProps: null,
    cityProps: null,
  },
];

export const fieldHidden = [
  "FieldRadio",
  {
    name: "hidden",
    label: null,
    initialValue: false,
    choices: [
      { label: "Regular", value: false },
      { label: "Hidden", value: true },
    ],
    block: true,
  },
];

export const ADMIN = [
  fieldName,
  fieldOrganization,
  fieldAddress,
  fieldHidden,

  [
    fieldPointsTitle[0],
    {
      ...fieldPointsTitle[1],
      skip: skipPoints,
    },
  ],
  [
    fieldPoints[0],
    {
      ...fieldPoints[1],
      skip: skipPoints,
    },
  ],
];
