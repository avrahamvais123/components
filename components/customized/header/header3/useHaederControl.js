"use client";

import React, { useEffect, useRef, useState } from "react";
import { navigationLinks } from "./navigationLinks";

const useHaederControl = () => {
  const [openIndex, setOpenIndex] = useState(null); // איזה טאב פתוח
  const [isOpen, setIsOpen] = useState(false); // האם הפאנל פתוח
  const closeTimer = useRef(null);

  // ביטול טיימר אם עברנו שוב
  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openPanel = (index) => {
    clearCloseTimer();
    setOpenIndex(index);
    setIsOpen(true);
  };

  // נסגר בעדינות אחרי דיליי קצר כדי למנוע "ריצודים"
  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => {
      setIsOpen(false);
      // משאירים את openIndex כדי שאם חוזרים מהר יישאר אותו תוכן; אפשר גם לאפס:
      // setOpenIndex(null);
    }, 140);
  };

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  const current = openIndex != null ? navigationLinks[openIndex] : null;

  return {
    isOpen,
    setIsOpen,
    openIndex,
    current,
    openPanel,
    scheduleClose,
    clearCloseTimer,
  };
};

export default useHaederControl;
