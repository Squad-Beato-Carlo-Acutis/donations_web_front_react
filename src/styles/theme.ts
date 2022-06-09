import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
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
