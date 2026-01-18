import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { NavigationItem } from '../../config/dashboardStructure';

interface SidebarItemProps {
  item: NavigationItem;
  level?: number;
}

const SidebarItem = ({ item, level = 0 }: SidebarItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const hasChildren = item.children && item.children.length > 0;
  const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Dynamically get icon component
  const IconComponent = (LucideIcons as any)[item.icon] || LucideIcons.Circle;

  // Auto-expand if active
  useEffect(() => {
    if (hasChildren && isActive) {
      setIsOpen(true);
    }
  }, [hasChildren, isActive]);

  const handleToggle = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle(e);
    }
  };

  const paddingLeft = level * 20 + 16;

  return (
    <div>
      <div
        className={`
          flex items-center justify-between px-4 py-2.5 cursor-pointer
          transition-all duration-200 ease-out
          hover:bg-gray-100 hover:pl-5
          focus-within:bg-gray-100 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-inset
          ${isActive ? 'bg-blue-50 border-r-2 border-blue-600 text-blue-900' : 'text-gray-700'}
        `}
        style={{ paddingLeft: `${paddingLeft}px` }}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        role={hasChildren ? 'button' : undefined}
        aria-expanded={hasChildren ? isOpen : undefined}
        aria-current={isActive ? 'page' : undefined}
        tabIndex={hasChildren ? 0 : undefined}
      >
        <Link
          to={item.path}
          className="flex items-center gap-3 flex-1 min-w-0 focus:outline-none"
          onClick={(e) => {
            if (!hasChildren) {
              e.stopPropagation();
            }
          }}
          aria-label={`Navigate to ${item.label}`}
        >
          <IconComponent 
            className={`
              w-5 h-5 flex-shrink-0 transition-colors
              ${isActive ? 'text-blue-600' : 'text-gray-600'}
            `}
            aria-hidden="true"
          />
          <span 
            className={`
              text-sm font-medium truncate transition-colors
              ${isActive ? 'text-blue-900' : 'text-gray-700'}
            `}
          >
            {item.label}
          </span>
        </Link>
        {hasChildren && (
          <div 
            className={`
              text-gray-400 transition-transform duration-200
              ${isOpen ? 'rotate-0' : '-rotate-90'}
            `}
            aria-hidden="true"
          >
            <ChevronDown className="w-4 h-4" />
          </div>
        )}
      </div>
      {hasChildren && (
        <div
          ref={contentRef}
          className={`
            overflow-hidden transition-all duration-300 ease-in-out
            ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
          `}
          role="region"
          aria-label={`${item.label} submenu`}
        >
          <div className="sidebar-item-enter">
            {item.children!.map((child) => (
              <SidebarItem key={child.id} item={child} level={level + 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarItem;
