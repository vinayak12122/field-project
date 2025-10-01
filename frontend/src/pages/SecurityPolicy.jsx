import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    ShieldCheck,
    Lock,
    FileText,
    UserCheck,
    Database,
    Trash2,
    Key,
    ChevronDown,
    ChevronUp,
    CheckCircle,
    ArrowRightIcon,
    ArrowLeftFromLine,
    ArrowLeftIcon,
    ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const highlights = [
    {
        icon: <ShieldCheck className="w-10 h-10 text-emerald-600" />,
        title: "Bank-Grade Encryption",
        desc: "All sensitive data is protected using 256-bit SSL encryption during transmission.",
    },
    {
        icon: <Lock className="w-10 h-10 text-emerald-600" />,
        title: "Data Protection",
        desc: "We never sell or share your personal data with third parties without consent.",
    },
    {
        icon: <UserCheck className="w-10 h-10 text-emerald-600" />,
        title: "Privacy First",
        desc: "Your identity and personal details remain secure, with strict access controls.",
    },
    {
        icon: <Key className="w-10 h-10 text-emerald-600" />,
        title: "Compliance Ready",
        desc: "We follow GDPR, IT Act, and industry-standard best practices for security.",
    },
];

const steps = [
    { icon: <UserCheck className="w-8 h-8 text-emerald-600" />, label: "User Login" },
    { icon: <Database className="w-8 h-8 text-emerald-600" />, label: "Secure Storage" },
    { icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />, label: "Data Protection" },
    { icon: <Trash2 className="w-8 h-8 text-emerald-600" />, label: "Safe Deletion" },
    { icon: <CheckCircle className="w-8 h-8 text-emerald-600" />, label: "Compliance Check" },
];

const faqs = [
    {
        q: "How is my data protected?",
        a: "Your data is encrypted both in transit and at rest using industry-standard protocols.",
    },
    {
        q: "Do you store my payment details?",
        a: "No, we do not store any card or UPI details. Transactions are handled by secure gateways.",
    },
    {
        q: "Can I request deletion of my account data?",
        a: "Yes, you can request full data deletion by contacting our support team.",
    },
    // {
    //     q: "Are you GDPR compliant?",
    //     a: "Yes, we follow GDPR and other local data protection laws to ensure user rights.",
    // },
];

const SecurityPolicy = () => {
    const [openFAQ, setOpenFAQ] = useState(null);
    const navigate = useNavigate();

    return (
        <div className="font-inter text-gray-800">
            <div className="fixed z-10 h-max w-max bg-sky-900 p-2 rounded-md m-2 cursor-pointer"
            onClick={()=>navigate('/')}
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
                        Security & Privacy Policy
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-emerald-100 leading-relaxed">
                        At YourCompany, safeguarding your data and ensuring your privacy
                        are our top priorities.
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
                    <h2 className="text-3xl font-bold mb-12">How We Handle Your Data</h2>
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
                        All data collected on <strong>YourCompany</strong> is securely
                        stored and processed. We follow strict industry protocols to
                        protect your information.
                    </p>
                    <p>
                        We never sell or misuse your personal data. It is used solely for
                        order processing, account management, and service improvements.
                    </p>
                    <p>
                        Users can request account deletion and data removal at any time by
                        contacting support. Once confirmed, all related data will be
                        permanently erased.
                    </p>
                    {/* <p>
                        We comply with GDPR, IT Act, and applicable data privacy laws. Any
                        policy updates will be notified via email or our website.
                    </p> */}
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
                <p>© {new Date().getFullYear()} Sleep Sound. All Rights Reserved.</p>
            </section>
        </div>
    );
};

export default SecurityPolicy;
