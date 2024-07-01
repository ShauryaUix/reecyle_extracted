import Types from "../../common/modules/types";

export const fieldImage = [
  "FieldUploadRefs",
  {
    name: "image",
    accept: "image/png",
    transformations: [
      // TODO check pictures max width
      ["GM", { command: "compress", maxWidth: 700 }],
    ],
  },
];

export const fieldGallery = [
  "FieldUploadRefs",
  {
    name: "gallery",
    maxCount: 10,
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

export const fieldUnit = [
  "FieldSelect",
  {
    name: "unit",
    label: null,
    prefix: "Unit:",
    choices: Types.CATEGORY_UNITS_LIST.map(({ id: value, label }) => ({
      value,
      label,
    })),
  },
];

export const fieldPpu = [
  "FieldText",
  {
    name: "ppu",
    type: "number",
    label: null,
    prefix: "Points Per Unit:",
    rules: [["validation.isRequired"], ["validation.isNumber"]],
  },
];

export const fieldExcerpt = [
  "FieldText",
  {
    name: "excerpt",
    label: "Excerpt",
    rules: [],
  },
];

export const fieldDescription = [
  "FieldTextArea",
  {
    name: "description",
    label: "Description",
    autoSize: { minRows: 2 },
  },
];

export const fieldNotes = [
  "FieldTextArea",
  {
    name: "notes",
    label: "Notes",
    autoSize: { minRows: 2 },
  },
];

export const fieldTip = [
  "FieldTextArea",
  {
    name: "tip",
    label: "Tip",
    autoSize: { minRows: 2 },
  },
];

export const fieldSubcategories = [
  "FieldSortableList",
  {
    name: "subcategories",
    label: "Subcategories",
    fields: [
      [
        "FieldText",
        {
          name: "subcategory",
          label: null,
          style: { marginTop: "-12px" },
        },
      ],
    ],
  },
];

export const fieldActive = [
  "FieldSwitch",
  {
    name: "active",
    label: null,
    inlineLabelBefore: "Active:",
    initialValue: true,
    col: 12,
  },
];

export const fieldHidden = [
  "FieldSwitch",
  {
    name: "hidden",
    label: null,
    inlineLabelBefore: "Hidden:",
    initialValue: false,
    col: 12,
  },
];

export const fieldYoutubeUrl = [
  "FieldText",
  {
    name: "youtubeUrl",
    label: "Youtube URL",
    // label: null,
  },
];

export const ADMIN = [
  fieldImage,
  fieldGallery,
  fieldName,
  fieldUnit,
  fieldPpu,
  fieldActive,
  fieldHidden,
  fieldYoutubeUrl,
  fieldExcerpt,
  fieldDescription,
  fieldSubcategories,
  fieldNotes,
  fieldTip,
];
