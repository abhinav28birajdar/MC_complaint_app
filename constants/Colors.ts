import { ComplaintPriority, ComplaintStatus, UserRole } from "@/types";

const palette = {
    // Define base palette colors
    purpleDark: "#32012F",
    brownDark: "#524C42",
    beigeLight: "#E2DFD0",
    orangeAccent: "#F97300",
    white: "#FFFFFF",
    black: "#000000",
    green: "#4CAF50",
    yellow: "#FFC107", // Changed from FFC107
    red: "#F44336",
    blue: "#2196F3",
};

export const colors = {
    primary: palette.purpleDark,
    secondary: palette.brownDark,
    background: palette.beigeLight,
    accent: palette.orangeAccent, // Could be used for recycling/trees?
    white: palette.white,
    black: palette.black,
    gray: {
        50: "#FAFAFA",
        100: "#F5F5F5", // Lightest gray for subtle backgrounds
        200: "#EEEEEE", // Light gray for borders, dividers
        300: "#E0E0E0", // Light gray for disabled states, borders
        400: "#BDBDBD", // Medium-light gray for icons, placeholder text
        500: "#9E9E9E", // Medium gray for secondary text, icons
        600: "#757575", // Medium-dark gray for text
        700: "#616161", // Dark gray for primary text elements
        800: "#424242", // Darker gray for titles, important text
        900: "#212121", // Darkest gray, near black
    },
    success: palette.green,
    successLight: "#E8F5E9", // Lighter shade for backgrounds
    warning: palette.yellow,
    warningLight: "#FFF8E1", // Lighter shade for backgrounds
    error: palette.red,
    errorLight: "#FFEBEE", // Lighter shade for backgrounds
    info: palette.blue,
    infoLight: "#E3F2FD", // Lighter shade for backgrounds

    primaryLight: "#F3E5F5", // Lighter purple, added as used

    transparent: "transparent",

    // Theme definitions (optional, if using light/dark themes)
    light: {
        text: palette.black, // Or gray[900]
        background: palette.beigeLight, // Or white
        tint: palette.purpleDark,
        tabIconDefault: palette.brownDark, // Or gray[600]
        tabIconSelected: palette.purpleDark,
        card: palette.white,
        border: palette.beigeLight, // Or gray[200]
    },
    dark: { // Example dark theme - adjust as needed
        text: palette.white, // Or gray[100]
        background: palette.black, // Or gray[900]
        tint: palette.orangeAccent,
        tabIconDefault: palette.white, // Or gray[400]
        tabIconSelected: palette.orangeAccent,
        card: palette.brownDark, // Or gray[800]
        border: palette.brownDark, // Or gray[700]
    }
};

// Semantic color mappings
export const statusColors: Record<ComplaintStatus, { background: string, border: string, text: string }> = {
    pending: { background: colors.warningLight, border: colors.warning, text: colors.warning },
    inProgress: { background: colors.infoLight, border: colors.info, text: colors.info },
    resolved: { background: colors.successLight, border: colors.success, text: colors.success },
    rejected: { background: colors.errorLight, border: colors.error, text: colors.error }
};

export const priorityColors: Record<ComplaintPriority, { background: string, border: string, text: string }> = {
    low: { background: colors.gray[100], border: colors.gray[400], text: colors.gray[600] },
    medium: { background: colors.infoLight, border: colors.info, text: colors.info },
    high: { background: colors.warningLight, border: colors.warning, text: colors.warning },
    critical: { background: colors.errorLight, border: colors.error, text: colors.error }
};

export const roleColors: Record<UserRole, { background: string, text: string }> = {
    admin: { background: colors.errorLight, text: colors.error },
    employee: { background: colors.infoLight, text: colors.info },
    citizen: { background: colors.successLight, text: colors.success }
};

export default colors;