// lib/content/types.ts

export type NavLink = { label: string; href: string }

export type CtaContent = {
  label: string
  href: string
}

// A richer CTA block used on the landing page (not a button)
export type CtaSection = {
  headline: string
  subheadline: string
  primaryCta: CtaContent
  secondaryCta: CtaContent
}

export type SectionHeader = {
  eyebrow: string
  headline: string
  subheadline?: string
}

export type Pillar = {
  slug: string
  icon:
    | 'users'
    | 'wallet'
    | 'chart'
    | 'layers'
    | 'shield'
    | 'bell'
    | 'file'
    | 'sparkles'
    | 'gavel'
  title: string
  tagline: string
  summary: string
  bullets: string[]
  detail?: ProseBlock[]
}

export type ProseBlock =
  | { kind: 'h2'; text: string }
  | { kind: 'h3'; text: string }
  | { kind: 'p'; text: string }
  | { kind: 'ul'; items: string[] }
  | { kind: 'ol'; items: string[] }
  | { kind: 'callout'; tone: 'info' | 'warn' | 'success'; title: string; body: string }

export type RoleKey =
  | 'chairperson'
  | 'treasurer'
  | 'secretary'
  | 'member'
  | 'auditor'
  | 'admin'

export type Role = {
  key: RoleKey
  name: string
  short: string
  responsibilities: string[]
}

export type PermissionRow = {
  capability: string
  chairperson: boolean | 'own' | 'read'
  treasurer: boolean | 'own' | 'read'
  secretary: boolean | 'own' | 'read'
  member: boolean | 'own' | 'read'
  auditor: boolean | 'own' | 'read'
  admin: boolean | 'own' | 'read'
}

export type FaqItem = { question: string; answer: string }

export type PricingTier = {
  key: 'free' | 'basic' | 'medium' | 'large'
  name: string
  price: string
  priceNote: string
  tagline: string
  audience: string
  features: string[]
  highlighted?: boolean
  cta: CtaContent
}

export type EnterpriseTier = {
  name: string
  priceFrom: string
  priceNote: string
  tagline: string
  features: string[]
  cta: CtaContent
}

export type MoneyState = {
  key: 'recorded' | 'verified' | 'available' | 'owed'
  label: string
  description: string
  example: string
}

export type MarketingPage = {
  slug: string
  header: SectionHeader
  blocks: ProseBlock[]
  cta?: CtaContent
}