"use client";

import React, { useEffect, useRef } from "react";
import { navigationLinks } from "./navigationLinks";
import { store as createStore } from "hyperactiv/react";

const control = createStore({
  openIndex: null,
  isOpen: false,
  closeTimer: null,
});

const useHaederControl = () => {
  // ביטול טיימר אם עברנו שוב
  const clearCloseTimer = () => {
    if (control.closeTimer) {
      clearTimeout(control.closeTimer);
      control.closeTimer = null;
    }
  };

  const openPanel = (index) => {
    clearCloseTimer();
    control.openIndex = index;
    control.isOpen = true;
  };

  // נסגר בעדינות אחרי דיליי קצר כדי למנוע "ריצודים"
  const scheduleClose = () => {
    clearCloseTimer();
    control.closeTimer = setTimeout(() => {
      control.isOpen = false;
      // משאירים את openIndex כדי שאם חוזרים מהר יישאר אותו תוכן; אפשר גם לאפס:
      // control.openIndex = null;
    }, 140);
  };

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  const current =
    control.openIndex != null ? navigationLinks[control.openIndex] : null;

  return {
    isOpen: control.isOpen,
    setIsOpen: (value) => {
      control.isOpen = value;
    },
    openIndex: control.openIndex,
    current,
    openPanel,
    scheduleClose,
    clearCloseTimer,
  };
};

export default useHaederControl;
