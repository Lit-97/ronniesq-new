import type * as React from "react";

type IonIconProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  name?: string;
  src?: string;
  icon?: string;
  size?: string;
  color?: string;
  slot?: string;
  class?: string;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  "aria-hidden"?: boolean | "true" | "false";
  "aria-label"?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "ion-icon": IonIconProps;
    }
  }
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "ion-icon": IonIconProps;
    }
  }
}

declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      "ion-icon": IonIconProps;
    }
  }
}

declare module "react/jsx-dev-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      "ion-icon": IonIconProps;
    }
  }
}

export {};