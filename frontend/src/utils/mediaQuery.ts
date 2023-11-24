import { useMediaQuery } from "react-responsive";

// xs: "480px",
// sm: "640px",
// md: "768px",
// lg: "1024px",
// xl: "1280px",
//export type IBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export const Desktop = ({ children }: any) => {
  const isDesktop = useMediaQuery({ minWidth: 992 });
  return isDesktop ? children : null;
};
export const Tablet = ({ children }: any) => {
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  return isTablet ? children : null;
};
export const Mobile = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  console.log(isMobile);
  return isMobile;
};
export const Default = ({ children }: any) => {
  const isNotMobile = useMediaQuery({ minWidth: 768 });
  return isNotMobile ? children : null;
};
