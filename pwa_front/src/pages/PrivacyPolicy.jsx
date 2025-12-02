import React from "react";
import Header from "../components/Header";

const privacyData = [
    {
        content: "Breboot values your privacy and is committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and protect your data when you use the Breboot app."
    },
    {
        title: "1. Information We Collect",
        content: "We collect the following types of information when you use the App:",
        list: [
            "Personal Information: Name, email address, phone number of doctors and Patients",
            "Transaction Data: Payment and billing information, including your purchase of medicines.",
            "Usage Data: Information on how you interact with the App, including device information, IP addresses, and log data."
        ]
    },
    {
        title: "2. How We Use Your Information",
        content: "We use the information we collect for the following purposes:",
        list: [
            "Providing Services: To facilitate medicine purchases, consultations with dieticians, and fitness challenges.",
            "Improving the App: To enhance functionality, troubleshoot issues, and analyze usage patterns.",
            "Marketing: To send you promotional content (you may opt out at any time).",
            "Compliance: To comply with legal obligations, including medical regulations and privacy laws.",
            "Customer Support: To provide customer service and resolve issues or inquiries."
        ]
    },
    {
        title: "3. Sharing Your Information",
        content: "We may share your personal information with third parties in the following circumstances:",
        list: [
            "Healthcare Providers: To facilitate consultations with dieticians or doctors.",
            "Service Providers: To help with operations, such as payment processors, hosting services, and analytics.",
            "Legal Requirements: We may disclose your information if required by law or in response to legal requests, such as court orders or subpoenas.",
        ]
    },
    {
        title: "4. Data Security",
        content: "We take reasonable steps to protect your personal information using administrative, physical, and technical security measures. However, no method of data transmission or storage is completely secure, and we cannot guarantee the absolute security of your data.",
    }, {
        title: "5. Your Rights",
        content: "Depending on your location, you may have the right to:",
        list: [
            "Access and update your personal data.",
            "Delete your account and personal information (subject to legal and operational constraints).",
            "Opt out of marketing communications.",
            "Object to the processing of your data for certain purposes.",
            "To exercise these rights, please contact us at [Insert Contact Email]."
        ]
    },{
        title: "6. Cookies and Tracking Technologies",
        content: "Breboot uses cookies and similar technologies to improve your experience, personalize content, and analyze usage. You can manage cookie preferences through your browser settings.",
    },{
        title: "7. Third-Party Links",
        content: "The App may contain links to third-party websites, services, or advertisements. We are not responsible for the privacy practices or content of these external sites. Please review their privacy policies before sharing personal information."
    },{
        title: "8. Children’s Privacy",
        content: "Breboot is not intended for children under the age of 13. We do not knowingly collect or solicit personal information from children. If we discover that we have inadvertently collected data from children, we will take steps to delete it."
    },{
        title: "9. Changes to This Privacy Policy",
        content:"We may update this Privacy Policy from time to time. Any changes will be reflected on this page, and the “Last Updated” date will be updated accordingly. We encourage you to review this Policy periodically."
    },{
        title: "10. Contact Us",
        content: "If you have any questions or concerns regarding our Privacy Policy or the handling of your personal data, please contact us at: "
    },

];


const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen poppins-regular">
            <Header title="Privacy Policy for Breboot" />
            <div className="px-4 py-4 pb-24">
                <p className="text-sm text-gray-600 mb-4">
                    Last Updated: March 1, 2025
                </p>
                <div className="bg-white rounded-2xl border border-black/15 mb-6 p-4">
                    <div className="space-y-4 text-gray-700">
                        {privacyData.map((section, index) => (
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

export default PrivacyPolicy;
