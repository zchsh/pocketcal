import React, { useRef, useEffect } from "react";
// Types
import type { CSSProperties, PropsWithChildren } from "react";
import "./Collapsible.css";

/**
 * Collapsible content block, receives children and a `isCollapsed` prop,
 * smoothly animates from collapsed (height 0) to expanded (height auto)
 * when its incoming `isCollapsed` prop is changed.
 *
 * @param {Object} props
 * @param {boolean} props.isCollapsed if true, the collapsible area with occupy zero height. automatically animates between states.
 * @param {typeof React.Children} props.children React children to render in the collapsible area
 * @returns Renders the collapsable area, with the provided children within it
 */
function Collapsible({
  isCollapsed,
  children,
}: PropsWithChildren<{ isCollapsed?: boolean }>) {
  const parentElem = useRef<HTMLDivElement | null>(null);

  /**
   * When the `isCollapsed` prop changes, we adjust the height
   * of the inner collapsible area
   */
  useEffect(() => {
    adjustHeight(isCollapsed, parentElem);
  }, [isCollapsed]);

  return (
    <div
      className={"g-collapsible--root"}
      ref={parentElem}
      style={
        {
          "--initial-height": isCollapsed ? "0px" : "auto",
          "--initial-overflow": isCollapsed ? "hidden" : "visible",
        } as CSSProperties
      }
    >
      <div className={"g-collapsible--inner"} data-is-collapsed={isCollapsed}>
        {children}
      </div>
    </div>
  );
}

function adjustHeight(
  isCollapsed: boolean | undefined,
  parentElemRef: React.MutableRefObject<HTMLDivElement | null>,
) {
  const elem = parentElemRef.current;
  if (!elem || !(elem instanceof Element)) {
    return;
  }
  const innerElem = elem.firstChild as HTMLElement;
  const computedStyle = getComputedStyle(elem);
  if (isCollapsed) {
    //  Transition from auto to 0
    elem.style.overflow = "hidden";
    innerElem.style.opacity = "0";
    elem.style.height = computedStyle.height; // set to px height, not auto
    elem.offsetHeight; // force repaint
    elem.style.height = "0px"; // trigger the current px height >> 0px transition
  } else {
    //  Transition from 0 to auto
    innerElem.style.opacity = "1";
    innerElem.style.display = "block";
    const currentHeight = computedStyle.height; // save current height
    elem.style.height = "auto"; // briefly set auto height to calc end height
    const endHeight = computedStyle.height; // save end height
    if (endHeight !== currentHeight) {
      //  Only run the height animation if it'll actually transition,
      //  if the values are the same, then `transitionEnd` won't be called,
      //  and the height will become set to a fixed `endHeight` rather than auto
      elem.style.height = currentHeight; // reset height before animating
      elem.offsetHeight; // force repaint
      elem.style.height = endHeight; // trigger the current px >> end px transition
    }
  }
  //  Handle transition end sets height back to auto as appropriate
  elem.addEventListener("transitionend", handleTransitionEnd, false);
}

// type TransitionHandler = (this: HTMLDivElement, ev: TransitionEvent) => any;
const handleTransitionEnd = function (event: TransitionEvent) {
  if (event.propertyName !== "height") {
    return;
  }
  const elem = event.target as EventTarget;
  cleanupTransition(elem);
  elem.removeEventListener(
    "transitionend",
    handleTransitionEnd as EventListener,
    false,
  );
};

function cleanupTransition(elem: EventTarget) {
  if (!elem || !(elem instanceof Element)) {
    return;
  }
  const computedStyle = getComputedStyle(elem);
  const innerElem = elem.firstChild as HTMLElement;
  const innerElemStyle = getComputedStyle(innerElem);
  const isCollapsed = computedStyle.height === "0px";
  if (isCollapsed) {
    innerElem.style.display = "none";
    //  Transition delay modifications allow expected difference in collapse and expanding animation sequence
    const elemTransitionCss = computedStyle.getPropertyValue(
      "transition-duration",
    );
    const innerTransitionCss = innerElemStyle.getPropertyValue(
      "transition-duration",
    );
    const heightDuration =
      elemTransitionCss !== "" ? parseFloat(elemTransitionCss) : 0;
    const opacityDuration =
      innerTransitionCss !== "" ? parseFloat(innerTransitionCss) : 0;
    if (heightDuration && opacityDuration) {
      innerElem.style.transitionDelay = `${heightDuration - opacityDuration}s`;
    }
  } else {
    (elem as HTMLElement).style.height = "auto";
    (elem as HTMLElement).style.overflow = "visible";
    innerElem.style.transitionDelay = "0s";
  }
}

export default Collapsible;
