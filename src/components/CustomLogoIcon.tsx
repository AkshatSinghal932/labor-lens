// src/components/CustomLogoIcon.tsx
import type { FC, SVGProps } from 'react';

const CustomLogoIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24" // Standard icon viewBox
    fill="black" // Ensures the color is explicitly black
    {...props}
  >
    {/* A simple square, representing the black image provided by the user. */}
    <rect width="24" height="24" />
  </svg>
);

export default CustomLogoIcon;
