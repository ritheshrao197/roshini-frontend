import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Roshini&rsquo;s Home Products",
  description: "The terms and conditions governing your use of Roshini&rsquo;s Home Products.",
};

const sectionHeading = "text-lg sm:text-xl font-bold mt-8 mb-2";
const paragraph = "text-sm leading-relaxed mb-4";

interface Section {
  title: string;
  body: React.ReactNode;
}

export default function TermsOfServicePage() {
  const sections: Section[] = [
    {
      title: "Overview",
      body: (
        <>
          <p className={paragraph}>
            Welcome to Roshini&rsquo;s Home Products! The terms &ldquo;we&rdquo;, &ldquo;us&rdquo; and &ldquo;our&rdquo; refer to Roshini&rsquo;s Home Products.
            Roshini&rsquo;s Home Products operates this store and website, including all related information, content,
            features, tools, products and services in order to provide you, the customer, with a curated shopping
            experience (the &ldquo;Services&rdquo;).
          </p>
          <p className={paragraph}>
            The below terms and conditions, together with any policies referenced herein (these &ldquo;Terms of Service&rdquo;
            or &ldquo;Terms&rdquo;) describe your rights and responsibilities when you use the Services.
          </p>
          <p className={paragraph}>
            Please read these Terms of Service carefully, as they include important information about your legal
            rights and cover areas such as warranty disclaimers and limitations of liability.
          </p>
          <p className={paragraph}>
            By visiting, interacting with or using our Services, you agree to be bound by these Terms of Service and
            our{" "}
            <Link href="/privacy-policy" className="underline">
              Privacy Policy
            </Link>
            . If you do not agree to these Terms of Service or Privacy Policy, you should not use or access our
            Services.
          </p>
        </>
      ),
    },
    {
      title: "1. Access and Account",
      body: (
        <>
          <p className={paragraph}>
            By agreeing to these Terms of Service, you represent that you are at least the age of majority in your
            state or province of residence, and you have given us your consent to allow any of your minor dependents
            to use the Services on devices you own, purchase or manage.
          </p>
          <p className={paragraph}>
            To use the Services, including accessing or browsing our online store or purchasing any of the products
            or services we offer, you may be asked to provide certain information, such as your email address,
            billing, payment, and shipping information. You represent and warrant that all the information you
            provide is correct, current and complete and that you have all rights necessary to provide this
            information.
          </p>
          <p className={paragraph}>
            You are solely responsible for maintaining the security of your account credentials and for all of your
            account activity. You may not transfer, sell, assign, or license your account to any other person.
          </p>
        </>
      ),
    },
    {
      title: "2. Our Products",
      body: (
        <>
          <p className={paragraph}>
            We have made every effort to provide an accurate representation of our products and services in our
            online store. However, please note that colors or product appearance may differ from how they may
            appear on your screen due to the type of device you use to access the store and your device settings
            and configuration.
          </p>
          <p className={paragraph}>
            We do not warrant that the appearance or quality of any products or services purchased by you will meet
            your expectations or be the same as depicted or rendered in our online store.
          </p>
          <p className={paragraph}>
            All descriptions of products are subject to change at any time without notice at our sole discretion. We
            reserve the right to discontinue any product at any time and may limit the quantities of any products
            that we offer to any person, geographic region or jurisdiction, on a case-by-case basis.
          </p>
        </>
      ),
    },
    {
      title: "3. Orders",
      body: (
        <>
          <p className={paragraph}>
            When you place an order, you are making an offer to purchase. Roshini&rsquo;s Home Products reserves the right
            to accept or decline your order for any reason at its discretion. Your order is not accepted until
            Roshini&rsquo;s Home Products confirms acceptance. We must receive and process your payment before your order
            is accepted. Please review your order carefully before submitting, as Roshini&rsquo;s Home Products may be
            unable to accommodate cancellation requests after an order is accepted. In the event that we do not
            accept, make a change to, or cancel an order, we will attempt to notify you by contacting the email,
            billing address, and/or phone number provided at the time the order was made.
          </p>
          <p className={paragraph}>
            Your purchases are subject to return or exchange solely in accordance with our refund and returns
            practices. You represent and warrant that your purchases are for your own personal or household use and
            not for commercial resale or export.
          </p>
        </>
      ),
    },
    {
      title: "4. Prices and Billing",
      body: (
        <>
          <p className={paragraph}>
            Prices, discounts and promotions are subject to change without notice. The price charged for a product
            or service will be the price in effect at the time the order is placed and will be set out in your order
            confirmation email. Unless otherwise expressly stated, posted prices do not include taxes, shipping,
            handling, customs or import charges.
          </p>
          <p className={paragraph}>
            Prices posted in our online store may be different from prices offered in physical stores or in online
            or other stores operated by third parties. We may offer, from time to time, promotions on the Services
            that may affect pricing and that are governed by terms and conditions separate from these Terms. If
            there is a conflict between the terms for a promotion and these Terms, the promotion terms will govern.
          </p>
          <p className={paragraph}>
            You agree to provide current, complete and accurate purchase, payment and account information for all
            purchases made at our store. You agree to promptly update your account and other information, including
            your email address, payment details and expiration dates, so that we can complete your transactions and
            contact you as needed.
          </p>
          <p className={paragraph}>
            You represent and warrant that (i) the payment information you provide is true, correct, and complete,
            (ii) you are duly authorized to use such payment method for the purchase, (iii) charges incurred by you
            will be honored by your payment provider, and (iv) you will pay charges incurred by you at the posted
            prices, including shipping and handling charges and all applicable taxes, if any.
          </p>
        </>
      ),
    },
    {
      title: "5. Shipping and Delivery",
      body: (
        <p className={paragraph}>
          We are not liable for shipping and delivery delays. All delivery times are estimates only and are not
          guaranteed. We are not responsible for delays caused by shipping carriers, customs processing, or events
          outside our control. Once we transfer products to the carrier, title and risk of loss passes to you.
        </p>
      ),
    },
    {
      title: "6. Intellectual Property",
      body: (
        <>
          <p className={paragraph}>
            These Terms permit you to use the Services for your personal, non-commercial use only. You must not
            reproduce, distribute, modify, create derivative works of, publicly display, publicly perform,
            republish, download, store, or transmit any of the material on the Services without our prior written
            consent. Except as expressly provided herein, nothing in these Terms grants or shall be construed as
            granting a license or other rights to you under any patent, trademark, copyright, or other intellectual
            property of Roshini&rsquo;s Home Products or any third party. Unauthorized use of the Services may be a
            violation of applicable intellectual property laws. All rights not expressly granted herein are reserved
            by Roshini&rsquo;s Home Products.
          </p>
          <p className={paragraph}>
            Roshini&rsquo;s Home Products&rsquo;s names, logos, product and service names, designs, and slogans are trademarks
            of Roshini&rsquo;s Home Products or its affiliates or licensors. You must not use such trademarks without our
            prior written permission. All other names, logos, product and service names, designs, and slogans on
            the Services are the trademarks of their respective owners.
          </p>
        </>
      ),
    },
    {
      title: "7. Optional Tools",
      body: (
        <>
          <p className={paragraph}>
            You may be provided with access to tools offered by third parties as part of the Services, which we
            neither monitor nor have any control nor input over.
          </p>
          <p className={paragraph}>
            You acknowledge and agree that we provide access to such tools &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without any
            warranties, representations or conditions of any kind and without any endorsement. We shall have no
            liability whatsoever arising from or relating to your use of optional third-party tools. Any use by you
            of the optional tools offered through the site is entirely at your own risk and discretion, and you
            should ensure that you are familiar with and approve of the terms on which tools are provided by the
            relevant third-party provider(s).
          </p>
        </>
      ),
    },
    {
      title: "8. Third-Party Links",
      body: (
        <p className={paragraph}>
          The Services may contain materials and hyperlinks to websites provided or operated by third parties
          (including any embedded third-party functionality). We are not responsible for examining or evaluating
          the content or accuracy of any third-party materials or websites you choose to access. If you decide to
          leave the Services to access these materials or third-party sites, you do so at your own risk. We are not
          liable for any harm or damages related to your access of any third-party websites, or your purchase or use
          of any products, services, resources, or content on any third-party websites.
        </p>
      ),
    },
    {
      title: "9. Feedback",
      body: (
        <p className={paragraph}>
          If you submit, upload, post, email, or otherwise transmit any ideas, suggestions, feedback, reviews,
          proposals, plans, or other content (collectively, &ldquo;Feedback&rdquo;), you grant us a perpetual, worldwide,
          sublicensable, royalty-free license to use, reproduce, modify, publish, distribute and display such
          Feedback in any medium for any purpose, including for commercial use. You represent and warrant that you
          own or have all necessary rights to all Feedback, and that your Feedback will comply with these Terms. We
          are under no obligation to maintain your Feedback in confidence, to pay compensation for it, or to respond
          to it.
        </p>
      ),
    },
    {
      title: "10. Errors, Inaccuracies and Omissions",
      body: (
        <p className={paragraph}>
          Occasionally there may be information on or in the Services that contains typographical errors,
          inaccuracies or omissions that may relate to product descriptions, pricing, promotions, offers, product
          shipping charges, transit times and availability. We reserve the right to correct any errors,
          inaccuracies or omissions, and to change or update information or cancel orders if any information is
          inaccurate at any time without prior notice (including after you have submitted your order).
        </p>
      ),
    },
    {
      title: "11. Prohibited Uses",
      body: (
        <p className={paragraph}>
          You may access and use the Services for lawful purposes only. You may not use the Services to violate any
          law or regulation; to infringe our intellectual property rights or those of others; to harass, abuse, or
          harm any person; to transmit false or misleading information, spam, or malicious code; to impersonate any
          person or entity; to collect or track the personal information of others; or to interfere with or
          circumvent the security features of the Services. We reserve the right to suspend, disable, or terminate
          your account at any time, without notice, if we determine that you have violated any part of these Terms.
        </p>
      ),
    },
    {
      title: "12. Termination",
      body: (
        <p className={paragraph}>
          We may terminate this agreement or your access to the Services (or any part thereof) in our sole
          discretion at any time without notice, and you will remain liable for all amounts due up to and including
          the date of termination. Provisions that by their nature should survive termination — including
          Intellectual Property, Feedback, Disclaimer of Warranties, Limitation of Liability, and Indemnification —
          will continue to apply.
        </p>
      ),
    },
    {
      title: "13. Disclaimer of Warranties",
      body: (
        <>
          <p className={paragraph}>
            The information presented on or through the Services is made available solely for general information
            purposes. We do not warrant the accuracy, completeness, or usefulness of this information. Any reliance
            you place on such information is strictly at your own risk.
          </p>
          <p className={paragraph} style={{ textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.02em" }}>
            Except as expressly stated by Roshini&rsquo;s Home Products, the Services and all products offered through
            the Services are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; for your use, without any representation,
            warranties or conditions of any kind, either express or implied, including all implied warranties or
            conditions of merchantability, merchantable quality, fitness for a particular purpose, durability,
            title, and non-infringement. We do not guarantee, represent or warrant that your use of the Services
            will be uninterrupted, timely, secure or error-free. Some jurisdictions limit or do not allow the
            disclaimer of implied or other warranties, so the above disclaimer may not apply to you.
          </p>
        </>
      ),
    },
    {
      title: "14. Limitation of Liability",
      body: (
        <p className={paragraph} style={{ textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.02em" }}>
          To the fullest extent provided by law, in no case shall Roshini&rsquo;s Home Products, our partners, directors,
          officers, employees, affiliates, agents, contractors, service providers or licensors be liable for any
          injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of
          any kind, including, without limitation, lost profits, lost revenue, lost savings, loss of data,
          replacement costs, or any similar damages, whether based in contract, tort (including negligence), strict
          liability or otherwise, arising from your use of any of the Services or any products procured using the
          Services, or for any other claim related in any way to your use of the Services or any product, even if
          advised of their possibility.
        </p>
      ),
    },
    {
      title: "15. Indemnification",
      body: (
        <p className={paragraph}>
          You agree to indemnify, defend and hold harmless Roshini&rsquo;s Home Products and our affiliates, partners,
          officers, directors, employees, agents, contractors, licensors, and service providers from any losses,
          damages, liabilities or claims, including reasonable attorneys&rsquo; fees, payable to any third party due to or
          arising out of (1) your breach of these Terms of Service or the documents they incorporate by reference,
          (2) your violation of any law or the rights of a third party, or (3) your access to and use of the
          Services.
        </p>
      ),
    },
    {
      title: "16. Severability",
      body: (
        <p className={paragraph}>
          In the event that any provision of these Terms of Service is determined to be unlawful, void or
          unenforceable, such provision shall nonetheless be enforceable to the fullest extent permitted by
          applicable law, and the unenforceable portion shall be deemed to be severed from these Terms of Service.
          Such determination shall not affect the validity and enforceability of any other remaining provisions.
        </p>
      ),
    },
    {
      title: "17. Waiver; Entire Agreement",
      body: (
        <>
          <p className={paragraph}>
            The failure of us to exercise or enforce any right or provision of these Terms of Service shall not
            constitute a waiver of such right or provision.
          </p>
          <p className={paragraph}>
            These Terms of Service and any policies or operating rules posted by us on this site constitute the
            entire agreement and understanding between you and us and govern your use of the Services, superseding
            any prior or contemporaneous agreements, communications and proposals, whether oral or written, between
            you and us.
          </p>
        </>
      ),
    },
    {
      title: "18. Assignment",
      body: (
        <p className={paragraph}>
          You may not delegate, transfer or assign this Agreement or any of your rights or obligations under these
          Terms without our prior written consent, and any such attempt will be null and void. We may transfer,
          assign, or delegate these Terms and our rights and obligations without consent or notice to you.
        </p>
      ),
    },
    {
      title: "19. Governing Law",
      body: (
        <p className={paragraph}>
          These Terms of Service and any separate agreements whereby we provide you Services shall be governed by
          and construed in accordance with the laws of India. You and Roshini&rsquo;s Home Products consent to the venue
          and personal jurisdiction of the courts of India.
        </p>
      ),
    },
    {
      title: "20. Changes to These Terms of Service",
      body: (
        <p className={paragraph}>
          You can review the most current version of the Terms of Service at any time on this page. We reserve the
          right, in our sole discretion, to update, change, or replace any part of these Terms of Service by posting
          updates and changes to our website. It is your responsibility to check our website periodically for
          changes. Your continued use of or access to the Services following the posting of any changes to these
          Terms of Service constitutes acceptance of those changes.
        </p>
      ),
    },
    {
      title: "21. Contact Information",
      body: (
        <p className={paragraph}>
          Questions about these Terms of Service should be sent to us at{" "}
          <a href="mailto:roshinishomeproducts@gmail.com" className="underline">
            roshinishomeproducts@gmail.com
          </a>
          , by phone at{" "}
          <a href="tel:+919591896917" className="underline">
            +91 95918 96917
          </a>
          , or by mail at Roshini House, Near Paddyarabettu, Perinje, Karnataka 574242, India.
        </p>
      ),
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg, #FFFDF9)", color: "var(--text, #2C1A0E)" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#B0886A" }}>
          Legal
        </p>
        <h1
          className="text-3xl sm:text-4xl font-bold mb-2"
          style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "#6B3E26" }}
        >
          Terms of Service
        </h1>
        <p className="text-sm mb-10" style={{ color: "#7A5C45" }}>
          Please read these terms carefully before using our Services.
        </p>

        <div style={{ color: "#3a2a1c" }}>
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className={sectionHeading} style={{ color: "#6B3E26" }}>
                {s.title}
              </h2>
              {s.body}
            </section>
          ))}
        </div>

        <div className="mt-12 pt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm" style={{ borderTop: "1px solid #E8D5BC" }}>
          <Link href="/privacy-policy" className="font-bold hover:underline" style={{ color: "#6B3E26" }}>
            Privacy Policy →
          </Link>
          <Link href="/refund-policy" className="font-bold hover:underline" style={{ color: "#6B3E26" }}>
            Refund Policy →
          </Link>
          <Link href="/shipping-policy" className="font-bold hover:underline" style={{ color: "#6B3E26" }}>
            Shipping Policy →
          </Link>
        </div>
      </div>
    </div>
  );
}
