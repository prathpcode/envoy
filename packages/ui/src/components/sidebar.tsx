"use client";
import * as React from "react";
import { Portal, Slot } from "radix-ui";
import { Menu } from "pixelarticons/react";
import { cn } from "../lib/utils";
import { Button, type ButtonProps } from "./button";

/**
 * Sidebar — a recessed lid-deep panel. The active item is a crooked pink sticker.
 * On desktop it collapses to an icon rail; under 768px it slides in as an overlay panel.
 * A simplified take on the shadcn Sidebar with the same part names.
 */

const MOBILE_QUERY = "(max-width: 767px)";
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_ICON = "4.5rem";
const SIDEBAR_SHORTCUT = "b";

function useIsMobile() {
  const [mobile, setMobile] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const on = () => setMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return mobile;
}

type SidebarContextValue = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within a SidebarProvider.");
  return ctx;
}

export interface SidebarProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;
  /** Controlled desktop state (expanded = true). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const SidebarProvider = React.forwardRef<HTMLDivElement, SidebarProviderProps>(
  ({ defaultOpen = true, open: openProp, onOpenChange, className, style, children, ...props }, ref) => {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = React.useState(false);
    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = openProp ?? _open;
    const setOpen = React.useCallback(
      (value: boolean) => {
        if (onOpenChange) onOpenChange(value);
        if (openProp === undefined) _setOpen(value);
      },
      [onOpenChange, openProp]
    );
    const toggleSidebar = React.useCallback(
      () => (isMobile ? setOpenMobile((o) => !o) : setOpen(!open)),
      [isMobile, open, setOpen]
    );

    // Ctrl/Cmd + B toggles the sidebar
    React.useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        if (e.key.toLowerCase() === SIDEBAR_SHORTCUT && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          toggleSidebar();
        }
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [toggleSidebar]);

    // leaving mobile closes the overlay
    React.useEffect(() => {
      if (!isMobile) setOpenMobile(false);
    }, [isMobile]);

    const value = React.useMemo<SidebarContextValue>(
      () => ({
        state: open ? "expanded" : "collapsed",
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar,
      }),
      [open, setOpen, openMobile, isMobile, toggleSidebar]
    );

    return (
      <SidebarContext.Provider value={value}>
        <div
          ref={ref}
          data-slot="sidebar-wrapper"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn("group/sidebar-wrapper flex min-h-svh w-full", className)}
          {...props}
        >
          {children}
        </div>
      </SidebarContext.Provider>
    );
  }
);
SidebarProvider.displayName = "SidebarProvider";

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** "icon" (default) collapses to a rail of icons; "none" never collapses. */
  collapsible?: "icon" | "none";
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ collapsible = "icon", className, children, ...props }, ref) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
    const panelRef = React.useRef<HTMLDivElement>(null);

    // mobile overlay: focus in, trap Tab, Escape closes, focus goes back on close
    React.useEffect(() => {
      if (!isMobile || !openMobile) return;
      const panel = panelRef.current;
      const prev = document.activeElement as HTMLElement | null;
      const first = panel?.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? panel)?.focus();
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          setOpenMobile(false);
        } else if (e.key === "Tab" && panel) {
          const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
          if (!items.length) return;
          const [head, tail] = [items[0], items[items.length - 1]];
          if (e.shiftKey && document.activeElement === head) {
            e.preventDefault();
            tail.focus();
          } else if (!e.shiftKey && document.activeElement === tail) {
            e.preventDefault();
            head.focus();
          }
        }
      };
      document.addEventListener("keydown", onKey);
      return () => {
        document.removeEventListener("keydown", onKey);
        prev?.focus?.();
      };
    }, [isMobile, openMobile, setOpenMobile]);

    if (isMobile) {
      const mobileState = openMobile ? "open" : "closed";
      return (
        <Portal.Root>
          <div
            data-slot="sidebar-backdrop"
            data-state={mobileState}
            aria-hidden
            onClick={() => setOpenMobile(false)}
            className="fixed inset-0 z-50 bg-ink/40 transition-opacity duration-300 data-[state=closed]:pointer-events-none data-[state=closed]:opacity-0"
          />
          <div
            ref={(node) => {
              panelRef.current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) ref.current = node;
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Sidebar"
            tabIndex={-1}
            inert={!openMobile}
            data-slot="sidebar"
            data-mobile="true"
            data-state={mobileState}
            className="group/sidebar sidebar-slide fixed inset-y-3 left-3 z-50 flex w-[min(18rem,calc(100vw-48px))] outline-none"
          >
            {/* the panel sticker sits inside the fixed frame: `sticker` sets its own position */}
            <div className={cn("sticker sticker-lg face-lid flex min-h-0 flex-1 flex-col py-2", className)} {...props}>
              {children}
            </div>
          </div>
        </Portal.Root>
      );
    }

    return (
      <div
        ref={ref}
        data-slot="sidebar"
        data-state={collapsible === "none" ? "expanded" : state}
        data-collapsible={collapsible}
        className={cn(
          "group/sidebar sticky top-0 flex max-h-svh shrink-0 flex-col self-stretch overflow-hidden bg-lid-deep text-on-lid",
          "w-[var(--sidebar-width)] transition-[width] duration-300 ease-out-expo data-[state=collapsed]:w-[var(--sidebar-width-icon)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Sidebar.displayName = "Sidebar";

export const SidebarTrigger = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, onClick, variant = "secondary", size = "icon", tilt = false, ...props }, ref) => {
    const { toggleSidebar, isMobile, open, openMobile } = useSidebar();
    return (
      <Button
        ref={ref}
        data-slot="sidebar-trigger"
        variant={variant}
        size={size}
        tilt={tilt}
        aria-label="Toggle sidebar"
        aria-expanded={isMobile ? openMobile : open}
        className={className}
        onClick={(e) => {
          onClick?.(e);
          toggleSidebar();
        }}
        {...props}
      >
        <Menu aria-hidden />
      </Button>
    );
  }
);
SidebarTrigger.displayName = "SidebarTrigger";

export const SidebarInset = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <main
      ref={ref}
      data-slot="sidebar-inset"
      className={cn("relative flex min-w-0 flex-1 flex-col bg-lid", className)}
      {...props}
    />
  )
);
SidebarInset.displayName = "SidebarInset";

