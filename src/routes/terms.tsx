import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";

import { site } from "@/data/site";
import { pageMeta } from "@/lib/seo";
import grainsBg from "@/assets/bg-light-flour.jpg";

export const Route = createFileRoute("/terms")({
  head: () => ({
    ...pageMeta({
      title: "Terms and Conditions | Vimash Manufacturing",
      description:
        "Terms and conditions for purchasing atta chakki and masala pulverizer machines from Vimash Manufacturing India Private Limited",
      path: "/terms",
    }),
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <>
      <PageHero
        image={grainsBg}
        eyebrow="Legal"
        title="Terms and Conditions"
        description="Please read these terms carefully before using our website or purchasing our products."
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
                  These Terms and Conditions govern your use of the website operated by{" "}
                  <strong className="text-charcoal">{site.name}</strong> (referred to as "Vimash,"
                  "we," "us," or "our") and the purchase of our products. By accessing this website
                  or placing an order, you agree to be bound by these terms.
                </p>
              </div>

              {/* Website Usage */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  2. Website Usage
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  This website provides information about our commercial atta chakki pulverizers and
                  masala grinding machines. You may browse and use this website for lawful purposes
                  only. You agree not to misuse this website or interfere with its normal operation.
                </p>
              </div>

              {/* Product Information */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  3. Product Information and Specifications
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  We manufacture atta chakki pulverizers and masala pulverizers in various HP
                  configurations (5 HP to 20 HP). All products are made in our own factory in
                  Ahmedabad, Gujarat. Every machine undergoes a full-load trial before dispatch to
                  ensure quality and performance.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Product specifications, images, and descriptions on this website are provided for
                  general information. Minor variations in appearance, dimensions, or specifications
                  may occur due to manufacturing improvements or material availability. We reserve
                  the right to modify product specifications without prior notice.
                </p>
              </div>

              {/* Pricing and Taxes */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  4. Pricing and Taxes
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Prices displayed on our website are indicative and may vary based on
                  specifications, customization, and current market conditions. Final pricing will be
                  confirmed during the order process or through direct communication with our team.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  All prices are exclusive of applicable taxes (including GST), shipping charges, and
                  any other statutory levies unless explicitly stated otherwise. Goods and Services
                  Tax (GST) and other taxes will be calculated and added to your final invoice as per
                  prevailing Indian tax laws.
                </p>
              </div>

              {/* Orders and Payments */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  5. Orders and Payments
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Orders can be placed through our website, by phone at{" "}
                  <a href={site.phoneHref} className="font-semibold text-accent hover:underline">
                    {site.phone}
                  </a>
                  , or by emailing us at{" "}
                  <a
                    href={`mailto:${site.email}`}
                    className="font-semibold text-accent hover:underline"
                  >
                    {site.email}
                  </a>
                  . All orders are subject to acceptance by Vimash Manufacturing.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  We reserve the right to refuse or cancel any order at our discretion, including but
                  not limited to cases of product unavailability, pricing errors, or suspected
                  fraudulent activity.
                </p>
              </div>

              {/* Payment Methods */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  6. Payment Methods
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  We accept payments through multiple secure methods including online payment via
                  Razorpay and PhonePe, bank transfer, and other mutually agreed methods. Payment
                  terms will be communicated at the time of order confirmation.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  When you make online payments through Razorpay or PhonePe, your transaction is
                  processed securely by these third-party payment gateways. You will be subject to
                  the terms and conditions of those payment providers in addition to these terms. We
                  do not store your complete payment card or UPI details on our servers.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  All payment information is encrypted and handled in compliance with applicable
                  payment security standards. In case of payment failures or transaction disputes,
                  please contact us immediately or reach out to the respective payment gateway's
                  customer support.
                </p>
              </div>

              {/* Delivery and Shipping */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  7. Delivery and Shipping
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  We provide PAN India delivery for all our machines. Delivery timelines will be
                  communicated at the time of order confirmation and may vary based on your location,
                  product availability, and manufacturing schedule.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Shipping and handling charges, if applicable, will be calculated based on the
                  delivery location and will be communicated during the order process. We will make
                  reasonable efforts to meet delivery timelines, but delays may occur due to
                  unforeseen circumstances.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Risk of loss and title for products pass to you upon delivery. Please inspect the
                  machine upon delivery and report any damage or defects immediately.
                </p>
              </div>

              {/* Installation */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  8. Installation and Support
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  We provide after-sales support and guidance for installation. Installation services,
                  if required, can be arranged and will be subject to additional charges based on
                  location and requirements. Please contact our team for installation assistance.
                </p>
              </div>

              {/* Warranty */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">9. Warranty</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  All machines are tested before dispatch to ensure they are in good working
                  condition. Any warranty terms applicable to your purchase will be communicated at
                  the time of sale and will be provided in writing with your invoice.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Warranty coverage, if provided, typically covers manufacturing defects and does not
                  cover damage caused by misuse, improper installation, lack of maintenance, or
                  normal wear and tear. Specific warranty terms and conditions will be detailed in
                  your purchase documentation.
                </p>
              </div>

              {/* Cancellation and Refund */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  10. Cancellation and Refund Policy
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Order cancellations must be requested before the machine has been dispatched.
                  Please contact us immediately if you wish to cancel your order. Cancellation
                  requests after dispatch may not be accepted.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Refunds, if applicable, will be processed after deducting any costs already
                  incurred for manufacturing, customization, or processing your order. The refund
                  policy will be communicated during the order process and will depend on the stage
                  of order fulfillment.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Since our machines are industrial equipment often customized to customer
                  requirements, returns may not be accepted except in cases of verified manufacturing
                  defects or if the wrong product was delivered.
                </p>
              </div>

              {/* Product Images and Variations */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  11. Product Images and Specification Variations
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Product images displayed on this website are for illustrative purposes. Actual
                  products may vary slightly in color, finish, or minor details due to photography,
                  screen settings, or manufacturing variations.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  We continuously improve our products and may make modifications to specifications,
                  materials, or design without prior notice. Such changes are made to enhance product
                  quality and performance and do not affect the core functionality of the machine.
                </p>
              </div>

              {/* Intellectual Property */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  12. Intellectual Property
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  All content on this website, including text, images, logos, designs, and graphics,
                  is the property of {site.name} or its licensors and is protected by intellectual
                  property laws. You may not reproduce, distribute, or use any content from this
                  website without our prior written permission.
                </p>
              </div>

              {/* Limitation of Liability */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  13. Limitation of Liability
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  To the maximum extent permitted by law, Vimash Manufacturing shall not be liable
                  for any indirect, incidental, consequential, or punitive damages arising from the
                  use of our website or products, including but not limited to loss of profits, data,
                  or business interruption.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Our total liability for any claim related to the products or services shall not
                  exceed the amount paid by you for the specific product giving rise to the claim.
                </p>
              </div>

              {/* Force Majeure */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  14. Force Majeure
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  We shall not be liable for any failure or delay in fulfilling our obligations due
                  to circumstances beyond our reasonable control, including but not limited to acts of
                  God, natural disasters, war, civil unrest, strikes, government actions, pandemics,
                  material shortages, or failure of suppliers or transportation.
                </p>
              </div>

              {/* Privacy */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">15. Privacy</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  We collect and process personal information in accordance with applicable privacy
                  laws. Any personal information you provide through our website or during the order
                  process will be used solely for processing your order, providing support, and
                  communicating with you about our products and services.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  We do not sell or share your personal information with third parties except as
                  necessary to fulfill your order (such as sharing shipping information with delivery
                  partners) or as required by law.
                </p>
              </div>

              {/* Governing Law */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  16. Governing Law and Jurisdiction
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  These Terms and Conditions shall be governed by and construed in accordance with
                  the laws of India, including but not limited to the Indian Contract Act, 1872, the
                  Sale of Goods Act, 1930, the Consumer Protection Act, 2019, and other applicable
                  laws. Any disputes arising out of or relating to these terms or your use of our
                  website or products shall be subject to the exclusive jurisdiction of the courts in
                  Ahmedabad, Gujarat, India.
                </p>
              </div>

              {/* Changes to Terms */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  17. Changes to Terms
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  We reserve the right to update or modify these Terms and Conditions at any time
                  without prior notice. Changes will be effective immediately upon posting to this
                  website. Your continued use of the website after changes are posted constitutes
                  your acceptance of the revised terms.
                </p>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  18. Contact Information
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  If you have any questions about these Terms and Conditions, please contact us:
                </p>
                <div className="mt-4 space-y-2 text-sm text-charcoal">
                  <p>
                    <strong>{site.name}</strong>
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
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
