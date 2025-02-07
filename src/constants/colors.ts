const ORY_THEME = {
  "accent-def": "#ff4900",
  "accent-muted": "#ff7700",
  "accent-emphasis": "#ea4504",
  "accent-disabled": "#e0e0e0",
  "accent-subtle": "#eceefe",
  "foreground-def": "#171717",
  "foreground-muted": "#616161",
  "foreground-subtle": "#9e9e9e",
  "foreground-disabled": "#bdbdbd",
  "foreground-on-dark": "#ffffff",
  "foreground-on-accent": "#ffffff",
  "foreground-on-disabled": "#e0e0e0",
  "background-surface": "#ffffff",
  "background-canvas": "#fcfcfc",
  "background-subtle": "#eeeeee",
  "error-def": "#9c0f2e",
  "error-subtle": "#fce8ec",
  "error-muted": "#e95c7b",
  "error-emphasis": "#df1642",
  "success-emphasis": "#18a957",
  "border-def": "#f5e4de",
  "text-def": "#ffffff",
  "text-disabled": "#757575",
  "input-background": "#ffffff",
  "input-disabled": "#e0e0e0",
  "input-placeholder": "#9e9e9e",
  "input-text": "#424242",
};

export const baseColors = {
  surface: {
    primary: ORY_THEME["background-surface"],
    secondary: ORY_THEME["background-canvas"],
    tertiary: ORY_THEME["background-subtle"],
    quaternary: ORY_THEME["foreground-on-disabled"],
  },
  border: {
    primary: ORY_THEME["border-def"],
    secondary: ORY_THEME["foreground-muted"],
    tertiary: ORY_THEME["foreground-on-disabled"],
  },
  text: {
    initial: ORY_THEME["foreground-def"],
    active: ORY_THEME["accent-def"],
    focus: ORY_THEME["accent-muted"],
    disabled: ORY_THEME["text-disabled"],
    error: ORY_THEME["error-emphasis"],
  },
  button: {
    initial: ORY_THEME["accent-def"],
    focus: ORY_THEME["accent-muted"],
    disabled: "#FDF3EA",
  },
  buttonText: {
    initial: ORY_THEME["foreground-muted"],
    active: ORY_THEME["text-def"],
  },
  buttonIcon: {
    initial: ORY_THEME["foreground-muted"],
    active: ORY_THEME["accent-muted"],
    disabled: ORY_THEME["foreground-disabled"],
    muted: ORY_THEME["border-def"],
    inactive: "#F7B991",
  },
  input: {
    focus: ORY_THEME["accent-muted"],
    hover: ORY_THEME["accent-muted"],
    active: ORY_THEME["error-emphasis"],
    valid: ORY_THEME["success-emphasis"],
    initial: ORY_THEME["input-disabled"],
  },
  inputText: {
    initial: ORY_THEME["foreground-def"],
    active: ORY_THEME["input-text"],
    disabled: ORY_THEME["text-disabled"],
  },
  inputIcon: {
    initial: ORY_THEME["foreground-def"],
    active: ORY_THEME["accent-muted"],
  },
  inputTextPlaceholder: {
    initial: ORY_THEME["input-placeholder"],
    secondary: ORY_THEME["foreground-muted"],
  },
  activityIndicator: {
    initial: ORY_THEME["foreground-muted"],
  },
  icon: { pdf: { background: "#F23F5E", text: ORY_THEME["text-def"] } },
  toasterIcon: {
    success: ORY_THEME["success-emphasis"],
    info: ORY_THEME["foreground-def"],
    error: ORY_THEME["error-def"],
  },
} as const;

export const darkColors = {
  surface: {
    primary: "#0C0C0C",
    secondary: ORY_THEME["background-canvas"],
    tertiary: "#18181B",
    quaternary: "#2B2B31",
  },
  text: {
    initial: ORY_THEME["foreground-on-dark"],
    active: ORY_THEME["accent-def"],
    focus: ORY_THEME["accent-muted"],
    disabled: "#A1A1AA",
    error: ORY_THEME["error-emphasis"],
  },
  inputIcon: {
    initial: ORY_THEME["foreground-on-dark"],
    active: ORY_THEME["accent-muted"],
  },
  buttonText: {
    initial: ORY_THEME["foreground-on-dark"],
    active: ORY_THEME["text-def"],
  },
  button: {
    initial: ORY_THEME["accent-def"],
    focus: ORY_THEME["accent-muted"],
    disabled: "#62250E",
  },
  buttonIcon: {
    initial: "#A1A1AA",
    active: "#E0520B",
    disabled: ORY_THEME["foreground-muted"],
    muted: "#62250E",
    inactive: "#f07014",
  },
  inputTextPlaceholder: {
    initial: ORY_THEME["input-placeholder"],
    secondary: ORY_THEME["foreground-muted"],
  },
} as const;

export type ThemeColors = typeof baseColors;
