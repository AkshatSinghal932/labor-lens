// src/components/CustomLogoIcon.tsx
import type { FC, SVGProps } from 'react';

const CustomLogoIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24" // Standard icon viewBox
    fill="currentColor" // Ensures the color can be controlled by CSS
    {...props}
  >
    {/* 
      This path represents the main "P" shape with a C-shaped hole inside.
      The fillRule="evenodd" is crucial for creating the hole.
      The path consists of two sub-paths:
      1. The outer boundary of the "P" (stem and outer curve).
      2. The boundary of the C-shaped hole.
    */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 2V22H8V17.5C8 17.5 15 17.5 17 17.5C19.7614 17.5 22 15.2614 22 12.5C22 9.73858 19.7614 7.5 17 7.5H8V2H6ZM10 9.5H17C18.6569 9.5 20 10.8431 20 12.5C20 14.1569 18.6569 15.5 17 15.5H10V9.5Z"
    />
    {/* This path represents the small white triangle "pupil" inside the C-shaped hole. */}
    <path d="M14 10.5L13 12.5H15L14 10.5Z" />
  </svg>
);

export default CustomLogoIcon;
