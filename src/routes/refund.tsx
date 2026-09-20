import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";

import { site } from "@/data/site";
import { pageMeta } from "@/lib/seo";
import grainsBg from "@/assets/bg-light-flour.jpg";

export const Route = createFileRoute("/refund")({
  head: () => ({
    ...pageMeta({
      title: "Cancellation and Refund Policy | Vimash Manufacturing",
      description:
        "Cancellation and refund policy for Vimash Manufacturing Private Limited - Order cancellation, refund processing, and return conditions.",
      path: "/refund",
    }),
  }),
  component: RefundPage,
});

function RefundPage() {
  return (
    <>
      <PageHero
        image={grainsBg}
        eyebrow="Legal"
        title="Cancellation and Refund Policy"
        description="Information about order cancellation, returns, and refunds for industrial machines."
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
                  This Cancellation and Refund Policy applies to orders placed with{" "}
                  <strong className="text-charcoal">{site.name}</strong> for commercial atta chakki
                  pulverizers and masala grinding machines. Please read this policy carefully before
                  placing your order.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Our machines are industrial equipment, often customized or configured to meet
                  specific customer requirements. This policy reflects the nature of our products and
                  manufacturing process.
                </p>
              </div>

              {/* Order Cancellation */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  2. Order Cancellation
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  You may request to cancel your order by contacting us immediately. Cancellation
                  requests should be made as soon as possible after placing the order.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  To request a cancellation, please contact us at:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      Phone:{" "}
                      <a href={site.phoneHref} className="font-semibold text-accent hover:underline">
                        {site.phone}
                      </a>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      Email:{" "}
                      <a
                        href={`mailto:${site.email}`}
                        className="font-semibold text-accent hover:underline"
                      >
                        {site.email}
                      </a>
                    </span>
                  </li>
                </ul>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Please provide your order details, contact information, and reason for cancellation
                  when making your request.
                </p>
              </div>

              {/* Cancellation Before Dispatch */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  3. Cancellation Before Dispatch
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Cancellation requests made before the machine has been dispatched from our factory
                  will be processed subject to the following conditions:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Standard Products:</strong> If manufacturing
                      has not yet started or the machine is a standard model in stock, cancellation
                      may be accepted with minimal or no charges.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Customized Orders:</strong> If the machine
                      has been customized to your specifications or manufacturing work has already
                      begun, cancellation charges may apply to cover costs already incurred.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Partial Manufacturing:</strong> Any costs
                      related to materials purchased, manufacturing work completed, or processing
                      charges may be deducted from your refund amount.
                    </span>
                  </li>
                </ul>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  The applicable charges and refund amount will be communicated to you based on the
                  stage of order fulfillment at the time of your cancellation request.
                </p>
              </div>

              {/* Cancellation After Dispatch */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  4. Cancellation After Dispatch
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Once a machine has been dispatched from our factory, cancellation requests may not
                  be accepted. The machine is in transit and will be delivered to the address you
                  provided.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  If you refuse delivery or do not accept the machine upon arrival without valid
                  reasons (such as damage or defects), you may be responsible for return shipping
                  costs and restocking charges.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Valid reasons for refusing delivery include visible external damage to the packaging,
                  delivery of the wrong product, or machine delivered not matching your confirmed order.
                </p>
              </div>

              {/* Payment and Refund Processing */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  5. Payment and Refund Processing
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  If your cancellation request is approved and you are eligible for a refund, the
                  refund will be processed as follows:
                </p>

                <h3 className="mt-5 font-display text-base font-bold text-charcoal">
                  Razorpay Payment Refunds:
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  For payments made through Razorpay (credit card, debit card, UPI, net banking), the
                  refund will be initiated to the original payment method used at the time of purchase.
                  The time taken for the refund to reflect in your account depends on your bank or
                  payment provider, typically within 5-7 business days after the refund is initiated by
                  us.
                </p>

                <h3 className="mt-5 font-display text-base font-bold text-charcoal">
                  PhonePe Payment Refunds:
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  For payments made through PhonePe, refunds will be processed back to your PhonePe
                  wallet or the original payment source linked to your PhonePe account. Refund
                  processing time is typically instant to 3 business days, depending on PhonePe's
                  processing.
                </p>

                <h3 className="mt-5 font-display text-base font-bold text-charcoal">
                  Bank Transfer and Other Payment Methods:
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  For payments made via bank transfer or other direct payment methods, refunds will be
                  processed to the bank account from which the payment was made. Please provide your
                  complete bank account details (account number, IFSC code, and account holder name) to
                  facilitate the refund. Processing may take 7-10 business days.
                </p>

                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                  We will notify you by email or phone once the refund has been initiated. Any
                  transaction charges, payment gateway fees, or convenience fees paid at the time of
                  purchase are non-refundable as these are charged by third-party payment processors.
                </p>
              </div>

              {/* Damaged Wrong or Defective Products */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  6. Damaged, Wrong, or Defective Products
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  We take great care to ensure that every machine is tested before dispatch. However,
                  if you receive a machine that is damaged in transit, the wrong product, or has a
                  manufacturing defect, please follow these steps:
                </p>

                <h3 className="mt-5 font-display text-base font-bold text-charcoal">
                  Immediate Inspection:
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Inspect the machine thoroughly upon delivery. Check the packaging for any visible
                  damage, and verify that the product matches your order (model number, HP, and
                  specifications).
                </p>

                <h3 className="mt-5 font-display text-base font-bold text-charcoal">
                  Report Within 48 Hours:
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  If you find any damage, receive the wrong product, or discover a defect, you must
                  report it to us within 48 hours of delivery. Contact us immediately at{" "}
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
                  .
                </p>

                <h3 className="mt-5 font-display text-base font-bold text-charcoal">
                  Documentation Required:
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  To process your claim, please provide the following:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>Clear photographs of the damaged parts or packaging</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>Photos showing the product label, model number, and serial number</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      A brief description of the issue (damage, wrong product, or defect details)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>Your order number and delivery details</span>
                  </li>
                </ul>

                <h3 className="mt-5 font-display text-base font-bold text-charcoal">
                  Resolution:
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  After reviewing your claim and documentation, we will:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      Arrange for replacement of the damaged or wrong product at no additional cost
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      Provide spare parts or technical support to repair minor defects, if applicable
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>Arrange pickup of the defective machine and issue a full refund</span>
                  </li>
                </ul>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  The resolution will depend on the nature and severity of the issue. Our goal is to
                  resolve the matter quickly and to your satisfaction.
                </p>
              </div>

              {/* Refund Eligibility */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  7. Refund Eligibility
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Refunds are applicable only in the following situations:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Approved Cancellation:</strong> Your
                      cancellation request was made before dispatch and has been approved by our team
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Damaged Product:</strong> The machine was
                      damaged during transit and you have provided required documentation within 48
                      hours of delivery
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Wrong Product Delivered:</strong> You
                      received a different machine than what you ordered
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Verified Manufacturing Defect:</strong> The
                      machine has a confirmed manufacturing defect that was not caused by misuse,
                      improper installation, or external factors
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Order Cancellation by Vimash:</strong> We
                      are unable to fulfill your order due to product unavailability, pricing errors,
                      or other reasons
                    </span>
                  </li>
                </ul>
              </div>

              {/* Refund Method and Timeline */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  8. Refund Method and Processing Timeline
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Refunds will be processed to the original payment method used for the purchase.
                </p>

                <h3 className="mt-5 font-display text-base font-bold text-charcoal">
                  Refund Processing Steps:
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Step 1 - Verification (2-3 business days):</strong> We will
                      review your cancellation or return request, verify documentation, and determine
                      eligibility
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Step 2 - Approval (1 business day):</strong> Once approved,
                      we will calculate the refund amount (after any applicable deductions) and notify you
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Step 3 - Initiation (1-2 business days):</strong> The refund
                      will be initiated to your payment method from our end
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Step 4 - Credit:</strong> The refund will
                      appear in your account based on your bank or payment provider's processing time
                    </span>
                  </li>
                </ul>

                <h3 className="mt-5 font-display text-base font-bold text-charcoal">
                  Expected Timeline After Initiation:
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      Razorpay payments: 5-7 business days
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      PhonePe payments: Instant to 3 business days
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      Bank transfer: 7-10 business days
                    </span>
                  </li>
                </ul>

                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                  Total processing time from request to credit in your account may range from 7-21
                  business days depending on the verification process and your payment method. You will
                  receive an email or phone notification once the refund has been processed from our end.
                  If you do not receive the refund within the expected timeline, please check with your
                  bank or payment provider first, then contact us for assistance.
                </p>
              </div>

              {/* Non-Refundable Situations */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  9. Cases Where Cancellation or Refund May Not Be Applicable
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Cancellations and refunds will not be accepted or may be subject to charges in the
                  following situations:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Change of Mind:</strong> You decide you no
                      longer want the machine after it has been dispatched or delivered, without any
                      defect or damage
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Damage After Delivery:</strong> The machine
                      was damaged due to mishandling, improper installation, misuse, or negligence
                      after delivery
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Late Reporting:</strong> You failed to
                      report damage or defects within 48 hours of delivery
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Machine Already Used:</strong> The machine
                      has been installed, operated, or put into production use
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Missing Parts or Damage:</strong> The
                      machine is returned incomplete, with missing parts, or has been damaged or
                      tampered with after delivery
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Customized Specifications:</strong> The
                      machine was built to your specific custom requirements and manufacturing has
                      been completed
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      <strong className="text-charcoal">Normal Wear and Tear:</strong> Issues
                      arising from normal operation, wear and tear, or lack of maintenance
                    </span>
                  </li>
                </ul>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  In such cases, you will remain responsible for the full payment of the machine.
                  Return shipping costs, inspection fees, and restocking charges may also apply if
                  the machine is returned without valid reasons.
                </p>
              </div>

              {/* Warranty Issues */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  10. Warranty-Related Issues
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  This Cancellation and Refund Policy does not cover warranty-related issues that
                  arise after the machine has been installed and put into operation.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  If you experience any issues with your machine after installation that are related
                  to manufacturing defects or product performance, such matters will be handled
                  according to the warranty terms provided with your machine at the time of purchase.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Warranty terms, coverage, duration, and conditions are specific to each machine and
                  are provided in writing with your invoice and purchase documentation. Please refer
                  to your warranty documentation or contact us for clarification on warranty coverage.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Warranty claims do not automatically entitle you to a refund. Warranty coverage
                  typically includes repair, replacement of defective parts, or replacement of the
                  machine, as per the warranty terms.
                </p>
              </div>

              {/* Customer Responsibilities */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  11. Customer Responsibilities
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  To ensure smooth cancellation and refund processing, customers are responsible for:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      Providing accurate order details and contact information when requesting
                      cancellation
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      Inspecting the machine immediately upon delivery and reporting any issues within
                      48 hours
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      Providing clear photographs and documentation for damage or defect claims
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      Keeping the machine in its original condition with all parts, accessories, and
                      packaging intact if a return is required
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      Cooperating with our team during the verification and assessment process
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>
                      Providing bank account details or payment information required for refund
                      processing
                    </span>
                  </li>
                </ul>
              </div>

              {/* Changes to Policy */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  12. Changes to This Policy
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  We reserve the right to update or modify this Cancellation and Refund Policy at any
                  time. Any changes will be posted on this page with an updated "Last Updated" date.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Your order will be subject to the policy in effect at the time you placed your
                  order. We encourage you to review this policy before placing an order.
                </p>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">
                  13. Contact Us
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  If you have any questions about this Cancellation and Refund Policy, or if you need
                  assistance with a cancellation or refund request, please contact us:
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
                  Our team will respond to your cancellation or refund request promptly and work with
                  you to resolve the matter fairly and efficiently.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
