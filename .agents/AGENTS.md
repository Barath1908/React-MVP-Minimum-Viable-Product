# Design System Rules

Adhere strictly to the following framework and UI library constraints for all design and implementation tasks in this workspace:

## UI Library & Component Mapping
1. **Tables**: Always use **Ant Design** (`Table` component) for tables requiring sorting, filtering, and pagination.
2. **Forms**: Always use **Ant Design** (`Form`, `Form.Item`) for form structures, state management, and validation.
3. **Inputs**: Always use **Material UI (MUI)** (`TextField`, `Input`, `OutlinedInput`, etc.) for form inputs, textfields, and select fields, even when nested inside Ant Design forms.
4. **Buttons**: Always use **Material UI (MUI)** (`Button`) for all user action buttons.
5. **Cards**: Always use **Material UI (MUI)** (`Card`, `CardContent`, etc.) for container cards and boxes.
6. **Alerts**: Always use **Material UI (MUI)** (`Alert`) for status messages, errors, and info boxes.
7. **Date/Time Pickers**: Always use **Ant Design** (`DatePicker`, `TimePicker`) for scheduling and dates.
8. **Layout & Grid**: Always use **Semantic UI React** (`Grid`, `Container`, etc.) for overall page layouts and grid systems.
9. **Navigation Menus**: Always use **Semantic UI React** (`Menu`, etc.) for headers, navbars, and sidebars.

## Styling & Theme Customization
1. **Hospital Theme Colors**: Always use **Styled Components** with the React context theme provider (`ThemeContext` / `Theme` token object) to apply clinical/hospital theme colors dynamically to any component or element.
2. **Library Overrides**: Always use **Styled Components** to override the default colors, borders, shadows, and typography of external libraries (MUI, Ant Design, Semantic UI). Avoid ad-hoc inline styles or plain CSS classes for library style overrides.
