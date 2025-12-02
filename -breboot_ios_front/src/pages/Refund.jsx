import React from "react";
import Header from "../components/Header";

const RefundData = [
    {
        list: [
            "Once a purchase or payment is made, it is non-refundable and non-cancellable.",
            "We do not offer refunds or cancellations for any purchases made within the app.",
        ]
    }
];


const Refund = () => {
    return (
        <div className="min-h-screen poppins-regular">
            <Header title="Refund or Cancellation policy" />
            <div className="px-4 py-4 pb-24">
                {/* <p className="text-sm text-gray-600 mb-4">
                    Last Updated: March 1, 2025
                </p> */}
                <div className="bg-white rounded-2xl border border-black/15 mb-6 p-4">
                    <div className="space-y-4 text-gray-700">
                        {RefundData.map((section, index) => (
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

export default Refund;
