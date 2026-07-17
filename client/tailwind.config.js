export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "on-secondary": "#002a78", "inverse-surface": "#e2e1ee", "on-secondary-fixed": "#00174b", 
        "on-tertiary-fixed-variant": "#7d2d00", "outline-variant": "#5c3f3f", "on-tertiary-fixed": "#360f00", 
        "surface-variant": "#33343e", "secondary-container": "#0053db", "surface-container-lowest": "#0c0e16", 
        "on-primary-fixed-variant": "#920022", "on-error-container": "#ffdad6", "surface-tint": "#ffb3b3", 
        "on-secondary-fixed-variant": "#003ea8", "secondary-fixed": "#dbe1ff", "error-container": "#93000a", 
        "tertiary-container": "#bf4a03", "tertiary": "#ffb596", "on-surface": "#e2e1ee", 
        "surface-container-high": "#282933", "tertiary-fixed": "#ffdbcd", "outline": "#ac8888", 
        "on-tertiary": "#581e00", "on-secondary-container": "#cdd7ff", "surface-container-low": "#191b24", 
        "surface-bright": "#373942", "inverse-on-surface": "#2e3039", "tertiary-fixed-dim": "#ffb596", 
        "inverse-primary": "#bf0030", "surface-dim": "#11131b", "on-tertiary-container": "#fff1ed", 
        "primary-fixed-dim": "#ffb3b3", "on-background": "#e2e1ee", "background": "#11131b", 
        "primary-fixed": "#ffdad9", "on-primary": "#680015", "secondary-fixed-dim": "#b4c5ff", 
        "error": "#ffb4ab", "surface-container": "#1d1f28", "secondary": "#b4c5ff", "surface": "#11131b", 
        "primary-container": "#dc143c", "on-primary-container": "#fff1f0", "surface-container-highest": "#33343e", 
        "on-primary-fixed": "#40000a", "primary": "#ffb3b3", "on-surface-variant": "#e6bdbc", "on-error": "#690005"
      }, 
      borderRadius: {
        DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px"
      }, 
      spacing: {
        base: "4px", xl: "64px", "margin-desktop": "32px", gutter: "20px", "margin-mobile": "16px", 
        md: "24px", lg: "40px", xs: "8px", sm: "16px"
      }, 
      fontFamily: {
        "body-sm": ["Geist", "sans-serif"], "code-block": ["JetBrains Mono", "monospace"], 
        "headline-lg": ["Geist", "sans-serif"], "headline-md": ["Geist", "sans-serif"], 
        "body-lg": ["Geist", "sans-serif"], "headline-lg-mobile": ["Geist", "sans-serif"], 
        "label-mono": ["JetBrains Mono", "monospace"], "headline": ["Geist", "sans-serif"], 
        "display": ["Geist", "sans-serif"], "body": ["Geist", "sans-serif"], "label": ["JetBrains Mono", "monospace"]
      }, 
      fontSize: {
        "body-sm": ["14px", {lineHeight: "1.5", letterSpacing: "-0.2px", fontWeight: "400"}], 
        "code-block": ["13px", {lineHeight: "1.7", fontWeight: "400"}], 
        "headline-lg": ["32px", {lineHeight: "1.2", letterSpacing: "-0.3px", fontWeight: "600"}], 
        "headline-md": ["20px", {lineHeight: "1.3", letterSpacing: "-0.3px", fontWeight: "600"}], 
        "body-lg": ["16px", {lineHeight: "1.6", letterSpacing: "-0.3px", fontWeight: "400"}], 
        "headline-lg-mobile": ["24px", {lineHeight: "1.2", letterSpacing: "-0.3px", fontWeight: "600"}], 
        "label-mono": ["12px", {lineHeight: "1.4", letterSpacing: "0px", fontWeight: "500"}]
      }
    }
  }
};
