// Fixed component library whitelist
// These are the ONLY components allowed in generated UIs

export const ALLOWED_COMPONENTS = [
  'Button',
  'Card',
  'Input',
  'Table',
  'Modal',
  'Sidebar',
  'Navbar',
  'Chart',
  'Stack',
  'Center',
  'Container',
] as const;

export type AllowedComponent = typeof ALLOWED_COMPONENTS[number];

// Component prop schemas for validation
export const COMPONENT_SCHEMAS = {
  Button: {
    props: ['children', 'variant', 'size', 'disabled', 'fullWidth'],
    required: ['children'],
    variants: {
      variant: ['primary', 'secondary', 'outline', 'danger'],
      size: ['sm', 'md', 'lg'],
    },
  },
  Card: {
    props: ['children', 'title', 'subtitle', 'variant', 'padding'],
    required: ['children'],
    variants: {
      variant: ['default', 'bordered', 'elevated'],
      padding: ['none', 'sm', 'md', 'lg'],
    },
  },
  Input: {
    props: ['type', 'placeholder', 'value', 'label', 'error', 'disabled', 'fullWidth', 'size'],
    required: [],
    variants: {
      type: ['text', 'email', 'password', 'number', 'tel', 'url'],
      size: ['sm', 'md', 'lg'],
    },
  },
  Table: {
    props: ['columns', 'data', 'striped', 'hoverable', 'bordered'],
    required: ['columns', 'data'],
    variants: {},
  },
  Modal: {
    props: ['isOpen', 'title', 'children', 'size', 'showCloseButton'],
    required: ['isOpen', 'children'],
    variants: {
      size: ['sm', 'md', 'lg', 'xl'],
    },
  },
  Sidebar: {
    props: ['items', 'header', 'footer', 'width', 'position'],
    required: ['items'],
    variants: {
      width: ['sm', 'md', 'lg'],
      position: ['left', 'right'],
    },
  },
  Navbar: {
    props: ['brand', 'items', 'actions', 'variant'],
    required: [],
    variants: {
      variant: ['light', 'dark'],
    },
  },
  Chart: {
    props: ['data', 'type', 'title', 'color', 'height'],
    required: ['data'],
    variants: {
      type: ['bar', 'line', 'pie'],
    },
  },
  Stack: {
    props: ['children', 'gap', 'direction', 'align'],
    required: ['children'],
    variants: {
      gap: ['none', 'sm', 'md', 'lg', 'xl'],
      direction: ['vertical', 'horizontal'],
      align: ['start', 'center', 'end', 'stretch'],
    },
  },
  Center: {
    props: ['children', 'maxWidth', 'padding'],
    required: ['children'],
    variants: {
      maxWidth: ['sm', 'md', 'lg', 'xl', 'full'],
      padding: ['none', 'sm', 'md', 'lg'],
    },
  },
  Container: {
    props: ['children', 'maxWidth', 'padding', 'centered'],
    required: ['children'],
    variants: {
      maxWidth: ['sm', 'md', 'lg', 'xl', '2xl', 'full'],
      padding: ['none', 'sm', 'md', 'lg'],
    },
  },
} as const;

// Component import statement template
export const COMPONENT_IMPORTS = `import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Table from '@/components/ui/Table';
import Modal from '@/components/ui/Modal';
import Sidebar from '@/components/ui/Sidebar';
import Navbar from '@/components/ui/Navbar';
import Chart from '@/components/ui/Chart';
import Stack from '@/components/ui/Stack';
import Center from '@/components/ui/Center';
import Container from '@/components/ui/Container';`;

// Export statement for all components
export const COMPONENT_EXPORTS = {
  Button: "export interface ButtonProps { children: React.ReactNode; variant?: 'primary' | 'secondary' | 'outline' | 'danger'; size?: 'sm' | 'md' | 'lg'; disabled?: boolean; fullWidth?: boolean; }",
  Card: "export interface CardProps { children: React.ReactNode; title?: string; subtitle?: string; variant?: 'default' | 'bordered' | 'elevated'; padding?: 'none' | 'sm' | 'md' | 'lg'; }",
  Input: "export interface InputProps { type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'; placeholder?: string; value?: string; label?: string; error?: string; disabled?: boolean; fullWidth?: boolean; size?: 'sm' | 'md' | 'lg'; }",
  Table: "export interface TableProps { columns: TableColumn[]; data: TableRow[]; striped?: boolean; hoverable?: boolean; bordered?: boolean; }",
  Modal: "export interface ModalProps { isOpen: boolean; title?: string; children: React.ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl'; showCloseButton?: boolean; }",
  Sidebar: "export interface SidebarProps { items: SidebarItem[]; header?: React.ReactNode; footer?: React.ReactNode; width?: 'sm' | 'md' | 'lg'; position?: 'left' | 'right'; }",
  Navbar: "export interface NavbarProps { brand?: React.ReactNode; items?: Array<{ label: string; active?: boolean; }>; actions?: React.ReactNode; variant?: 'light' | 'dark'; }",
  Chart: "export interface ChartProps { data: ChartDataPoint[]; type?: 'bar' | 'line' | 'pie'; title?: string; color?: string; height?: number; }",
};
