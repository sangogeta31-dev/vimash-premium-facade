import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";

import { site } from "@/data/site";
import { pageMeta } from "@/lib/seo";
import grainsBg from "@/assets/bg-light-flour.jpg";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    ...pageMeta({
      title: "Privacy Policy | Vimash Manufacturing",
      description:
        "Privacy policy for Vimash Manufacturing Pvt. Ltd. - How we collect, use, and protect your personal information.",
      path: "/privacy",
    }),
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <>
      <PageHero
        image={grainsBg}
        eyebrow="Legal"
        title="Privacy Policy"
        description="Your privacy is important to us. This policy explains how we handle your personal information."
      />

      <section className="mx-auto max-w-4xl px-5 py-12 lg:px-8 lg:py-20">
        <div>
          <div className="prose prose-sm max-w-none">
            <p className="text-xs text-muted-foreground">
              Last Updated: January 15, 2025
            </p>

            <div className="mt-8 space-y-8">
              {/* Introduction */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  1. Introduction
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  <strong className="text-charcoal">{site.name}</strong> ("Vimash," "we," "us,"
                  or "our") is committed to protecting your privacy. This Privacy Policy explains
                  what personal information we collect through our website, how we use it, and the
                  measures we take to keep it secure.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  By using our website or submitting information through our enquiry forms, you
                  consent to the collection and use of your information as described in this policy.
                </p>
              </div>

              {/* Information We Collect */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  2. Information We Collect
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  We collect personal information that you voluntarily provide to us when you:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>Submit an enquiry or callback request form</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>Contact us by phone, email, or WhatsApp</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>Place an order or request a quotation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>Create an account or log in to our system</span>
                  </li>
                </ul>

                <h3 className="mt-5 font-display text-base font-bold text-charcoal">
                  Personal Information We Collect:
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Name:</strong> Your full name or business
                      name
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Mobile Number:</strong> Your contact
                      phone number
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Email Address:</strong> Your email for
                      communication and order updates
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Location Information:</strong> City,
                      state, and pincode for delivery and service purposes
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Product Interest:</strong> Information
                      about the machine model, HP, and specifications you're interested in
                    </span>
                  </li>
                </ul>

                <h3 className="mt-5 font-display text-base font-bold text-charcoal">
                  Technical Information We Collect:
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">IP Address:</strong> Your device's IP
                      address for security, fraud prevention, and rate limiting to prevent abuse
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Browser and Device Information:</strong>{" "}
                      Basic technical details to ensure our website works properly on your device
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Session Data:</strong> Temporary session
                      information to maintain your login state and shopping cart
                    </span>
                  </li>
                </ul>
              </div>

              {/* How We Use Your Information */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  3. How We Use Your Information
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  We use the personal information we collect for the following purposes:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Enquiry Processing:</strong> To respond to
                      your callback requests and product enquiries
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Sales Communication:</strong> To contact you
                      with pricing, quotations, product information, and delivery details
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Order Processing:</strong> To process your
                      orders, arrange delivery, and provide after-sales support
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Payment Processing:</strong> To process
                      payments through our payment gateways (Razorpay and PhonePe)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Customer Support:</strong> To provide
                      installation guidance, technical support, and spare parts assistance
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Security and Fraud Prevention:</strong> To
                      protect our website from abuse, prevent fraudulent orders, and ensure secure
                      transactions
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Business Operations:</strong> To maintain
                      customer records, improve our products and services, and comply with legal
                      obligations
                    </span>
                  </li>
                </ul>
              </div>

              {/* CRM and Data Storage */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  4. CRM and Data Storage
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Lead and customer information collected through our website is stored securely in
                  our database and synchronized with our Customer Relationship Management (CRM)
                  system for lead management and customer communication purposes.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  We use <strong className="text-charcoal">Vidu CRM</strong> to manage customer
                  enquiries, track communications, and maintain customer records. This helps our sales
                  team provide you with timely responses and better service.
                </p>
              </div>

              {/* Third-Party Services */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  5. Sharing Your Information with Third Parties
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  We do not sell, rent, or trade your personal information to third parties. However,
                  we may share your information with trusted service providers who help us operate our
                  business:
                </p>

                <h3 className="mt-5 font-display text-base font-bold text-charcoal">
                  Payment Processors:
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  When you make a payment through our website, your payment information is processed
                  by <strong className="text-charcoal">Razorpay</strong> and{" "}
                  <strong className="text-charcoal">PhonePe</strong>. These are secure third-party
                  payment gateways that handle payment transactions in compliance with applicable
                  payment security standards. We do not store your complete credit card or debit card
                  details on our servers.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Your use of these payment services is governed by their respective privacy policies
                  and terms of service.
                </p>

                <h3 className="mt-5 font-display text-base font-bold text-charcoal">
                  Delivery and Logistics Partners:
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  We share your name, address, phone number, and delivery details with shipping and
                  logistics companies to deliver your machine to your location.
                </p>

                <h3 className="mt-5 font-display text-base font-bold text-charcoal">
                  Legal Requirements:
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  We may disclose your information if required by law, court order, government
                  authority, or to protect our rights, property, or safety, or that of our customers
                  and the public.
                </p>
              </div>

              {/* Data Security */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  6. Data Security
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  We take the security of your personal information seriously and implement
                  appropriate technical and organizational measures to protect it:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Encryption:</strong> Payment information is
                      encrypted during transmission using secure protocols
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Access Controls:</strong> Only authorized
                      personnel have access to customer data, and access is restricted based on job
                      function
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Input Validation:</strong> All form
                      submissions are validated and sanitized to prevent malicious data entry
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Rate Limiting:</strong> We use IP-based rate
                      limiting to prevent abuse and automated attacks on our forms
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Secure Storage:</strong> Customer data is
                      stored in secure databases with restricted access
                    </span>
                  </li>
                </ul>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  While we strive to protect your personal information, no method of transmission or
                  storage is 100% secure. We cannot guarantee absolute security, but we continuously
                  work to improve our security measures.
                </p>
              </div>

              {/* Data Retention */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  7. Data Retention
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  We retain your personal information for as long as necessary to fulfill the purposes
                  for which it was collected:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Enquiry Data:</strong> Lead and enquiry
                      information is retained to process your request and for follow-up communication
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Order Data:</strong> Purchase and order
                      information is retained for warranty support, accounting, tax compliance, and
                      business records as required by law
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Customer Support Records:</strong>{" "}
                      Communication history is retained to provide better support and resolve any
                      issues
                    </span>
                  </li>
                </ul>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  If you request deletion of your data, we will delete or anonymize it within a
                  reasonable timeframe, except where retention is required by law or for legitimate
                  business purposes such as warranty claims, pending transactions, or legal disputes.
                </p>
              </div>

              {/* Your Rights */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  8. Your Rights
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Under applicable Indian privacy laws, you have certain rights regarding your
                  personal information:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Right to Access:</strong> You can request a
                      copy of the personal information we hold about you
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Right to Correction:</strong> You can request
                      that we correct any inaccurate or incomplete information
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Right to Deletion:</strong> You can request
                      deletion of your personal information, subject to legal and contractual
                      obligations
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Right to Withdraw Consent:</strong> If you
                      have provided consent for processing your data, you can withdraw it at any time
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Right to Opt-Out:</strong> You can opt out of
                      receiving marketing communications from us
                    </span>
                  </li>
                </ul>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  To exercise any of these rights, please contact us using the details provided at
                  the end of this policy.
                </p>
              </div>

              {/* Consent and Withdrawal */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  9. Consent and Withdrawal
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  By submitting your information through our website or enquiry forms, you consent to
                  the collection, use, and processing of your personal information as described in
                  this Privacy Policy.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  You may withdraw your consent at any time by contacting us. However, withdrawal of
                  consent may affect our ability to provide you with our services, process your
                  orders, or respond to your enquiries.
                </p>
              </div>

              {/* Cookies and Tracking */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  10. Cookies and Tracking Technologies
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Our website uses minimal technical cookies necessary for basic functionality such as
                  maintaining your session and shopping cart. We do not currently use third-party
                  analytics or advertising tracking on our website.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  If we implement analytics or tracking in the future, we will update this policy and
                  notify you accordingly.
                </p>
              </div>

              {/* Children's Privacy */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  11. Children's Privacy
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Our website and products are intended for businesses and adults. We do not knowingly
                  collect personal information from children under the age of 18. If we become aware
                  that we have collected information from a child, we will take steps to delete it
                  promptly.
                </p>
              </div>

              {/* Changes to This Policy */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  12. Changes to This Privacy Policy
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  We may update this Privacy Policy from time to time to reflect changes in our
                  practices, legal requirements, or business operations. Any changes will be posted on
                  this page with an updated "Last Updated" date.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  We encourage you to review this policy periodically. Your continued use of our
                  website after changes are posted constitutes your acceptance of the updated policy.
                </p>
              </div>

              {/* Applicable Law */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  13. Applicable Law
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  This Privacy Policy is governed by the laws of India. We comply with applicable
                  Indian privacy and data protection laws and regulations, including the Digital
                  Personal Data Protection Act, 2023 (DPDPA), the Information Technology Act, 2000,
                  and the Information Technology (Reasonable Security Practices and Procedures and
                  Sensitive Personal Data or Information) Rules, 2011.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  As required under the DPDPA, we process your personal data lawfully, transparently,
                  and for specified purposes with your consent. You have the right to access,
                  correct, update, and erase your personal data, and to withdraw consent at any time.
                </p>
              </div>

              {/* Grievance Officer and Contact */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  14. Grievance Officer and Contact Information
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  In accordance with the Digital Personal Data Protection Act, 2023 and the
                  Information Technology Act, 2000, we have appointed a Grievance Officer to address
                  any concerns or complaints regarding your personal data.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  If you have any questions, concerns, or complaints about this Privacy Policy or how
                  we handle your personal information, or if you wish to exercise your rights, please
                  contact us:
                </p>
                <div className="mt-4 space-y-2 text-sm text-charcoal">
                  <p>
                    <strong>{site.name}</strong>
                  </p>
                  <p>
                    <strong>Grievance Officer:</strong> Customer Relations Manager
                  </p>
                  <p>{site.address}</p>
                  <p>
                    Phone:{" "}
                    <a href={site.phoneHref} className="text-accent hover:underline">
                      {site.phone}
                    </a>
                  </p>
                  <p>
                    Email:{" "}
                    <a href={`mailto:${site.email}`} className="text-accent hover:underline">
                      {site.email}
                    </a>
                  </p>
                  <p>Business Hours: {site.hours}</p>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  We will acknowledge your complaint within 24 hours and resolve it within 15 days
                  from the date of receipt, as per the requirements of applicable law. If you are not
                  satisfied with our response, you may escalate the matter to the Data Protection
                  Board of India.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
