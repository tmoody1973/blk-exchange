import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0e0e0e] py-12 px-4" style={{ fontFamily: "'Courier New', monospace" }}>
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="font-mono text-sm text-white/50 hover:text-white transition-colors">
          ← Back
        </Link>

        <h1 className="text-2xl font-bold text-white uppercase tracking-widest mt-6 mb-8">
          Privacy Policy
        </h1>

        <p className="text-xs text-white/30 mb-8">Last updated: March 31, 2026</p>

        <div className="space-y-6 text-sm text-white/70 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-white uppercase tracking-wider mb-2">What BLK Exchange Is</h2>
            <p>
              BLK Exchange is a free financial literacy education tool. It is a stock market
              simulation using fictional companies. No real money is involved. No real financial
              transactions take place. BLK Exchange does not provide investment advice, and nothing
              in the app should be interpreted as a recommendation to buy or sell any real security.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white uppercase tracking-wider mb-2">Age Requirements</h2>
            <p>
              BLK Exchange is intended for users aged 13 and older. Users under 13 may not create
              {`an account without verifiable parental consent, in compliance with the Children's`}
              Online Privacy Protection Act (COPPA). If we learn that a user under 13 has created
              an account without parental consent, we will delete the account and associated data.
            </p>
            <p className="mt-2">
              Users aged 13-17 may use BLK Exchange. We encourage parents and guardians to
              participate in their child&#39;s use of the platform. Our Parents & Educators guide
              is available at blkexchange.com/guide.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white uppercase tracking-wider mb-2">What Data We Collect</h2>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Name and email address (via Clerk authentication or Google OAuth)</li>
              <li>Trading activity within the simulation (buys, sells, portfolio holdings)</li>
              <li>Knowledge Vault progress (which financial concepts you have unlocked)</li>
              <li>Session data (duration, events experienced, debrief text)</li>
              <li>Leaderboard scores and achievements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-white uppercase tracking-wider mb-2">How AI Processes Your Data</h2>
            <p>
              BLK Exchange uses AI services to provide educational features:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
              <li><strong className="text-white">Claude (Anthropic)</strong> receives your portfolio holdings and trading history to generate personalized coaching, session debriefs, and answers to your investing questions.</li>
              <li><strong className="text-white">Groq</strong> generates market events and classifies news articles. It does not receive your personal data.</li>
              <li><strong className="text-white">ElevenLabs</strong> converts market alert text to speech. It does not receive your personal data.</li>
            </ul>
            <p className="mt-2">
              AI-generated content (coaching, debriefs, events) is educational and should not be
              interpreted as financial advice.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white uppercase tracking-wider mb-2">Data Storage</h2>
            <p>
              Your data is stored on Convex (database) and Clerk (authentication). Both services
              use industry-standard encryption and security practices. Your data is stored in the
              United States.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white uppercase tracking-wider mb-2">We Do Not Sell Your Data</h2>
            <p>
              BLK Exchange does not sell, rent, or share your personal data with third parties
              for marketing purposes. Your data is used solely to provide the educational
              simulation experience.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white uppercase tracking-wider mb-2">Data Retention</h2>
            <p>
              Your data is retained for as long as your account is active. If you request account
              deletion, all associated data (profile, trading history, vault progress, session
              debriefs) will be permanently deleted within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white uppercase tracking-wider mb-2">How to Delete Your Account</h2>
            <p>
              To request account deletion, email the contact below. We will delete your account
              and all associated data within 30 days of receiving your request.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white uppercase tracking-wider mb-2">Classroom Use</h2>
            <p>
              If BLK Exchange is used in a classroom setting, the educational institution is
              responsible for obtaining appropriate parental consent for students under 18.
              Teachers should review our Parents & Educators guide at blkexchange.com/guide.
              For data processing agreements required by your school or district, contact us
              at the email below.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white uppercase tracking-wider mb-2">Not Financial Advice</h2>
            <p>
              BLK Exchange is an educational simulation. All 36 companies are fictional. All
              market events are simulated or AI-generated. No real money is involved. Nothing
              in the app constitutes investment advice. Consult a licensed financial advisor
              before making real investment decisions.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white uppercase tracking-wider mb-2">Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. Changes will be posted on
              this page with an updated date. Continued use of BLK Exchange after changes
              constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white uppercase tracking-wider mb-2">Contact</h2>
            <p>
              Tarik Moody<br />
              Director of Strategy and Innovation, Radio Milwaukee<br />
              blkexchange.com<br />
              For privacy inquiries, data deletion requests, or classroom data processing
              agreements, contact via buymeacoffee.com/tarikmoody.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
