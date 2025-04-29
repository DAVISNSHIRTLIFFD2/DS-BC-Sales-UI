import type * as React from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  separator?: React.ReactNode
  children: React.ReactNode
}

export function Breadcrumb({
  separator = <ChevronRight className="h-4 w-4" />,
  children,
  className,
  ...props
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="breadcrumb"
      className={cn("flex items-center text-sm text-muted-foreground", className)}
      {...props}
    >
      <ol className="flex items-center gap-1.5">{children}</ol>
    </nav>
  )
}

export interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode
}

export function BreadcrumbItem({ children, className, ...props }: BreadcrumbItemProps) {
  return (
    <li className={cn("flex items-center gap-1.5", className)} {...props}>
      {children}
    </li>
  )
}

export interface BreadcrumbLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode
  asChild?: boolean
}

export function BreadcrumbLink({ children, className, ...props }: BreadcrumbLinkProps) {
  return (
    <a className={cn("transition-colors hover:text-foreground", className)} {...props}>
      {children}
    </a>
  )
}

export interface BreadcrumbPageProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
}

export function BreadcrumbPage({ children, className, ...props }: BreadcrumbPageProps) {
  return (
    <span aria-current="page" className={cn("font-medium text-foreground", className)} {...props}>
      {children}
    </span>
  )
}

export interface BreadcrumbSeparatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode
}

export function BreadcrumbSeparator({ children, className, ...props }: BreadcrumbSeparatorProps) {
  return (
    <span aria-hidden="true" className={cn("text-muted-foreground", className)} {...props}>
      {children || <ChevronRight className="h-4 w-4" />}
    </span>
  )
}
