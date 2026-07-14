import React, { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

/**
 * Smoothly counts a number from 0 → `value` the first time it scrolls into
 * view. Supports decimals and a custom `format` callback.
 *
 * @param {object} props
 * @param {number} [props.value=0] - Target value.
 * @param {number} [props.decimals=0] - Decimal places to render.
 * @param {number} [props.duration=1.2] - Animation duration (seconds).
 * @param {(n:number)=>string} [props.format] - Custom formatter.
 * @param {string} [props.prefix] - Rendered before the number.
 * @param {string} [props.suffix] - Rendered after the number.
 */
const AnimatedCounter = ({
  value = 0,
  decimals = 0,
  duration = 1.2,
  format,
  suffix = "",
  prefix = "",
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: duration * 1000, bounce: 0 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue]);

  useEffect(() => spring.on("change", (latest) => setDisplay(latest)), [spring]);

  const rounded = decimals > 0 ? display.toFixed(decimals) : Math.round(display);
  const text = format ? format(Number(rounded)) : `${prefix}${rounded}${suffix}`;

  return (
    <span ref={ref} className="tabular-nums">
      {text}
    </span>
  );
};

export default AnimatedCounter;
