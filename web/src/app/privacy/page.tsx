import type { Metadata } from "next";
import Link from "next/link";
import { Clause, LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What EatAtEzz collects, why, and how to see, fix or delete your data.",
  alternates: { canonical: "/privacy" },
};

const CONTACT = "privacy@eatatezz.in";

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy policy"
      updated="19 November 2026"
      intro="EatAtEzz helps you find street food in Lucknow. You can browse without an account. If you sign in, we keep the little we need to run your profile, and nothing more."
    >
      <Clause title="Who we are">
        <p>
          EatAtEzz (&ldquo;we&rdquo;) runs eatatezz.netlify.app and the EatAtEzz app. For the Digital Personal Data Protection Act, 2023
          (&ldquo;DPDP Act&rdquo;) we are the <strong>Data Fiduciary</strong> for your personal data. Write to us at{" "}
          <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
        </p>
      </Clause>

      <Clause title="What we collect">
        <ul>
          <li><strong>From Google, when you sign in:</strong> your name, email address and profile photo. We never see your Google password.</li>
          <li><strong>What you add:</strong> reviews and star ratings, saved spots, playlists, spot suggestions and reports of wrong information.</li>
          <li><strong>Technical:</strong> a sign-in cookie that keeps you logged in, and standard server logs (IP address, browser, time) kept by our hosting providers for security.</li>
          <li><strong>Location:</strong> only if you allow it in your browser or phone, and only to show spots near you. We don&apos;t store it.</li>
        </ul>
        <p>We do not use advertising trackers, we do not sell data, and we do not build ad profiles.</p>
      </Clause>

      <Clause title="Why we use it">
        <ul>
          <li>To create your account and show your name and photo next to your reviews and playlists.</li>
          <li>To save your spots and playlists across devices.</li>
          <li>To check suggestions and reports, and to stop spam (daily limits per account).</li>
          <li>To keep the service secure and fix problems.</li>
        </ul>
        <p>
          We rely on your <strong>consent</strong>, which you give when you choose to sign in. You can withdraw it at any time by deleting your
          account; that is as easy as giving it.
        </p>
      </Clause>

      <Clause title="What is public">
        <p>
          Your display name, profile photo, reviews and any playlist you publish are visible to everyone. Your email address, saved spots,
          suggestions and reports are private to you (and to our moderators for suggestions and reports).
        </p>
      </Clause>

      <Clause title="Who processes it for us">
        <ul>
          <li><strong>Supabase</strong> — database and sign-in.</li>
          <li><strong>Google</strong> — sign-in, and Maps when you tap Directions.</li>
          <li><strong>Netlify</strong> — website hosting.</li>
          <li><strong>MapTiler / OpenFreeMap</strong> — map tiles (they see your IP address, not your account).</li>
        </ul>
        <p>Some of these store data outside India. They process it only on our instructions and under their own security commitments.</p>
      </Clause>

      <Clause title="How long we keep it">
        <p>
          As long as your account exists. When you delete your account we erase your profile, reviews, saved spots, playlists, suggestions
          and reports straight away. Backups roll over within 7 days. Server logs are kept by our providers for up to 30 days.
        </p>
      </Clause>

      <Clause title="Your rights">
        <ul>
          <li><strong>See and correct:</strong> your <Link href="/account">Account page</Link> shows what you&apos;ve added; edit or remove any of it there.</li>
          <li><strong>Erase:</strong> use <em>Delete my account</em> on your Account page, or email us.</li>
          <li><strong>Get a summary</strong> of the data we hold about you and who we&apos;ve shared it with: email us.</li>
          <li><strong>Nominate</strong> someone to exercise these rights if you can&apos;t: email us with their details.</li>
          <li><strong>Grievances:</strong> email <a href={`mailto:${CONTACT}`}>{CONTACT}</a>. We reply within 7 days and resolve within 30 at most. If you aren&apos;t satisfied, you can complain to the Data Protection Board of India.</li>
        </ul>
      </Clause>

      <Clause title="Security">
        <p>
          Data is encrypted in transit, every database table is protected by row-level security, and sign-in uses Google with PKCE. If a breach
          affects your data we will tell you and the Data Protection Board without delay, as the law requires.
        </p>
      </Clause>

      <Clause title="Children">
        <p>EatAtEzz accounts are for people aged 18 or over. If you are under 18, please browse without signing in.</p>
      </Clause>

      <Clause title="Changes">
        <p>If we change this policy in a way that matters, we&apos;ll update the date above and tell signed-in users on the site.</p>
      </Clause>
    </LegalPage>
  );
}
