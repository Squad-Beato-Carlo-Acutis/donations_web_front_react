import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  colors: {
    gray: {
        "900": '#181B23',
        "800": '#1F2029',
        "700": '#353646',
        "600": '#4B4D63',
        "500": '#616480',
        "400": '#797D9A',
        "300": '#9699BD',
        "200": '#B3B5C6',
        "100": '#D1D2DC',
        "50": '#EEEEF2',
    }
},

  fonts: {
    heading: `'Poppins', sans-serif`,
    body: `'Open Sans', sans-serif`,
  },
  styles: {
    global: {
      body: {
        bg: "#F9F5E8",
        color: "#363F5F",
      },
    },
  },
});
