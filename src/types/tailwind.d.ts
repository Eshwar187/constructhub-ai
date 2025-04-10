// tailwind.d.ts
import 'tailwindcss/tailwind.css';

declare module 'tailwindcss/tailwind.css' {
  export default any;
}

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}