// text that sits beside an icon disappears (but stays readable to screen readers) in the rail
const railHide = "group-data-[state=collapsed]/sidebar:[&>span]:sr-only";

export const SidebarHeader = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="sidebar-header"
    className={cn("flex flex-col gap-2 p-3 group-data-[state=collapsed]/sidebar:items-center", className)}
    {...p}
  />
);

export const SidebarFooter = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="sidebar-footer"
    className={cn("mt-auto flex flex-col gap-2 p-3 group-data-[state=collapsed]/sidebar:items-center", className)}
    {...p}
  />
);

export const SidebarContent = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="sidebar-content"
    className={cn("flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden", className)}
    {...p}
  />
);

export const SidebarGroup = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
  <div data-slot="sidebar-group" className={cn("flex flex-col gap-1 px-3 py-1", className)} {...p} />
);

export const SidebarGroupLabel = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="sidebar-group-label"
    className={cn(
      "px-3 pb-1 text-base font-extrabold text-on-lid-soft group-data-[state=collapsed]/sidebar:sr-only",
      className
    )}
    {...p}
  />
);

export const SidebarMenu = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} data-slot="sidebar-menu" className={cn("flex flex-col gap-1", className)} {...props} />
  )
);
SidebarMenu.displayName = "SidebarMenu";

export const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.LiHTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => (
    <li
      ref={ref}
      data-slot="sidebar-menu-item"
      className={cn("relative flex group-data-[state=collapsed]/sidebar:justify-center", className)}
      {...props}
    />
  )
);
SidebarMenuItem.displayName = "SidebarMenuItem";

export interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  isActive?: boolean;
}

export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ asChild = false, isActive = false, className, style, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : "button";
    return (
      <Comp
        ref={ref}
        data-slot="sidebar-menu-button"
        data-active={isActive || undefined}
        aria-current={isActive ? "page" : undefined}
        style={isActive ? { ["--p3d-tilt" as string]: "-1.5deg", ...style } : style}
        className={cn(
          "flex h-11 w-full min-w-0 cursor-pointer items-center gap-3 whitespace-nowrap px-3 text-left text-[17px] font-semibold outline-none",
          "[&>svg]:pixel-icon [&>svg]:size-6 [&>span]:truncate",
          "group-data-[state=collapsed]/sidebar:w-11 group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:px-0",
          "disabled:cursor-not-allowed disabled:opacity-60 aria-disabled:cursor-not-allowed aria-disabled:opacity-60",
          railHide,
          isActive
            ? "sticker crooked face-pink focus-cut my-1 font-extrabold"
            : "text-on-lid-soft transition-colors hover:bg-on-lid/10 hover:text-on-lid focus-visible:bg-on-lid/10 focus-visible:text-on-lid focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-sky",
          className
        )}
        {...props}
      />
    );
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";
