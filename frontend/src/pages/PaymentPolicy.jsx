import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    ShieldCheck,
    CreditCard,
    Lock,
    Clock,
    XCircle,
    FileText,
    ChevronDown,
    ChevronUp,
    Package,
    Truck,
    CheckCircle,
    ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const highlights = [
    {
        icon: <ShieldCheck className="w-10 h-10 text-emerald-600" />,
        title: "End-to-End Security",
        desc: "Payments are encrypted using advanced SSL protocols. Your card details are never stored on our servers.",
    },
    {
        icon: <CreditCard className="w-10 h-10 text-emerald-600" />,
        title: "Multiple Options",
        desc: "Pay securely via UPI, Net Banking, Debit/Credit Cards, or COD (Cash on Delivery).",
    },
    {
        icon: <Clock className="w-10 h-10 text-emerald-600" />,
        title: "Strict Cancellation Rules",
        desc: "Cancellation is not accepted if requested within 24 hours of estimated delivery.",
    },
    {
        icon: <XCircle className="w-10 h-10 text-emerald-600" />,
        title: "Refund Guidelines",
        desc: "Refunds are allowed only for defective or incorrect items. Used/damaged items are non-refundable.",
    },
];

const steps = [
    { icon: <Package className="w-8 h-8 text-emerald-600" />, label: "Order Placed" },
    { icon: <CreditCard className="w-8 h-8 text-emerald-600" />, label: "Payment Processed" },
    { icon: <Truck className="w-8 h-8 text-emerald-600" />, label: "Out for Delivery" },
    { icon: <CheckCircle className="w-8 h-8 text-emerald-600" />, label: "Order Completed" },
];

const faqs = [
    {
        q: "Is my payment secure?",
        a: "Absolutely. We use bank-level SSL encryption and trusted payment gateways to ensure maximum security.",
    },
    {
        q: "Can I cancel my order anytime?",
        a: "Cancellations are only accepted if requested more than 24 hours before estimated delivery.",
    },
    {
        q: "What if payment fails?",
        a: "If your bank deducts the amount but the order isn’t placed, it will be auto-refunded within 5–7 business days.",
    },
    {
        q: "Do you allow COD?",
        a: "Yes, Cash on Delivery is available in select regions, subject to product value and availability.",
    },
];

const PaymentPolicy = () => {
    const [openFAQ, setOpenFAQ] = useState(null);
    const navigate = useNavigate();

    return (
        <div className="font-inter text-gray-800">
            <div className="fixed z-10 h-max w-max bg-sky-900 p-2 rounded-md m-2"
                onClick={() => navigate('/')}
            >
                <ArrowLeft size={"30px"} color="white" />
            </div>
            <section className="relative bg-gradient-to-r from-emerald-700 to-emerald-500 text-white py-24 px-6 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <FileText className="w-16 h-16 mx-auto mb-6 text-white" />
                    <h1 className="text-4xl md:text-5xl font-extrabold">
                        Payment & Cancellation Policy
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-emerald-100 leading-relaxed">
                        At Yash Enterprise, we ensure safe, secure, and transparent payments with fair cancellation policies.
                    </p>
                </motion.div>
            </section>

            {/* HIGHLIGHTS */}
            <section className="py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {highlights.map((item, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
                    >
                        {item.icon}
                        <h3 className="text-xl font-semibold mt-4">{item.title}</h3>
                        <p className="mt-3 text-gray-600 text-sm">{item.desc}</p>
                    </motion.div>
                ))}
            </section>

            {/* TIMELINE */}
            <section className="bg-gray-50 py-20 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-12">How Your Order Flows</h2>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                        {steps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="flex flex-col items-center"
                            >
                                <div className="bg-white rounded-full p-5 shadow-lg mb-3">
                                    {step.icon}
                                </div>
                                <p className="text-gray-700 font-medium">{step.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TERMS */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-10 space-y-6">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Policy Terms</h2>
                    <p>
                        All payments made on <strong>Nayaan Enterprise</strong> are encrypted
                        and secure. We use trusted third-party payment gateways for
                        processing transactions.
                    </p>
                    <p>
                        Orders once confirmed cannot be canceled within 24 hours of the
                        estimated delivery date. Customers are required to accept the
                        delivery once dispatched.
                    </p>
                    <p>
                        Refunds are processed only in cases where products are found
                        defective or incorrect. Refunds, if approved, will be initiated
                        within 7–10 business days.
                    </p>
                    <p>
                        For COD orders, refusal at delivery may lead to restricted future
                        COD eligibility.
                    </p>
                </div>
            </section>

            {/* FAQ */}
            <section className="bg-gray-50 py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-center">FAQs</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className="border border-gray-200 rounded-xl overflow-hidden"
                            >
                                <button
                                    className="w-full flex justify-between items-center px-6 py-4 text-left font-medium hover:bg-gray-100 transition"
                                    onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                                >
                                    {faq.q}
                                    {openFAQ === idx ? (
                                    <p>-</p>
                                    ) : (
                                        <p>+</p>
                                    )}
                                </button>
                                {openFAQ === idx && (
                                    <div className="px-6 pb-4 text-gray-600">{faq.a}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER STRIP */}
            <section className="bg-sky-950 text-white text-center py-6">
                <p>© {new Date().getFullYear()} Yash Enterprise. All Rights Reserved.</p>
            </section>
        </div>
    );
};

export default PaymentPolicy;
