// types/navigation.ts
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}
