import FontFace from "../FontFace";

import Inter100 from "./files/Inter-Thin-100.ttf";
import Inter200 from "./files/Inter-ExtraLight-200.ttf";
import Inter300 from "./files/Inter-Light-300.ttf";
import Inter400 from "./files/Inter-Regular-400.ttf";
import Inter500 from "./files/Inter-Medium-500.ttf";
import Inter600 from "./files/Inter-SemiBold-600.ttf";
import Inter700 from "./files/Inter-Bold-700.ttf";
import Inter800 from "./files/Inter-ExtraBold-800.ttf";
import Inter900 from "./files/Inter-Black-900.ttf";

const Inter = FontFace.create("Inter", {
  100: {
    src: [{ url: Inter100, format: "woff" }],
  },
  200: {
    src: [{ url: Inter200, format: "woff" }],
  },
  300: {
    src: [{ url: Inter300, format: "woff" }],
  },
  400: {
    src: [{ url: Inter400, format: "woff" }],
  },
  500: {
    src: [{ url: Inter500, format: "woff" }],
  },
  600: {
    src: [{ url: Inter600, format: "woff" }],
  },
  700: {
    src: [{ url: Inter700, format: "woff" }],
  },
  800: {
    src: [{ url: Inter800, format: "woff" }],
  },
  900: {
    src: [{ url: Inter900, format: "woff" }],
  },
});

export default Inter;
