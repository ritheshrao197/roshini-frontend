import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Roshini's Home Products",
  description: "How Roshini's Home Products collects, uses, and protects your personal information.",
};

const sectionHeading = "text-xl sm:text-2xl font-bold mt-10 mb-3";
const paragraph = "text-sm leading-relaxed mb-4";
const list = "list-disc pl-5 space-y-2 text-sm leading-relaxed mb-4";

export default function PrivacyPolicyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-sm mb-10" style={{ color: "#7A5C45" }}>
          Last updated: May 9, 2026
        </p>

        <div style={{ color: "#3a2a1c" }}>
          <p className={paragraph}>
            Roshini&rsquo;s Home Products operates this store and website, including all related information, content,
            features, tools, products and services, in order to provide you, the customer, with a curated shopping
            experience (the &ldquo;Services&rdquo;). This Privacy Policy describes how we collect, use, and disclose your
            personal information when you visit, use, or make a purchase or other transaction using the Services or
            otherwise communicate with us. If there is a conflict between our{" "}
            <Link href="/terms-of-service" className="underline">
              Terms of Service
            </Link>{" "}
            and this Privacy Policy, this Privacy Policy controls with respect to the collection, processing, and
            disclosure of your personal information.
          </p>
          <p className={paragraph}>
            Please read this Privacy Policy carefully. By using and accessing any of the Services, you acknowledge
            that you have read this Privacy Policy and understand the collection, use, and disclosure of your
            information as described in this Privacy Policy.
          </p>

          <h2 className={sectionHeading} style={{ color: "#6B3E26" }}>
            Personal Information We Collect or Process
          </h2>
          <p className={paragraph}>
            When we use the term &ldquo;personal information,&rdquo; we are referring to information that identifies or can
            reasonably be linked to you or another person. Personal information does not include information that is
            collected anonymously or that has been de-identified, so that it cannot identify or be reasonably linked
            to you. We may collect or process the following categories of personal information, including
            inferences drawn from this personal information, depending on how you interact with the Services, where
            you live, and as permitted or required by applicable law:
          </p>
          <ul className={list}>
            <li>
              <strong>Contact details</strong> including your name, address, billing address, shipping address,
              phone number, and email address.
            </li>
            <li>
              <strong>Financial information</strong> including credit card, debit card, and financial account
              numbers, payment card information, financial account information, transaction details, form of
              payment, payment confirmation and other payment details.
            </li>
            <li>
              <strong>Account information</strong> including your username, password, security questions,
              preferences and settings.
            </li>
            <li>
              <strong>Transaction information</strong> including the items you view, put in your cart, add to your
              wishlist, or purchase, return, exchange or cancel and your past transactions.
            </li>
            <li>
              <strong>Communications with us</strong> including the information you include in communications with
              us, for example, when sending a customer support inquiry.
            </li>
            <li>
              <strong>Device information</strong> including information about your device, browser, or network
              connection, your IP address, and other unique identifiers.
            </li>
            <li>
              <strong>Usage information</strong> including information regarding your interaction with the
              Services, including how and when you interact with or navigate the Services.
            </li>
          </ul>

          <h2 className={sectionHeading} style={{ color: "#6B3E26" }}>
            Personal Information Sources
          </h2>
          <p className={paragraph}>We may collect personal information from the following sources:</p>
          <ul className={list}>
            <li>
              <strong>Directly from you</strong> including when you create an account, visit or use the Services,
              communicate with us, or otherwise provide us with your personal information;
            </li>
            <li>
              <strong>Automatically through the Services</strong> including from your device when you use our
              products or services or visit our websites, and through the use of cookies and similar technologies;
            </li>
            <li>
              <strong>From our service providers</strong> including when we engage them to enable certain technology
              and when they collect or process your personal information on our behalf;
            </li>
            <li>
              <strong>From our partners or other third parties.</strong>
            </li>
          </ul>

          <h2 className={sectionHeading} style={{ color: "#6B3E26" }}>
            How We Use Your Personal Information
          </h2>
          <p className={paragraph}>
            Depending on how you interact with us or which of the Services you use, we may use personal information
            for the following purposes:
          </p>
          <ul className={list}>
            <li>
              <strong>Provide, Tailor, and Improve the Services.</strong> We use your personal information to
              provide you with the Services, including to perform our contract with you, to process your payments,
              to fulfill your orders, to remember your preferences and items you are interested in, to send
              notifications to you related to your account, to process purchases, returns, exchanges or other
              transactions, to create, maintain and otherwise manage your account, to arrange for shipping, to
              facilitate any returns and exchanges, to enable you to post reviews, and to create a customized
              shopping experience for you, such as recommending products related to your purchases.
            </li>
            <li>
              <strong>Marketing and Advertising.</strong> We use your personal information for marketing and
              promotional purposes, such as to send marketing, advertising and promotional communications by email,
              text message or postal mail, and to show you online advertisements for products or services, including
              based on items you previously have purchased or added to your cart and other activity on the
              Services.
            </li>
            <li>
              <strong>Security and Fraud Prevention.</strong> We use your personal information to authenticate your
              account, to provide a secure payment and shopping experience, detect, investigate or take action
              regarding possible fraudulent, illegal, unsafe, or malicious activity, protect public safety, and to
              secure our services. If you register an account, you are responsible for keeping your account
              credentials safe. We highly recommend that you do not share your username, password or other access
              details with anyone else.
            </li>
            <li>
              <strong>Communicating with You.</strong> We use your personal information to provide you with customer
              support, to be responsive to you, to provide effective services to you and to maintain our business
              relationship with you.
            </li>
            <li>
              <strong>Legal Reasons.</strong> We use your personal information to comply with applicable law or
              respond to valid legal process, including requests from law enforcement or government agencies, to
              investigate or participate in civil discovery, potential or actual litigation, or other adversarial
              legal proceedings, and to enforce or investigate potential violations of our terms or policies.
            </li>
          </ul>

          <h2 className={sectionHeading} style={{ color: "#6B3E26" }}>
            How We Disclose Personal Information
          </h2>
          <p className={paragraph}>
            In certain circumstances, we may disclose your personal information to third parties for legitimate
            purposes subject to this Privacy Policy. Such circumstances may include:
          </p>
          <ul className={list}>
            <li>
              With vendors and other third parties who perform services on our behalf (e.g. IT management, payment
              processing, data analytics, customer support, cloud storage, fulfillment and shipping).
            </li>
            <li>
              With business and marketing partners to provide marketing services and advertise to you. Our business
              and marketing partners will use your information in accordance with their own privacy notices.
              Depending on where you reside, you may have a right to direct us not to share information about you
              to show you targeted advertisements and marketing based on your online activity with different
              merchants and websites.
            </li>
            <li>
              When you direct, request us or otherwise consent to our disclosure of certain information to third
              parties, such as to ship you products or through your use of social media widgets or login
              integrations.
            </li>
            <li>With our affiliates or otherwise within our corporate group.</li>
            <li>
              In connection with a business transaction such as a merger or bankruptcy, to comply with any
              applicable legal obligations (including to respond to subpoenas, search warrants and similar
              requests), to enforce any applicable terms of service or policies, and to protect or defend the
              Services, our rights, and the rights of our users or others.
            </li>
          </ul>

          <h2 className={sectionHeading} style={{ color: "#6B3E26" }}>
            Third Party Websites and Links
          </h2>
          <p className={paragraph}>
            The Services may provide links to websites or other online platforms operated by third parties. If you
            follow links to sites not affiliated or controlled by us, you should review their privacy and security
            policies and other terms and conditions. We do not guarantee and are not responsible for the privacy or
            security of such sites, including the accuracy, completeness, or reliability of information found on
            these sites. Our inclusion of such links does not, by itself, imply any endorsement of the content on
            such platforms or of their owners or operators, except as disclosed on the Services.
          </p>

          <h2 className={sectionHeading} style={{ color: "#6B3E26" }}>
            Children&rsquo;s Data
          </h2>
          <p className={paragraph}>
            The Services are not intended to be used by children, and we do not knowingly collect any personal
            information about children under the age of majority in your jurisdiction. If you are the parent or
            guardian of a child who has provided us with their personal information, you may contact us using the
            contact details below to request that it be deleted.
          </p>

          <h2 className={sectionHeading} style={{ color: "#6B3E26" }}>
            Security and Retention of Your Information
          </h2>
          <p className={paragraph}>
            Please be aware that no security measures are perfect or impenetrable, and we cannot guarantee &ldquo;perfect
            security.&rdquo; Any information you send to us may not be secure while in transit. We recommend that you do
            not use unsecure channels to communicate sensitive or confidential information to us.
          </p>
          <p className={paragraph}>
            How long we retain your personal information depends on different factors, such as whether we need the
            information to maintain your account, to provide you with Services, comply with legal obligations,
            resolve disputes or enforce other applicable contracts and policies.
          </p>

          <h2 className={sectionHeading} style={{ color: "#6B3E26" }}>
            Your Rights and Choices
          </h2>
          <p className={paragraph}>
            Depending on where you live, you may have some or all of the rights listed below in relation to your
            personal information. However, these rights are not absolute, may apply only in certain circumstances
            and, in certain cases, we may decline your request as permitted by law.
          </p>
          <ul className={list}>
            <li>
              <strong>Right to Access / Know.</strong> You may have a right to request access to personal
              information that we hold about you.
            </li>
            <li>
              <strong>Right to Delete.</strong> You may have a right to request that we delete personal information
              we maintain about you.
            </li>
            <li>
              <strong>Right to Correct.</strong> You may have a right to request that we correct inaccurate personal
              information we maintain about you.
            </li>
            <li>
              <strong>Right of Portability.</strong> You may have a right to receive a copy of the personal
              information we hold about you and to request that we transfer it to a third party, in certain
              circumstances and with certain exceptions.
            </li>
            <li>
              <strong>Managing Communication Preferences.</strong> We may send you promotional emails, and you may
              opt out of receiving these at any time by using the unsubscribe option displayed in our emails to you.
              If you opt out, we may still send you non-promotional emails, such as those about your account or
              orders that you have made.
            </li>
          </ul>
          <p className={paragraph}>
            You may exercise any of these rights by contacting us using the contact details below. We will not
            discriminate against you for exercising any of these rights. We may need to verify your identity before
            we can process your requests, as permitted or required under applicable law.
          </p>

          <h2 className={sectionHeading} style={{ color: "#6B3E26" }}>
            Complaints
          </h2>
          <p className={paragraph}>
            If you have complaints about how we process your personal information, please contact us using the
            contact details below. Depending on where you live, you may have the right to appeal our decision, or
            lodge your complaint with your local data protection authority.
          </p>

          <h2 className={sectionHeading} style={{ color: "#6B3E26" }}>
            International Transfers
          </h2>
          <p className={paragraph}>
            Please note that we may transfer, store and process your personal information outside the country you
            live in. If we transfer your personal information out of the European Economic Area or the United
            Kingdom, we will rely on recognized transfer mechanisms like the European Commission&rsquo;s Standard
            Contractual Clauses, or any equivalent contracts issued by the relevant competent authority of the UK, as
            relevant, unless the data transfer is to a country that has been determined to provide an adequate level
            of protection.
          </p>

          <h2 className={sectionHeading} style={{ color: "#6B3E26" }}>
            Changes to This Privacy Policy
          </h2>
          <p className={paragraph}>
            We may update this Privacy Policy from time to time, including to reflect changes to our practices or
            for other operational, legal, or regulatory reasons. We will post the revised Privacy Policy on this
            website, update the &ldquo;Last updated&rdquo; date and provide notice as required by applicable law.
          </p>

          <h2 className={sectionHeading} style={{ color: "#6B3E26" }}>
            Contact
          </h2>
          <p className={paragraph}>
            Should you have any questions about our privacy practices or this Privacy Policy, or if you would like
            to exercise any of the rights available to you, please contact us at{" "}
            <a href="mailto:roshinishomeproducts@gmail.com" className="underline">
              roshinishomeproducts@gmail.com
            </a>
            , call{" "}
            <a href="tel:+919591896917" className="underline">
              +91 95918 96917
            </a>
            , or write to us at Roshini House, Near Paddyarabettu, Perinje, Karnataka 574242, India.
          </p>
        </div>

        <div className="mt-12 pt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm" style={{ borderTop: "1px solid #E8D5BC" }}>
          <Link href="/terms-of-service" className="font-bold hover:underline" style={{ color: "#6B3E26" }}>
            Terms of Service →
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
