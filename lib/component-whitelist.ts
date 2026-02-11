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
] as const;

export type AllowedComponent = typeof ALLOWED_COMPONENTS[number];

// Component prop schemas for validation
export const COMPONENT_SCHEMAS = {
  Button: {
    props: ['children', 'variant', 'size', 'onClick', 'disabled', 'fullWidth'],
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
    props: ['type', 'placeholder', 'value', 'onChange', 'label', 'error', 'disabled', 'fullWidth', 'size'],
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
    props: ['isOpen', 'onClose', 'title', 'children', 'size', 'showCloseButton'],
    required: ['isOpen', 'onClose', 'children'],
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
} as const;

// Component import statement template
export const COMPONENT_IMPORTS = `import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Table from '@/components/ui/Table';
import Modal from '@/components/ui/Modal';
import Sidebar from '@/components/ui/Sidebar';
import Navbar from '@/components/ui/Navbar';
import Chart from '@/components/ui/Chart';`;

// Export statement for all components
export const COMPONENT_EXPORTS = {
  Button: "export interface ButtonProps { children: React.ReactNode; variant?: 'primary' | 'secondary' | 'outline' | 'danger'; size?: 'sm' | 'md' | 'lg'; onClick?: () => void; disabled?: boolean; fullWidth?: boolean; }",
  Card: "export interface CardProps { children: React.ReactNode; title?: string; subtitle?: string; variant?: 'default' | 'bordered' | 'elevated'; padding?: 'none' | 'sm' | 'md' | 'lg'; }",
  Input: "export interface InputProps { type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'; placeholder?: string; value?: string; onChange?: (value: string) => void; label?: string; error?: string; disabled?: boolean; fullWidth?: boolean; size?: 'sm' | 'md' | 'lg'; }",
  Table: "export interface TableProps { columns: TableColumn[]; data: TableRow[]; striped?: boolean; hoverable?: boolean; bordered?: boolean; }",
  Modal: "export interface ModalProps { isOpen: boolean; onClose: () => void; title?: string; children: React.ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl'; showCloseButton?: boolean; }",
  Sidebar: "export interface SidebarProps { items: SidebarItem[]; header?: React.ReactNode; footer?: React.ReactNode; width?: 'sm' | 'md' | 'lg'; position?: 'left' | 'right'; }",
  Navbar: "export interface NavbarProps { brand?: React.ReactNode; items?: Array<{ label: string; onClick?: () => void; active?: boolean; }>; actions?: React.ReactNode; variant?: 'light' | 'dark'; }",
  Chart: "export interface ChartProps { data: ChartDataPoint[]; type?: 'bar' | 'line' | 'pie'; title?: string; color?: string; height?: number; }",
};
