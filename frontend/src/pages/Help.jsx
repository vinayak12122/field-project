import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Search,
    CreditCard,
    Package,
    Truck,
    XCircle,
    Lock,
    HelpCircle,
    Phone,
    Mail,
    MessageCircle,
    ChevronDown,
    ChevronUp,
    FileText,
} from "lucide-react";

const categories = [
    {
        icon: <CreditCard className="w-10 h-10 text-emerald-600" />,
        title: "Payments & Refunds",
        desc: "Learn about payment methods, security, and refund timelines.",
    },
    {
        icon: <Package className="w-10 h-10 text-emerald-600" />,
        title: "Orders & Shipping",
        desc: "Track your orders and understand our shipping process.",
    },
    {
        icon: <XCircle className="w-10 h-10 text-emerald-600" />,
        title: "Returns & Cancellations",
        desc: "Check eligibility and steps for returns or cancellations.",
    },
    {
        icon: <Lock classNameName="w-10 h-10 text-emerald-600" />,
        title: "Account & Security",
        desc: "Manage your account and keep your data secure.",
    },
];

const faqs = [
    {
        q: "How can I track my order?",
        a: "Once shipped, you’ll receive an email/SMS with a tracking link. You can also track it from the 'Orders' section of your account.",
    },
    {
        q: "What payment methods do you accept?",
        a: "We support Cash on Delivery (COD) in all regions.",
    },
    {
        q: "How do I request a refund?",
        a: "If your order is eligible, you can request a refund from the 'Orders' page. Refunds are processed within 7-10 business days.",
    },
    {
        q: "Can I change my shipping address after ordering?",
        a: "Shipping address can only be modified before the order is dispatched. Contact support immediately for assistance.",
    },
    {
        q: "Is my payment secure?",
        a: "Absolutely. We use trusted payment gateways with bank-level SSL encryption to keep your transactions safe.",
    },
];

const HelpPage = () => {
    const [openFAQ, setOpenFAQ] = useState(null);

    return (
        <div className="font-inter text-gray-800">
            {/* HERO */}
            <section className="relative bg-gradient-to-r from-emerald-700 to-emerald-500 text-white py-24 px-6 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <HelpCircle className="w-16 h-16 mx-auto mb-6 text-white" />
                    <h1 className="text-4xl md:text-5xl font-extrabold">Help Center</h1>
                    <p className="mt-6 text-lg md:text-xl text-emerald-100 leading-relaxed">
                        We’re here to assist you. Browse categories, read FAQs, or contact our support team.
                    </p>


                    {/* <div className="mt-8 max-w-xl mx-auto flex items-center bg-white rounded-full shadow-lg overflow-hidden">
                        <input
                            type="text"
                            placeholder="Search your query..."
                            className="flex-grow px-4 py-3 text-gray-700 outline-none"
                        />
                        <button className="bg-emerald-600 px-6 py-3 text-white font-medium hover:bg-emerald-700 transition rounded-full m-1">
                            <Search className="w-5 h-5" />
                        </button>
                    </div> */}
                </motion.div>
            </section>

            <section className="py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {categories.map((item, idx) => (
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

            <section className="bg-gray-50 py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-center">Popular Questions</h2>
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

            {/* CONTACT */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-10 text-center space-y-8">
                    <h2 className="text-3xl font-bold text-gray-800">Need More Help?</h2>
                    <p className="text-gray-600">
                        Our support team is available 24/7 to assist you with any queries.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6 mt-6">
                        <a
                            href="tel:+911234567890"
                            className="flex items-center gap-3 bg-emerald-600 text-white px-6 py-3 rounded-full shadow hover:bg-emerald-700 transition"
                        >
                            <Phone className="w-5 h-5" /> Call Us
                        </a>
                        <a
                            href="mailto:support@yourdomain.com"
                            className="flex items-center gap-3 bg-emerald-600 text-white px-6 py-3 rounded-full shadow hover:bg-emerald-700 transition"
                        >
                            <Mail className="w-5 h-5" /> Email Us
                        </a>
                        <button className="flex items-center gap-3 bg-emerald-600 text-white px-6 py-3 rounded-full shadow hover:bg-emerald-700 transition"
                        >
                            <MessageCircle className="w-5 h-5" />
                            <a
                                href="https://wa.me/919876543210?text=Hello!%20I%20need%20assistance"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Live Chat
                            </a>
                        </button>
                    </div>
                </div>
            </section>

            {/* FOOTER STRIP */}
            <section className="bg-sky-950 text-white text-center py-6">
                <p>© {new Date().getFullYear()} Nayaan Enterprise. All Rights Reserved.</p>
            </section>
        </div>
    );
};

export default HelpPage;
