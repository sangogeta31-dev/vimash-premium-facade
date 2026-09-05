import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";

import { site } from "@/data/site";
import { pageMeta } from "@/lib/seo";
import grainsBg from "@/assets/bg-light-flour.jpg";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    ...pageMeta({
      title: "Shipping and Exchange Policy | Vimash Manufacturing",
      description:
        "Shipping, delivery, and exchange policy for Vimash Manufacturing Pvt. Ltd. - PAN India delivery for industrial pulverizer machines.",
      path: "/shipping",
    }),
  }),
  component: ShippingPage,
});

function ShippingPage() {
  return (
    <>
      <PageHero
        image={grainsBg}
        eyebrow="Legal"
        title="Shipping and Exchange Policy"
        description="Information about delivery, shipping, and product exchange for commercial machines."
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
                  This Shipping and Exchange Policy outlines how{" "}
                  <strong className="text-charcoal">{site.name}</strong> delivers commercial atta
                  chakki pulverizers and masala grinding machines to customers across India, and the
                  process for exchanging products when necessary.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Our machines are manufactured in our factory in Ahmedabad, Gujarat, and shipped to
                  customers throughout India. Each machine undergoes a full-load trial before dispatch
                  to ensure quality and performance.
                </p>
              </div>

              {/* Order Processing */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  2. Order Processing
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Once you place an order, our team will confirm the following details with you:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>Product specifications (model, HP, and any customizations)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>Final pricing including applicable taxes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>Shipping and handling charges based on your delivery location</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>Complete delivery address with contact details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>Estimated delivery timeline</span>
                  </li>
                </ul>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Your order will enter production or be prepared for dispatch once payment is
                  confirmed and all details are verified.
                </p>
              </div>

              {/* Pre-Dispatch Testing */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  3. Pre-Dispatch Testing and Preparation
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Every machine is tested before dispatch to ensure it meets our quality standards:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Full-Load Trial:</strong> Each machine is run
                      on full load to verify performance and operation
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Quality Check:</strong> All components,
                      fittings, and parts are inspected for proper assembly
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Secure Packaging:</strong> Machines are
                      carefully packed to prevent damage during transit
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Documentation:</strong> Invoice, product
                      documentation, and warranty information (if applicable) are prepared
                    </span>
                  </li>
                </ul>
              </div>

              {/* Shipping Across India */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  4. Shipping Across India
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  We provide <strong className="text-charcoal">PAN India delivery</strong> for all our
                  machines. Our shipping service covers all states and union territories of India.
                </p>

                <h3 className="mt-5 font-display text-base font-bold text-charcoal">
                  Delivery Timeline:
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Standard delivery timelines typically range from 5 to 15 business days from the date
                  of dispatch, depending on your location. The exact timeline varies based on several
                  factors:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>Your delivery location and distance from our factory in Ahmedabad, Gujarat</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>Product availability (stock items vs. customized orders requiring manufacturing time)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>Manufacturing schedule for customized specifications (typically 3-7 business days)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>Logistics and courier availability to your area</span>
                  </li>
                </ul>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  The specific delivery timeline for your order will be confirmed at the time of order
                  confirmation. For remote or difficult-to-access locations, additional time may be
                  required.
                </p>

                <h3 className="mt-5 font-display text-base font-bold text-charcoal">
                  Shipping Charges:
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Shipping and handling charges, if applicable, will be calculated based on the
                  delivery location, machine weight, and dimensions. These charges will be communicated
                  clearly during the order process before payment. Final price including shipping, GST,
                  and other applicable taxes will be confirmed during checkout.
                </p>

                <h3 className="mt-5 font-display text-base font-bold text-charcoal">
                  Shipping Partners:
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  We work with reliable logistics and delivery partners to ensure safe dispatch and
                  delivery of machines across India. Your delivery information (name, address, phone
                  number) will be shared with these partners to facilitate delivery to your location.
                </p>
              </div>

              {/* Delivery Process */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  5. Delivery Process
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  When your machine is ready for dispatch, we will notify you with tracking details (if
                  available) and expected delivery date.
                </p>

                <h3 className="mt-5 font-display text-base font-bold text-charcoal">
                  At the Time of Delivery:
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      The delivery person will contact you to confirm availability and delivery time
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      Ensure someone is available at the delivery address to receive the machine
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>Valid ID proof may be required for delivery verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      The machine will be delivered to the ground floor or loading area; additional
                      charges may apply for carrying to upper floors or remote areas
                    </span>
                  </li>
                </ul>

                <h3 className="mt-5 font-display text-base font-bold text-charcoal">
                  Delivery Delays:
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  We make reasonable efforts to meet delivery timelines. However, delays may occur due
                  to unforeseen circumstances such as weather conditions, transport strikes, natural
                  disasters, government restrictions, or other factors beyond our control. We will keep
                  you informed if any delays are expected.
                </p>

                <h3 className="mt-5 font-display text-base font-bold text-charcoal">
                  Risk of Loss:
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Risk of loss and title for products pass to you upon delivery. Once the machine is
                  handed over to you or your representative, you become responsible for its safety and
                  condition.
                </p>
              </div>

              {/* Customer Responsibilities */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  6. Customer Responsibilities at Delivery
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  To ensure a smooth delivery and to protect your rights for exchange or claims, you
                  must:
                </p>

                <h3 className="mt-5 font-display text-base font-bold text-charcoal">
                  Inspect Immediately:
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Thoroughly inspect the machine at the time of delivery before signing the delivery
                  receipt or accepting the package. Check for:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>Visible damage to the outer packaging or carton</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>Correct product model, HP, and specifications as per your order</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>All components, parts, and accessories are included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>Model number and serial number on the machine match the documentation</span>
                  </li>
                </ul>

                <h3 className="mt-5 font-display text-base font-bold text-charcoal">
                  Do Not Accept if Damaged:
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  If you notice any visible external damage to the packaging, refuse to accept the
                  delivery and inform the delivery person immediately. Take photographs of the damaged
                  packaging and contact us right away.
                </p>

                <h3 className="mt-5 font-display text-base font-bold text-charcoal">
                  Note Any Issues on Delivery Receipt:
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  If you notice any issues (damage, wrong product, missing parts) but still choose to
                  accept delivery, make a clear note on the delivery receipt about the issue before
                  signing. This documentation will support your exchange or replacement claim.
                </p>

                <h3 className="mt-5 font-display text-base font-bold text-charcoal">
                  Keep Packaging and Documentation:
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Keep all original packaging, cartons, invoice, and documentation safe. These are
                  required for any exchange, return, or warranty claims.
                </p>
              </div>

              {/* Transit Damage Reporting */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  7. Reporting Transit Damage
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  If your machine is damaged during transit, you must report it to us within{" "}
                  <strong className="text-charcoal">48 hours of delivery</strong>.
                </p>

                <h3 className="mt-5 font-display text-base font-bold text-charcoal">
                  Steps to Report Transit Damage:
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Step 1:</strong> Contact us immediately at{" "}
                      <a href={site.phoneHref} className="font-semibold text-accent hover:underline">
                        {site.phone}
                      </a>{" "}
                      or{" "}
                      <a
                        href={`mailto:${site.email}`}
                        className="font-semibold text-accent hover:underline"
                      >
                        {site.email}
                      </a>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Step 2:</strong> Provide clear photographs of:
                      <ul className="ml-6 mt-2 space-y-1">
                        <li>• Damaged packaging (all sides)</li>
                        <li>• Damaged parts or components</li>
                        <li>• Product label showing model and serial number</li>
                        <li>• Delivery receipt (if you noted damage)</li>
                      </ul>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Step 3:</strong> Share your order number,
                      invoice details, and delivery date
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Step 4:</strong> Describe the damage or issue
                      in detail
                    </span>
                  </li>
                </ul>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Our team will review your claim and arrange for exchange, replacement, or repair as
                  appropriate.
                </p>
              </div>

              {/* Wrong or Missing Products */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  8. Wrong Product or Missing Components
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  If you receive the wrong machine or find that components or parts are missing, you
                  must report it within <strong className="text-charcoal">48 hours of delivery</strong>.
                </p>

                <h3 className="mt-5 font-display text-base font-bold text-charcoal">
                  Wrong Product Delivered:
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  If the machine delivered does not match your order (different model, HP, or
                  specifications), contact us immediately with:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>Photos of the product label, model number, and serial number</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>Copy of your order confirmation and invoice</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>Clear description of what was ordered vs. what was delivered</span>
                  </li>
                </ul>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  We will arrange for pickup of the wrong product and deliver the correct machine at no
                  additional cost.
                </p>

                <h3 className="mt-5 font-display text-base font-bold text-charcoal">
                  Missing Components or Parts:
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  If any components, accessories, or parts that should have been included with the
                  machine are missing, notify us immediately. We will:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>Verify the missing items against the standard package contents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>Ship the missing components to you as soon as possible</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>Cover the shipping cost for sending the missing items</span>
                  </li>
                </ul>
              </div>

              {/* Exchange and Replacement */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  9. Exchange and Replacement Procedure
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Exchanges are provided in the following situations:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Transit Damage:</strong> Machine was damaged
                      during shipping and reported within 48 hours
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Wrong Product:</strong> You received a
                      different machine than what you ordered
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Manufacturing Defect:</strong> Machine has a
                      verified manufacturing defect discovered within 48 hours of delivery
                    </span>
                  </li>
                </ul>

                <h3 className="mt-5 font-display text-base font-bold text-charcoal">
                  Exchange Process:
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      Contact our team with your claim and required documentation (photos, invoice,
                      order details)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>Our team will review and verify your claim</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      If approved, we will arrange pickup of the defective or wrong machine (at no cost
                      to you)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      A replacement machine will be prepared and dispatched to you once the original is
                      received back
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>No additional shipping charges will apply for exchanges due to our error</span>
                  </li>
                </ul>

                <h3 className="mt-5 font-display text-base font-bold text-charcoal">
                  When Exchange is Not Applicable:
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Exchanges will not be provided in the following cases:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>Damage occurred after delivery due to mishandling or improper use</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>Machine has already been installed or put into operation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>Issues reported after 48 hours of delivery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>Change of mind or customer preference after receiving the correct product</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      Product is incomplete, has been tampered with, or original packaging is not
                      available
                    </span>
                  </li>
                </ul>
              </div>

              {/* Inspection Requirements */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  10. Inspection Requirements for Exchange
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  To be eligible for exchange, the machine must meet the following conditions:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Unused Condition:</strong> Machine has not been
                      installed, operated, or put into production use
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Complete Product:</strong> All parts,
                      components, and accessories are intact and included
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Original Packaging:</strong> Machine is in its
                      original packaging with cartons, padding, and protective materials
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Documentation:</strong> Invoice, warranty card
                      (if provided), and all documentation are included
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">No Tampering:</strong> Product labels, serial
                      numbers, and seals are intact and have not been removed or altered
                    </span>
                  </li>
                </ul>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Our team will inspect the returned machine upon receipt. If the machine does not meet
                  these conditions, the exchange may not be processed and the product may be returned
                  to you.
                </p>
              </div>

              {/* Installation and Support */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  11. Installation and After-Sales Support
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  We provide after-sales support and guidance for installation.
                </p>

                <h3 className="mt-5 font-display text-base font-bold text-charcoal">
                  Installation Guidance:
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Our team can provide guidance and support for installing your machine. If you require
                  on-site installation services, these can be arranged and will be subject to
                  additional charges based on location and requirements.
                </p>

                <h3 className="mt-5 font-display text-base font-bold text-charcoal">
                  Technical Support:
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  For any questions about operation, maintenance, or troubleshooting, please contact
                  our support team at{" "}
                  <a href={site.phoneHref} className="font-semibold text-accent hover:underline">
                    {site.phone}
                  </a>
                  .
                </p>
              </div>

              {/* Warranty Matters */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  12. Warranty-Related Issues
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  This Shipping and Exchange Policy covers issues that occur during transit and
                  delivery. It does not cover warranty-related issues that arise after the machine has
                  been installed and put into operation.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  If you experience any performance issues, defects, or failures after installation and
                  use, such matters will be handled according to the warranty terms provided with your
                  machine at the time of purchase.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Warranty terms, coverage, and conditions are specific to each machine and are
                  provided in writing with your invoice and purchase documentation. Please refer to
                  your warranty documentation or contact us for assistance with warranty claims.
                </p>
              </div>

              {/* Contact and Support */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  13. Contact and Support
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  For any questions about shipping, delivery, or exchange, or to report an issue with
                  your order, please contact us:
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
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Our team is committed to ensuring your machine reaches you safely and in perfect
                  condition. We will work with you promptly to resolve any shipping or delivery issues.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
