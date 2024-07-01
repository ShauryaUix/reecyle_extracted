import tests from "../../helpers/tests";

import { fieldPointsTitle, fieldPoints } from "../users/fields";

const { viewerIsNotAdmin, isNotEditActivity } = tests;

const skipPoints = [viewerIsNotAdmin, isNotEditActivity];

export const fieldImage = [
  "FieldUploadRefs",
  {
    name: "image",
    maxCount: 1,
    accept: "image/jpg,image/jpeg,image/png",
    transformations: [
      // TODO check pictures max width
      ["GM", { command: "compress", maxWidth: 700 }],
    ],
  },
];

export const fieldName = [
  "FieldText",
  {
    name: "name",
    label: null,
    prefix: "Name:",
    rules: [["validation.isRequired"]],
  },
];

export const ADMIN = [
  fieldImage,
  fieldName,

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
