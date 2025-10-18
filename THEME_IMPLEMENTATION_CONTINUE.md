# Theme System Implementation - Continuation Guide

## ✅ Already Completed (Session 1):

1. **Theme Context Created** (`lib/contexts/ThemeContext.tsx`)
   - 5 themes: Light, Dark, Green, Purple, Amber
   - Complete color schemes for Header, Sidebar, Content
   - localStorage persistence
   - Context API setup

2. **Theme Selector Component** (`components/shared/ThemeSelector.tsx`)
   - Beautiful dropdown with icons
   - Theme preview
   - Fully functional

3. **Root Layout Updated** (`app/layout.tsx`)
   - ThemeProvider wrapped around app
   - Ready to use

4. **Header Component Updated** (`components/shared/Header.tsx`)
   - Uses theme colors dynamically
   - Theme selector integrated
   - ✅ COMPLETED

## 🔄 Remaining Tasks:

### Priority 1: Update Sidebar Component
**File:** `components/shared/Sidebar.tsx`

**Changes needed:**
1. Import useTheme hook (line 4):
```typescript
import { useTheme } from '@/lib/contexts/ThemeContext';
```

2. Get theme (line 16, after other hooks):
```typescript
const { theme } = useTheme();
```

3. Update sidebar container (line 120):
```typescript
<aside className={`
  fixed left-0 top-16 bottom-0 w-64 ${theme.sidebar.bg} border-r ${theme.sidebar.border} z-50 transition-transform duration-300 ease-in-out flex flex-col shadow-xl
  ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  lg:translate-x-0
`}>
```

4. Update menu item buttons (lines 132-143):
```typescript
<button
  key={item.path}
  onClick={() => handleNavigation(item.path)}
  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
    isActive
      ? `${theme.sidebar.activeBg} ${theme.sidebar.activeText} shadow-md`
      : `${theme.sidebar.text} hover:${theme.sidebar.bgHover} hover:${theme.sidebar.textHover}`
  }`}
>
  {item.icon}
  <span className="font-medium">{item.label}</span>
</button>
```

5. Update footer section (line 149):
```typescript
<div className={`p-4 border-t ${theme.sidebar.border} ${theme.sidebar.footerBg}`}>
  <div className={`mb-3 pb-3 border-b ${theme.sidebar.border}`}>
    <p className={`text-sm font-semibold ${theme.sidebar.activeText}`}>{user?.name}</p>
    <p className={`text-xs ${theme.sidebar.text} mt-0.5`}>{user?.role}</p>
  </div>
  {/* Logout button remains red */}
</div>
```

### Priority 2: Update DashboardLayout Component
**File:** `components/dashboard/DashboardLayout.tsx`

**Changes needed:**
1. Import useTheme:
```typescript
import { useTheme } from '@/lib/contexts/ThemeContext';
```

2. Get theme:
```typescript
const { theme } = useTheme();
```

3. Update container backgrounds (lines 19-27):
```typescript
return (
  <div className={`min-h-screen ${theme.content.bg}`}>
    <Header onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
    <div className={`flex min-h-screen ${theme.content.bg}`}>
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <main className="flex-1 p-4 sm:p-6 lg:ml-64 mt-16">
        {children}
      </main>
    </div>
  </div>
);
```

### Priority 3: Update Card Component (Optional Enhancement)
**File:** `components/shared/Card.tsx`

Make cards theme-aware:
```typescript
'use client';
import { ReactNode } from 'react';
import { useTheme } from '@/lib/contexts/ThemeContext';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, className = '', onClick }: CardProps) {
  const { theme } = useTheme();

  return (
    <div
      className={`${theme.content.cardBg} rounded-xl shadow-md border ${theme.content.cardBorder} p-4 sm:p-6 transition-all ${onClick ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02]' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
```

### Priority 4: Update Button Component (Optional Enhancement)
**File:** `components/shared/Button.tsx`

Make primary buttons use theme gradient:
```typescript
// In the component, get theme
const { theme } = useTheme();

// Update primary variant:
primary: `bg-gradient-to-r ${theme.primary.main} hover:${theme.primary.dark} text-white focus:ring-cyan-400`,
```

### Priority 5: Update Text Colors in Components

For dark theme support, update text classes throughout:
- Replace `text-slate-900` with `${theme.content.text}`
- Replace `text-slate-600` with `${theme.content.textSecondary}`

**Files to update:**
- `components/inventory/MedicineCard.tsx`
- `components/customers/CustomerList.tsx`
- `components/suppliers/SupplierList.tsx`
- All report components
- All form components

## 🎨 Theme Color Reference:

### Light Theme:
- Header: Slate 800-700 (dark)
- Sidebar: Slate 700 (medium dark)
- Content: Light blue-slate gradient
- Primary: Cyan-Blue

### Dark Theme:
- Header: Gray 900-800 (very dark)
- Sidebar: Gray 800 (dark)
- Content: Gray 900-800 (dark)
- Cards: Gray 800
- Text: Gray 100/400

### Green Theme:
- Header: Emerald 700-Teal 700
- Sidebar: Emerald 800
- Content: Light emerald-teal
- Primary: Emerald-Teal

### Purple Theme:
- Header: Purple 800-Indigo 800
- Sidebar: Purple 900
- Content: Light purple-pink
- Primary: Purple-Pink

### Amber Theme:
- Header: Amber 700-Orange 700
- Sidebar: Amber 800
- Content: Light amber-orange
- Primary: Amber-Orange

## 🚀 Testing Checklist:

After completing updates:
1. ✅ Theme selector works in header
2. ✅ All 5 themes switch correctly
3. ✅ Theme persists on page reload
4. ✅ Header changes color
5. ⏳ Sidebar changes color
6. ⏳ Content area changes color
7. ⏳ Cards change color
8. ⏳ Buttons use theme colors
9. ⏳ Text readable in all themes (especially dark)
10. ⏳ All pages look good in all themes

## 📝 Quick Start for Next Session:

Start with this prompt:
"Continue implementing the theme system. I have the THEME_IMPLEMENTATION_CONTINUE.md file. Please start with Priority 1: Update Sidebar Component, then Priority 2: Update DashboardLayout, and continue through all priorities."

## 🎯 Current Status:
- **Completed**: 40%
- **Remaining**: 60%
- **Time Estimate**: 15-20 minutes for remaining work

Good luck! The foundation is solid, just need to apply theme colors to remaining components! 🎨✨
