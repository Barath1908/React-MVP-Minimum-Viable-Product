import { useEffect, useRef } from "react";
import environment from "../config/environment";

const useIdleLogout = (
  onLogout,
  timeout = environment.IDLE_TIMEOUT
) => {
  const timerRef = useRef(null);
  const onLogoutRef = useRef(onLogout);

  // Sync the latest onLogout callback to a ref
  useEffect(() => {
    onLogoutRef.current = onLogout;
  }, [onLogout]);

  useEffect(() => {
    const resetTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      if (!onLogoutRef.current) return;

      timerRef.current = setTimeout(() => {
        onLogoutRef.current?.();
      }, timeout);
    };

    const events = [
      "mousemove",
      "mousedown",
      "keypress",
      "scroll",
      "touchstart",
    ];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [timeout]); // Depend only on timeout, not onLogout
};

export default useIdleLogout;