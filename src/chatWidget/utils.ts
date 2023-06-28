export function getChatPosition(position: string,triggerPosition:DOMRect){
    if (!triggerPosition) {
        return ""; // Return empty string if trigger position is not available
      }
    
      const { top, left, width, height } = triggerPosition;
    
      const distance = 10; // Adjust this value to set the desired distance from the trigger

      switch (position) {
        case "top-left":
          return `top-${top - height - distance}px left-${left}px`;
        case "top-center":
          return `top-${top - height - distance}px left-${left + width / 2}px -translate-x-1/2`;
        case "top-right":
          return `top-${top - height - distance}px right-${window.innerWidth - (left + width)}px`;
        case "center-left":
          return `top-${top + height / 2}px left-${left - width - distance}px -translate-y-1/2`;
        case "center-right":
          return `top-${top + height / 2}px right-${window.innerWidth - (left + width) - distance}px -translate-y-1/2`;
        case "bottom-right":
          return `bottom-${window.innerHeight - top + distance}px right-${window.innerWidth - (left + width)}px`;
        case "bottom-center":
          return `bottom-${window.innerHeight - top + distance}px left-${left + width / 2}px -translate-x-1/2`;
        case "bottom-left":
          return `bottom-${window.innerHeight - top + distance}px left-${left}px`;
        default:
          return "";
      }
    }