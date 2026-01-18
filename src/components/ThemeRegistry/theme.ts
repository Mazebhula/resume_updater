'use client';
import { Merriweather } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const merriweather = Merriweather({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  typography: {
    fontFamily: merriweather.style.fontFamily,
  },
});

export default theme;
