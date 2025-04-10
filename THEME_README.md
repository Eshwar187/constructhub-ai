# ConstructHub Theme System

This document provides information about the theme system in ConstructHub.

## Overview

ConstructHub uses a theme system that supports both light and dark modes. The theme system is built on top of Tailwind CSS and uses CSS variables to define colors and other design tokens.

## Theme Implementation

The theme system is implemented using the following components:

1. **ThemeProvider**: A React context provider that manages the current theme state.
2. **ThemeToggle**: A UI component that allows users to switch between light, dark, and system themes.
3. **CSS Variables**: Defined in `globals.css` to provide theme-specific colors and styles.

## Using Theme-Aware Colors

When building components, use the following Tailwind CSS classes to ensure they respect the current theme:

### Background Colors

- `bg-background`: Main background color
- `bg-card`: Card background color
- `bg-muted`: Muted background color
- `bg-primary`: Primary background color
- `bg-secondary`: Secondary background color

### Text Colors

- `text-foreground`: Main text color
- `text-muted-foreground`: Muted text color
- `text-primary-foreground`: Text color on primary backgrounds
- `text-secondary-foreground`: Text color on secondary backgrounds

### Border Colors

- `border-border`: Standard border color

## Theme Toggle

The theme toggle component allows users to switch between:

- Light mode
- Dark mode
- System preference (follows the user's operating system setting)

## Adding New Components

When adding new components, follow these guidelines:

1. Use theme-aware color classes instead of hardcoded colors
2. Test components in both light and dark modes
3. Ensure sufficient contrast between text and background colors

## Example

```tsx
// Good - uses theme-aware colors
<div className="bg-card border-border p-4">
  <h2 className="text-foreground">Title</h2>
  <p className="text-muted-foreground">Description</p>
</div>

// Bad - uses hardcoded colors
<div className="bg-gray-800 border-gray-700 p-4">
  <h2 className="text-white">Title</h2>
  <p className="text-gray-400">Description</p>
</div>
```

## Customizing Themes

The theme colors are defined in `globals.css` using CSS variables. To customize the theme colors, update the CSS variables in the `:root` and `.dark` selectors.

## Troubleshooting

If components don't change appearance when switching themes:

1. Make sure they're using theme-aware color classes
2. Check that the component is within the `ThemeProvider` context
3. Verify that the component doesn't have hardcoded colors that override theme colors
