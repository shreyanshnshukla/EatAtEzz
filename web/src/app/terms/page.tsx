import type { Metadata } from "next";
import Link from "next/link";
import { Clause, LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "The rules for using EatAtEzz: reviews, playlists, suggestions and listings.",
  alternates: { canonical: "/terms" },
};

export default function Terms() {
  return (
    <LegalPage
      title="Terms of use"
      updated="19 November 2026"
      intro="Using EatAtEzz means you agree to these terms. They are short on purpose."
    >
      <Clause title="The service">
        <p>
          EatAtEzz is a free guide to street food in Lucknow. Listings, timings, prices and diet labels come from public sources and from
          users, and can be out of date. Check before you travel, and use your own judgement about food safety and allergies.
        </p>
      </Clause>

      <Clause title="Your account">
        <p>
          You sign in with Google and must be 18 or older. Keep your Google account secure; you are responsible for what is posted from
          your EatAtEzz account. You can delete it at any time from your <Link href="/account">Account page</Link>.
        </p>
      </Clause>

      <Clause title="What you post">
        <p>Reviews, playlists and suggestions must be your own and honest. Don&apos;t post:</p>
        <ul>
          <li>fake reviews, reviews of your own business or a competitor&apos;s, or paid reviews without saying so;</li>
          <li>abuse, hate, threats, or anyone&apos;s personal information;</li>
          <li>spam, links to unrelated sites, or anything illegal.</li>
        </ul>
        <p>
          You keep ownership of what you post. You give EatAtEzz a free, worldwide licence to show it on the site and app, and to share it
          (for example, in a shared playlist link). The licence ends when you delete the content, except where others have already shared it.
        </p>
      </Clause>

      <Clause title="Moderation">
        <p>
          We may remove content or suspend accounts that break these terms. Suggestions and reports are checked by a person before anything
          changes. To flag a problem, use <em>Report wrong info</em> on any spot, or write to{" "}
          <a href="mailto:hello@eatatezz.in">hello@eatatezz.in</a>.
        </p>
      </Clause>

      <Clause title="Vendors">
        <p>
          Listings are free and we don&apos;t take money to rank or review a spot. If you run a listed business and want details changed or the
          listing removed, write to <a href="mailto:hello@eatatezz.in">hello@eatatezz.in</a>.
        </p>
      </Clause>

      <Clause title="Liability">
        <p>
          EatAtEzz is provided as is. To the extent the law allows, we aren&apos;t liable for losses from relying on a listing or from any
          vendor&apos;s food or service. Nothing here limits rights you have under the Consumer Protection Act, 2019.
        </p>
      </Clause>

      <Clause title="Law and disputes">
        <p>These terms are governed by the laws of India. Courts in Lucknow, Uttar Pradesh have jurisdiction.</p>
      </Clause>

      <Clause title="Privacy">
        <p>How we handle your data is in the <Link href="/privacy">Privacy policy</Link>.</p>
      </Clause>
    </LegalPage>
  );
}
