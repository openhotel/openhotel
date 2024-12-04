import * as React from "react";

type SizeUnit = number | string | "xs" | "sm" | "md" | "lg" | "xl";

export type BoxProps = {
  hidden?: boolean;
  className?: string;
  // Margins
  m?: SizeUnit;
  mt?: SizeUnit;
  mb?: SizeUnit;
  ml?: SizeUnit;
  mr?: SizeUnit;
  // Paddings
  p?: SizeUnit;
  pt?: SizeUnit;
  pb?: SizeUnit;
  pl?: SizeUnit;
  pr?: SizeUnit;
  // Width
  w?: SizeUnit;
  maw?: SizeUnit;
  miw?: SizeUnit;
  // Height
  h?: SizeUnit;
  mah?: SizeUnit;
  mih?: SizeUnit;
  // Color
  c?: string;
  bg?: string;
  bd?: string;
  // Font
  fz?: SizeUnit;
  fw?: "normal" | "bold";
  // Position
  position?: "relative" | "absolute" | "fixed" | "sticky";
  top?: SizeUnit;
  right?: SizeUnit;
  bottom?: SizeUnit;
  left?: SizeUnit;
  // Flex
  flex?: number;
  // Other
  display?: "flex" | "block" | "inline" | "inline-block" | "none";
};

export const BoxComponent: React.FC<
  React.HTMLProps<HTMLDivElement> & Partial<BoxProps>
> = ({ hidden, className, children, ...props }) => {
  if (hidden) return null;
  const style = boxPropsToStyle(props);
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};

export function extractBoxProps<T extends Record<string, any>>(
  props: T & Partial<BoxProps>,
): [Omit<T, keyof BoxProps>, Partial<BoxProps>] {
  const {
    hidden,
    className,
    m,
    mt,
    mb,
    ml,
    mr,
    p,
    pt,
    pb,
    pl,
    pr,
    w,
    maw,
    miw,
    h,
    mah,
    mih,
    c,
    bg,
    bd,
    fz,
    fw,
    position,
    top,
    right,
    bottom,
    left,
    flex,
    display,
    ...other
  } = props;

  return [
    other,
    {
      hidden,
      className,
      m,
      mt,
      mb,
      ml,
      mr,
      p,
      pt,
      pb,
      pl,
      pr,
      w,
      maw,
      miw,
      h,
      mah,
      mih,
      c,
      bg,
      bd,
      fz,
      fw,
      position,
      top,
      right,
      bottom,
      left,
      flex,
      display,
    },
  ];
}

export function boxPropsToStyle({
  m,
  mt,
  mb,
  ml,
  mr,
  p,
  pt,
  pb,
  pl,
  pr,
  w,
  maw,
  miw,
  h,
  mah,
  mih,
  c,
  bg,
  bd,
  fz,
  fw,
  position,
  top,
  right,
  bottom,
  left,
  flex,
  display,
}: Partial<BoxProps>): React.CSSProperties {
  return {
    // Margins
    margin: m !== undefined ? fromSizeUnit(m) : undefined,
    marginTop:
      mt !== undefined
        ? fromSizeUnit(mt)
        : m !== undefined
          ? fromSizeUnit(m)
          : undefined,
    marginBottom:
      mb !== undefined
        ? fromSizeUnit(mb)
        : m !== undefined
          ? fromSizeUnit(m)
          : undefined,
    marginLeft:
      ml !== undefined
        ? fromSizeUnit(ml)
        : m !== undefined
          ? fromSizeUnit(m)
          : undefined,
    marginRight:
      mr !== undefined
        ? fromSizeUnit(mr)
        : m !== undefined
          ? fromSizeUnit(m)
          : undefined,
    // Paddings
    paddingTop:
      pt !== undefined
        ? fromSizeUnit(pt)
        : p !== undefined
          ? fromSizeUnit(p)
          : undefined,
    paddingBottom:
      pb !== undefined
        ? fromSizeUnit(pb)
        : p !== undefined
          ? fromSizeUnit(p)
          : undefined,
    paddingLeft:
      pl !== undefined
        ? fromSizeUnit(pl)
        : p !== undefined
          ? fromSizeUnit(p)
          : undefined,
    paddingRight:
      pr !== undefined
        ? fromSizeUnit(pr)
        : p !== undefined
          ? fromSizeUnit(p)
          : undefined,
    // Width
    width: w !== undefined ? fromSizeUnit(w) : undefined,
    maxWidth: maw !== undefined ? fromSizeUnit(maw) : undefined,
    minWidth: miw !== undefined ? fromSizeUnit(miw) : undefined,
    // Height
    height: h !== undefined ? fromSizeUnit(h) : undefined,
    maxHeight: mah !== undefined ? fromSizeUnit(mah) : undefined,
    minHeight: mih !== undefined ? fromSizeUnit(mih) : undefined,
    // Color
    color: c !== undefined ? c : undefined,
    backgroundColor: bg !== undefined ? bg : undefined,
    border: bd !== undefined ? bd : undefined,
    // Font
    fontSize: fz !== undefined ? fromSizeUnit(fz) : undefined,
    fontWeight: fw !== undefined ? fw : undefined,
    // Position
    position: position !== undefined ? position : undefined,
    top: top !== undefined ? fromSizeUnit(top) : undefined,
    right: right !== undefined ? fromSizeUnit(right) : undefined,
    bottom: bottom !== undefined ? fromSizeUnit(bottom) : undefined,
    left: left !== undefined ? fromSizeUnit(left) : undefined,
    // Flex
    flexGrow: flex !== undefined ? flex : undefined,
    // Other
    display: display !== undefined ? display : undefined,
  };
}

const fromSizeUnit = (size: SizeUnit): string | number => {
  if (size === "xs") return 4;
  if (size === "sm") return 8;
  if (size === "md") return 16;
  if (size === "lg") return 24;
  if (size === "xl") return 32;
  return size;
};
