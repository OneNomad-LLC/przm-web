import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Security & Trust · przm',
  description:
    'SOC 2 status, sub-processors, supply-chain hygiene, vulnerability disclosure, and the audit-friendly artifacts your security team needs to greenlight przm.',
}

/**
 * Public trust page — what the buyer\'s CISO sends back at the start of
 * a security review. Keep it honest about timeline and link to real
 * artifacts (SBOM, signed releases, runbooks) that already exist in the
 * cortex / przm-access GitHub repos.
 */
export default async function SecurityPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-4xl border-x border-[color:var(--color-border-subtle)] pt-14">
        {/* Header */}
        <section className="px-6 py-16 md:py-20">
          <p className="text-xs font-medium uppercase tracking-widest text-[color:var(--color-text-muted)]">
            Security & Trust
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-5xl">
            Built for security review — not around it.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[color:var(--color-text-secondary)]">
            Open-source core, signed releases, published SBOM, public sub-processor list,
            documented runbooks. Everything an enterprise security team would normally have
            to wait three weeks for is on this page or one click away.
          </p>
        </section>

        {/* SOC 2 + compliance status */}
        <section className="border-t border-[color:var(--color-border-subtle)] px-6 py-12">
          <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--color-text-primary)]">
            Compliance status
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/40 p-6">
              <div className="flex items-baseline justify-between">
                <h3 className="font-semibold text-[color:var(--color-text-primary)]">
                  SOC 2 Type 2
                </h3>
                <span className="rounded-full bg-[color:var(--color-voice)]/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-voice)]">
                  In progress
                </span>
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[color:var(--color-text-muted)]">Platform</dt>
                  <dd className="text-[color:var(--color-text-primary)]">Vanta</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[color:var(--color-text-muted)]">CPA</dt>
                  <dd className="text-[color:var(--color-text-primary)]">Prescient Assurance</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[color:var(--color-text-muted)]">Type 1 target</dt>
                  <dd className="text-[color:var(--color-text-primary)]">Q3 2026</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[color:var(--color-text-muted)]">Type 2 target</dt>
                  <dd className="text-[color:var(--color-text-primary)]">Q1 2027</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[color:var(--color-text-muted)]">In scope</dt>
                  <dd className="text-right text-[color:var(--color-text-primary)]">
                    Cloud · cortex + przm-access
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/40 p-6">
              <div className="flex items-baseline justify-between">
                <h3 className="font-semibold text-[color:var(--color-text-primary)]">
                  GDPR / EU data residency
                </h3>
                <span className="rounded-full bg-[color:var(--color-knowledge)]/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-knowledge)]">
                  Ready
                </span>
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[color:var(--color-text-muted)]">EU region</dt>
                  <dd className="text-[color:var(--color-text-primary)]">Frankfurt (fra1)</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[color:var(--color-text-muted)]">EU tenant pinning</dt>
                  <dd className="text-[color:var(--color-text-primary)]">Per-tenant, enforced server-side</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[color:var(--color-text-muted)]">DPA</dt>
                  <dd className="text-[color:var(--color-text-primary)]">
                    <a
                      href="https://github.com/OneNomad-LLC/cortex/blob/main/legal/dpa-template.md"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[color:var(--color-knowledge)] hover:underline"
                    >
                      Template →
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/40 p-6">
              <div className="flex items-baseline justify-between">
                <h3 className="font-semibold text-[color:var(--color-text-primary)]">
                  HIPAA
                </h3>
                <span className="rounded-full bg-[color:var(--color-text-muted)]/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-muted)]">
                  Self-hosted / air-gap only
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                We don&apos;t offer a BAA on Cloud yet. For PHI workloads today, use the
                self-hosted or air-gap deployment — your existing HIPAA boundary covers
                cortex until we add a BAA-eligible Cloud track.
              </p>
            </div>

            <div className="rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/40 p-6">
              <div className="flex items-baseline justify-between">
                <h3 className="font-semibold text-[color:var(--color-text-primary)]">
                  FedRAMP / ISO 27001
                </h3>
                <span className="rounded-full bg-[color:var(--color-text-muted)]/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-muted)]">
                  Not started
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                Not on the roadmap until a paying customer asks. For federal-adjacent
                workloads today, the air-gap deployment with a perpetual license
                covers the use case.
              </p>
            </div>
          </div>
        </section>

        {/* Supply-chain hygiene */}
        <section className="border-t border-[color:var(--color-border-subtle)] px-6 py-12">
          <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--color-text-primary)]">
            Supply chain
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[color:var(--color-text-secondary)]">
            Every release ships a signed Docker image, a CycloneDX SBOM, and a SLSA
            build provenance attestation. Your SCA tool can consume these directly.
          </p>

          <ul className="mt-6 space-y-3 text-sm">
            {[
              {
                label: 'CycloneDX SBOM',
                desc: 'Generated per release, attached to the GitHub Release.',
                href: 'https://github.com/OneNomad-LLC/cortex/releases',
              },
              {
                label: 'Cosign-signed Docker images',
                desc: 'cosign verify --certificate-identity-regexp ghcr.io/onenomad-llc/przm-cortex:<tag>',
                href: 'https://github.com/OneNomad-LLC/cortex/blob/main/docs/security/SBOM.md',
              },
              {
                label: 'SLSA Level 2+ build provenance',
                desc: 'cosign verify-attestation against the registry-uploaded attestation.',
                href: 'https://github.com/OneNomad-LLC/cortex/blob/main/.github/workflows/docker-publish.yml',
              },
              {
                label: 'npm provenance',
                desc: '@onenomad/przm-access publishes with --provenance enabled.',
                href: 'https://www.npmjs.com/package/@onenomad/przm-access',
              },
              {
                label: 'Pinned production dependencies',
                desc: 'Every top-level production dep is exact-pinned (no ^ ranges).',
                href: 'https://github.com/OneNomad-LLC/cortex/blob/main/package.json',
              },
              {
                label: 'Reproducible-build CI',
                desc: 'CI builds the image twice and diffs the manifest each release.',
                href: 'https://github.com/OneNomad-LLC/cortex/blob/main/docs/security/REPRODUCIBLE-BUILDS.md',
              },
            ].map((item) => (
              <li
                key={item.label}
                className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-surface)]/40 p-4"
              >
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-baseline justify-between gap-4 transition-colors hover:text-[color:var(--color-knowledge)]"
                >
                  <div>
                    <div className="font-semibold text-[color:var(--color-text-primary)]">
                      {item.label}
                    </div>
                    <div className="mt-1 font-mono text-[12px] leading-relaxed text-[color:var(--color-text-secondary)]">
                      {item.desc}
                    </div>
                  </div>
                  <span className="text-[color:var(--color-text-muted)]">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Sub-processors */}
        <section className="border-t border-[color:var(--color-border-subtle)] px-6 py-12">
          <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--color-text-primary)]">
            Sub-processors
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[color:var(--color-text-secondary)]">
            The vendors that store, process, or transmit customer data on our Cloud
            tier. Self-hosted deployments inherit none of these.
          </p>

          <div className="mt-6 overflow-hidden rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/40">
            <table className="w-full text-sm">
              <thead className="border-b border-[color:var(--color-border-subtle)] text-left text-[10px] font-medium uppercase tracking-widest text-[color:var(--color-text-muted)]">
                <tr>
                  <th className="px-4 py-3">Vendor</th>
                  <th className="px-4 py-3">Purpose</th>
                  <th className="px-4 py-3">Region</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[color:var(--color-border-subtle)] text-[color:var(--color-text-secondary)]">
                {[
                  ['Neon', 'Postgres database for cortex + przm-access', 'US · EU'],
                  ['DigitalOcean', 'Compute (Cloud production)', 'US-East · Frankfurt'],
                  ['Vercel', 'Marketing site + customer dashboard', 'Global edge'],
                  ['Stripe', 'Subscription billing + payment processing', 'US'],
                  ['Resend', 'Transactional email (magic-link, invites)', 'US'],
                  ['GitHub Container Registry', 'Docker image distribution', 'Global'],
                  ['OpenRouter (optional)', 'LLM enrichment when configured', 'BYOK · varies'],
                ].map(([vendor, purpose, region]) => (
                  <tr key={vendor}>
                    <td className="px-4 py-3 font-medium text-[color:var(--color-text-primary)]">
                      {vendor}
                    </td>
                    <td className="px-4 py-3">{purpose}</td>
                    <td className="px-4 py-3 font-mono text-[12px]">{region}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Runbooks + audit export */}
        <section className="border-t border-[color:var(--color-border-subtle)] px-6 py-12">
          <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--color-text-primary)]">
            Operational runbooks
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[color:var(--color-text-secondary)]">
            Documented procedures, not internal-only Confluence pages. Auditors and
            customer security teams can read the same docs we operate from.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              {
                label: 'Incident response',
                desc: 'P0–P3 severity tiers, containment playbook, customer notification SLA, 72-hr GDPR breach pointer.',
                href: 'https://github.com/OneNomad-LLC/cortex/blob/main/docs/runbooks/INCIDENT-RESPONSE.md',
              },
              {
                label: 'Access review',
                desc: 'Quarterly procedure covering GitHub, Neon, DO, Stripe, Google Workspace. 24-hr offboarding checklist.',
                href: 'https://github.com/OneNomad-LLC/cortex/blob/main/docs/runbooks/ACCESS-REVIEW.md',
              },
              {
                label: 'Backup + restore',
                desc: 'Neon PITR + Droplet snapshot restore procedures. Quarterly DR test with pass/fail log.',
                href: 'https://github.com/OneNomad-LLC/cortex/blob/main/docs/runbooks/BACKUP-RESTORE.md',
              },
              {
                label: 'Audit log export',
                desc: 'GET /admin/orgs/:id/audit + signed webhook delivery to Datadog, Splunk, or generic HTTPS endpoint.',
                href: 'https://github.com/OneNomad-LLC/przm-access/blob/main/apps/service/docs/AUDIT-SCHEMA.md',
              },
            ].map((r) => (
              <li
                key={r.label}
                className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-surface)]/40 p-4"
              >
                <a
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transition-colors hover:text-[color:var(--color-knowledge)]"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="font-semibold text-[color:var(--color-text-primary)]">
                      {r.label}
                    </div>
                    <span className="text-[color:var(--color-text-muted)]">↗</span>
                  </div>
                  <p className="mt-1 text-[13px] leading-relaxed text-[color:var(--color-text-secondary)]">
                    {r.desc}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Vuln disclosure */}
        <section className="border-t border-[color:var(--color-border-subtle)] px-6 py-12">
          <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--color-text-primary)]">
            Vulnerability disclosure
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[color:var(--color-text-secondary)]">
            Report a vulnerability to{' '}
            <a
              href="mailto:security@przm.sh"
              className="text-[color:var(--color-knowledge)] underline-offset-4 hover:underline"
            >
              security@przm.sh
            </a>
            . We acknowledge within 5 business days and aim to release a fix or
            mitigation within 30 days. Past advisories and mean-time-to-patch are
            published in our ADVISORIES log.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
            <a
              href="https://github.com/OneNomad-LLC/cortex/blob/main/SECURITY.md"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-[color:var(--color-border-default)] px-4 py-2 font-medium text-[color:var(--color-text-primary)] transition-colors hover:border-[color:var(--color-knowledge)]/60"
            >
              SECURITY.md (cortex) →
            </a>
            <a
              href="https://github.com/OneNomad-LLC/przm-access/blob/main/SECURITY.md"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-[color:var(--color-border-default)] px-4 py-2 font-medium text-[color:var(--color-text-primary)] transition-colors hover:border-[color:var(--color-knowledge)]/60"
            >
              SECURITY.md (przm-access) →
            </a>
            <a
              href="https://github.com/OneNomad-LLC/cortex/blob/main/docs/security/ADVISORIES.md"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-[color:var(--color-border-default)] px-4 py-2 font-medium text-[color:var(--color-text-primary)] transition-colors hover:border-[color:var(--color-knowledge)]/60"
            >
              Advisory log →
            </a>
          </div>
        </section>

        {/* For CISOs */}
        <section className="border-t border-[color:var(--color-border-subtle)] px-6 py-16">
          <div className="rounded-2xl border border-[color:var(--color-knowledge)]/20 bg-[color:var(--color-knowledge)]/[0.04] p-8">
            <p className="text-xs font-medium uppercase tracking-widest text-[color:var(--color-text-muted)]">
              For your CISO
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[color:var(--color-text-primary)]">
              Doing source-level review yourself?
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-[color:var(--color-text-secondary)]">
              The cortex core is Apache-2.0 on public GitHub, and the access-service
              contract package (<code className="rounded bg-[color:var(--color-bg-elevated)] px-1.5 py-0.5 font-mono text-[12px]">@onenomad/przm-access</code>) is Apache-2.0 on npm.
              Your security team can SAST/DAST the open-source surface directly, audit our
              SBOM, and verify our cosign signatures. Most enterprise security teams
              report this shortens their review by 3-4 weeks versus a closed-source vendor.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="https://github.com/OneNomad-LLC/cortex"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-[color:var(--color-charcoal)] transition-all hover:brightness-110"
                style={{ background: 'var(--color-knowledge)' }}
              >
                cortex on GitHub →
              </a>
              <a
                href="mailto:security@przm.sh"
                className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--color-border-default)] px-5 py-2.5 text-sm font-semibold text-[color:var(--color-text-primary)] transition-colors hover:border-[color:var(--color-knowledge)]/60"
              >
                Email security team →
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

