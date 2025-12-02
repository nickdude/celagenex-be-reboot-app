import React from "react";
import Header from "../components/Header";

const termsData = [
  {
    title: "1. Introduction",
    content: "Welcome to Breboot, a mobile application designed to facilitate a seamless experience for healthcare professionals (doctors) and patients. By accessing or using the Breboot app (the 'App'), you agree to comply with and be bound by these Terms and Conditions, along with the Privacy Policy. If you do not agree with these Terms, please refrain from using the App."
  },
  {
    title: "2. Services Provided",
    content: "Breboot offers a range of services that are intended to connect patients with healthcare professionals and enable the purchase of medicines. These services include:",
    list: [
      "Medicine Purchase: Patients can browse, purchase, and receive medicines through licensed pharmacy partners.",
      "Fitness Challenges for Doctors: Doctors can participate in physical fitness challenges designed to promote health and well-being.",
      "Dietician Consultations: Patients or Doctors can book online consultations with certified dieticians for personalized nutrition advice."
    ]
  },
  {
    content: "These services are designed to improve the healthcare experience for both patients and professionals, but all users agree to use the services within the bounds of these Terms."
  },
  {
    title: "3. Eligibility",
    content: "To use the App, you must be: ",
    list: [
      "A doctor with a valid medical license or a healthcare professional authorized to practice within your jurisdiction, or",
      "A patient who is at least 18 years old or has the consent of a legal guardian.",
      "By accessing and using Breboot, you confirm that you meet these requirements. If you are a minor, you must obtain permission from a parent or guardian."
    ]
  },
  {
    title: "4. User Accounts",
    content: "To use certain features of the App, you must register for an account. When registering, you agree to provide accurate, complete, and current information. You are responsible for maintaining the confidentiality of your login details and for all activities that occur under your account.",
    list: [
      "Doctors: Must provide medical credentials, including medical license information.",
      "Patients: Must provide basic health and contact information.",
      "You agree to notify us immediately if you believe your account has been compromised."
    ]
  },
  {
    title: "5. Doctor’s Fitness Challenges",
    content: "Doctors may participate in fitness challenges within the App. These challenges are designed to encourage healthy lifestyle practices and engage doctors in physical activity. Participation is entirely voluntary and does not replace professional health or medical advice."
  }, {
    content: "The App will not hold any doctor responsible for injuries or health complications that may arise as a result of participating in fitness challenges. Each doctor is responsible for their own physical condition and should consult with a healthcare provider before participating."
  },
  {
    title: "6. Medicine Purchase",
    content: "Breboot allows patients to purchase medicines from licensed pharmacies. By using the App, you acknowledge that:",
    list: [
      "Breboot is not a pharmacy; we act as an intermediary to facilitate the purchase of medicines.",
      "The medicines offered are subject to availability.",
      "We take reasonable measures to ensure that the pharmacies we partner with meet regulatory requirements. However, we do not guarantee the quality, efficacy, or safety of medicines sold through the App.",
      "Patients must provide necessary prescriptions, where applicable, when purchasing certain medications. All sales are subject to the laws and regulations of the relevant jurisdiction."
    ]
  },
  {
    title: "7. Consultations with Dieticians",
    content: "Breboot offers consultations with certified dieticians. By booking a consultation, you agree that:",
    list: [
      "The dietician’s advice is based on their professional expertise and knowledge.",
      "You understand that the dietician’s advice does not constitute medical treatment or diagnosis.",
      "Breboot is not responsible for the accuracy, quality, or outcome of the consultations.",
      "If you have any specific medical condition…"
    ]
  },
  {
    title: "8. Content Ownership",
    list: [
      "All content provided through the App, including text, images, logos, videos, and software, is owned by Breboot or licensed to us by third parties. All rights are reserved.",
      "Users are prohibited from using this content for commercial purposes, duplicating, or distributing it without permission."
    ]
  },
  {
    title: "9. Prohibited Activities",
    content: "Users of Breboot agree not to:",
    list: [
      "Impersonate any person or entity.",
      "Violate any laws or regulations.",
      "Engage in any harmful or abusive behavior towards other users.",
      "Upload or transmit viruses, malware, or other harmful content.",
      "Use the App to promote illegal activities, violence, or discrimination.",
      "Attempt to gain unauthorized access to any part of the App, including its servers or databases.",
      "Breboot reserves the right to suspend or terminate your account if you engage in any prohibited activities."
    ]
  },
  {
    title: "10. Termination of Account",
    content: "Breboot reserves the right to suspend or terminate your account for any reason, including but not limited to:",
    list: [
      "Violations of these Terms and Conditions.",
      "Engaging in fraudulent, harmful, or illegal activities."
    ]
  },
  {
    title: "11. Limitation of Liability",
    content: "Breboot is not liable for any damages, losses, or liabilities resulting from the use of the App, including but not limited to:",
    list: [
      "Loss of data.",
      "Errors in health advice provided by dieticians or doctors.",
      "Issues arising from the purchase of medicines through our platform."
    ]
  },
  {
    title: "12. Indemnification",
    content: "You agree to indemnify and hold Breboot and its affiliates harmless from any claims, damages, liabilities, and expenses (including legal fees) arising from your use of the App, your violation of these Terms, or your infringement of any rights of others."
  },
  {
    title: "13. Modifications to Terms",
    content: "Breboot may update or modify these Terms and Conditions at any time. Any changes will be posted on this page, and the 'Last Updated' date will be updated. You are responsible for reviewing these Terms periodically."
  },
  {
    title: "14. Governing Law",
    content: "These Terms and Conditions shall be governed by the laws, without regard to its conflict of law provisions."
  },
];


const TermsAndCondition = () => {
  return (
    <div className="min-h-screen poppins-regular">
      <Header title="Terms and Conditions for Breboot" />
      <div className="px-4 py-4 pb-24">
        {/* <p className="text-sm text-gray-600 mb-4">
          Last Updated: February 28, 2025
        </p> */}
        <div className="bg-white rounded-2xl border border-black/15 mb-6 p-4">
          <div className="space-y-4 text-gray-700">
            {termsData.map((section, index) => (
              <section key={index}>
                <h3 className="text-md font-semibold mb-2">{section.title}</h3>
                <p className="text-sm">{section.content}</p>
                {section.list && (
                  <ul className="list-disc pl-5 text-sm mt-1">
                    {section.list.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndCondition;
