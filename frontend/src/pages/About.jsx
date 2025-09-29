// About.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Award,
    Users,
    Home,
    Box,
    Clock,
    MapPin,
    Star,
    Mail,
    Phone,
} from "lucide-react";

const stats = [
    { label: "Years of Trust", value: "25+", icon: <Clock className="w-6 h-6" /> },
    { label: "Happy Customers", value: "5000+", icon: <Users className="w-6 h-6" /> },
    { label: "Product Categories", value: "6+", icon: <Box className="w-6 h-6" /> },
    { label: "Team Size", value: "3–5", icon: <Award className="w-6 h-6" /> },
];

const categories = [
    { title: "Carpets", desc: "Handpicked & durable carpets for every home", img: "/carpet.jfif" },
    { title: "Doormats", desc: "Durable doormats with style & grip", img: "/doormats.jfif" },
    { title: "Sofa Covers", desc: "Protect & style your sofas with premium fabrics", img: "/sofa-covers.jfif" },
    { title: "Curtains", desc: "Light-filtering and blackout options", img: "/curtains.jfif" },
    { title: "Blankets", desc: "Cozy blankets for every season", img: "/blankets.jfif" },
    { title: "Interior Designing", desc: "Professional consultations & turnkey fit-outs", img: "/interior.jfif" },
];

const team = [
    { name: "Yash Gupta", role: "Managing", img: "/images/team1.jpg" ,work:"Khane Ka Pine Ka Or Soo Janeka"},
    { name: "Vinayak Mishra", role: "Developer , Operations", img: "/images/team2.jpg", work: "Khane Ka Pine Ka Or Soo Janeka" },
    { name: "Yash's Dad", role: "Founder", img: "/images/team3.jpg", work: "Khane Ka Pine Ka Or Soo Janeka" },
    { name: "Yash's Mom", role: "Co-Foumder", img: "/images/team3.jpg", work: "Khane Ka Pine Ka Or Soo Janeka" },
    { name: "Yash's Brother", role: "Manager", img: "/images/team3.jpg", work: "Khane Ka Pine Ka Or Soo Janeka" },
    { name: "Yash's Sister", role: "Creative", img: "/images/team3.jpg", work: "Khane Ka Pine Ka Or Soo Janeka" },
];

const testimonials = [
    { name: "Priya S.", quote: "Amazing quality! My living room looks completely transformed after Yash Enterprise redesigned it.", rating: 5 },
    { name: "Amit K.", quote: "Great carpets at very reasonable prices. Quick delivery and excellent customer service.", rating: 5 },
    { name: "Neha R.", quote: "Loved the sofa covers — perfect fit and fabric is top notch!", rating: 4 },
];

const faqs = [
    { q: "Do you ship outside the local region?", a: "Currently we primarily serve our local region but we are expanding our delivery network gradually. Contact us to check availability to your pin code." },
    { q: "Do you offer installation for carpets and curtains?", a: "Yes — for selected product categories we provide installation services. Booking and charges depend on the scope." },
    { q: "What is your return policy?", a: "We accept returns within 7 days for manufacturing defects. Contact customer care for an RMA." },
];

const About = () => {
    const [tIndex, setTIndex] = useState(0);
    const [openFAQ, setOpenFAQ] = useState(null);

    return (
        <div className="font-inter antialiased text-gray-800">
            {/* HERO */}
            <header className="relative">
                <div className="h-auto md:h-[480px] bg-gradient-to-r from-emerald-900/90 to-emerald-700/80 flex items-center">
                    <div className="relative max-w-7xl mx-auto px-6 py-20 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.12 }}
                            className="text-white max-w-3xl mx-auto"
                        >
                            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
                                Nayaan Enterprise <br/> 25 years crafting homes with comfort & style
                            </h1>
                            <p className="mt-4 text-sm md:text-lg text-gray-100/90">
                                We blend traditional craftsmanship with contemporary design — carpets, doormats,
                                sofa covers, curtains, blankets and interior design solutions, all at prices that
                                make lifestyle upgrades accessible.
                            </p>

                            <div className="mt-8 sm:mb-4 lg:mb-14 md:mb-10 flex flex-col sm:flex-row justify-center md:justify-start gap-3">
                                <a
                                    href="/shop"
                                    className="inline-flex items-center justify-center gap-2 bg-white text-emerald-900 px-5 py-2 rounded shadow hover:shadow-lg font-medium"
                                >
                                    Shop Collections
                                </a>
                                {/* <a
                                    href="/contact"
                                    className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-5 py-2 rounded hover:bg-white/10"
                                >
                                    Contact Us
                                </a> */}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </header>

            {/* OVERVIEW + STATS */}
            <section className="max-w-7xl mx-auto px-6 -mt-12 md:-mt-20 relative z-10">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden grid md:grid-cols-2">
                    <div className="p-8 md:p-12">
                        <h2 className="text-2xl md:text-3xl font-bold">Built on trust — for 25 years</h2>
                        <p className="mt-4 text-gray-600 leading-relaxed">
                            Since inception, Yash Enterprise has been committed to providing homes with
                            lasting quality and elegant designs at manageable prices. We partner with
                            trusted suppliers and local artisans to ensure each piece meets our quality bar.
                        </p>

                        <div className="mt-6 grid grid-cols-2 gap-4">
                            {stats.map((s) => (
                                <div key={s.label} className="flex items-start gap-4 bg-gray-50 p-4 rounded-lg">
                                    <div className="bg-emerald-50 p-2 rounded-md text-emerald-600">{s.icon}</div>
                                    <div>
                                        <div className="text-lg font-semibold">{s.value}</div>
                                        <div className="text-xs text-gray-500">{s.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick contact / region info */}
                    <aside className="p-8 md:p-12 bg-gradient-to-tr from-emerald-50 to-white flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Serving our community</h3>
                            <p className="mt-2 text-gray-600">
                                Trusted by 5000+ customers across our local region. Our team of 3–5
                                dedicated members ensures personal attention to every order.
                            </p>

                            <ul className="mt-6 space-y-3">
                                <li className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-emerald-700 mt-1" />
                                    <div>
                                        <div className="text-sm font-medium">Local Region</div>
                                        <div className="text-xs text-gray-500">Pan-local presence & delivery</div>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Home className="w-5 h-5 text-emerald-700 mt-1" />
                                    <div>
                                        <div className="text-sm font-medium">In-store & Online</div>
                                        <div className="text-xs text-gray-500">Visit our showroom for live demos</div>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* <div className="mt-6">
                            <a
                                href="/contact"
                                className="inline-flex items-center justify-center gap-2 bg-emerald-700 text-white px-5 py-2 rounded shadow hover:bg-emerald-800"
                            >
                                <Mail className="w-4 h-4" />
                                Get in touch
                            </a>
                        </div> */}
                    </aside>
                </div>
            </section>

            {/* TIMELINE */}
            <section className="max-w-7xl mx-auto px-6 py-12">
                <h3 className="text-2xl font-semibold mb-6 text-center">Our Journey</h3>
                <div className="grid gap-6 md:grid-cols-3">
                    <motion.div className="bg-white p-6 rounded-xl shadow">
                        <div className="text-emerald-600 font-semibold">2000 — Founded</div>
                        <p className="mt-3 text-gray-600">
                            Yash Enterprise started as a small showroom focused on quality carpets.
                        </p>
                    </motion.div>

                    <motion.div className="bg-white p-6 rounded-xl shadow">
                        <div className="text-emerald-600 font-semibold">2010 — Expansion</div>
                        <p className="mt-3 text-gray-600">
                            Added doormats, sofa covers, and expanded local deliveries.
                        </p>
                    </motion.div>

                    <motion.div className="bg-white p-6 rounded-xl shadow">
                        <div className="text-emerald-600 font-semibold">2018 — Interiors</div>
                        <p className="mt-3 text-gray-600">
                            Launched professional interior designing services and curated curtains & blankets collections.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* CATEGORIES */}
            <section className="max-w-7xl mx-auto px-6 py-12">
                <h3 className="text-2xl font-semibold mb-6 text-center">Our Collections</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {categories.map((c) => (
                        <motion.article key={c.title} whileHover={{ scale: 1.02 }} className="bg-white rounded-xl overflow-hidden shadow">
                            <div className="h-44 bg-gray-100">
                                <img
                                    src={c.img}
                                    alt={c.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => (e.currentTarget.src = "/images/placeholder.jpg")}
                                />
                            </div>
                            <div className="p-4">
                                <h4 className="font-semibold">{c.title}</h4>
                                <p className="mt-2 text-sm text-gray-600">{c.desc}</p>
                                <a className="mt-3 inline-block text-emerald-700 text-sm font-medium" href={`/products/${c.title.toLowerCase()}`}>
                                    Explore →
                                </a>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </section>

            {/* TEAM
            <section className="max-w-7xl mx-auto px-6 py-12 bg-emerald-50 rounded-2xl">
                <h3 className="text-2xl font-semibold mb-6 text-center">Meet the Team</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {team.map((m) => (
                        <div key={m.name} className="bg-white rounded-xl p-6 text-center shadow">
                            <img
                                src={m.img}
                                alt={m.name}
                                className="mx-auto w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
                                onError={(e) => (e.currentTarget.src = "/images/avatar-placeholder.png")}
                            />
                            <h4 className="mt-4 font-semibold">{m.name}</h4>
                            <div className="text-sm text-gray-500">{m.role}</div>
                            <p className="mt-3 text-sm text-gray-600">
                                {m.work}
                            </p>
                        </div>
                    ))}
                </div>
            </section> */}

            {/* TESTIMONIALS */}
            <section className="max-w-5xl mx-auto px-6 py-12">
                <h3 className="text-2xl font-semibold mb-6 text-center">What customers say</h3>
                <div className="bg-white rounded-xl p-8 shadow text-center">
                    <p className="text-gray-700 italic">“{testimonials[tIndex].quote}”</p>
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div>
                            <div className="font-semibold">{testimonials[tIndex].name}</div>
                            <div className="text-sm text-gray-500">
                                {Array.from({ length: testimonials[tIndex].rating }).map((_, i) => (
                                    <Star key={i} className="inline-block w-4 h-4 text-amber-400" />
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setTIndex((tIndex - 1 + testimonials.length) % testimonials.length)}
                                className="px-3 py-2 rounded bg-emerald-100 hover:bg-emerald-200"
                            >
                                Prev
                            </button>
                            <button
                                onClick={() => setTIndex((tIndex + 1) % testimonials.length)}
                                className="px-3 py-2 rounded bg-emerald-700 text-white hover:bg-emerald-800"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-2xl font-semibold mb-4">Frequently asked</h3>
                    <div className="space-y-3">
                        {faqs.map((f, i) => (
                            <div key={f.q} className="bg-white rounded-xl shadow">
                                <button
                                    onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                                    className="w-full text-left px-5 py-4 flex justify-between items-center"
                                >
                                    <span className="font-medium">{f.q}</span>
                                    <span className="text-sm text-gray-500">
                                        {openFAQ === i ? "−" : "+"}
                                    </span>
                                </button>
                                {openFAQ === i && <div className="px-5 pb-4 text-gray-600">{f.a}</div>}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-emerald-700 rounded-xl p-8 text-white flex flex-col justify-between">
                    <div>
                        <h3 className="text-2xl font-semibold">Ready to upgrade your home?</h3>
                        <p className="mt-3 text-gray-100/90">
                            Browse our curated collections or request a free consultation for interior design.
                        </p>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <a
                            href="/products"
                            className="inline-flex items-center justify-center px-4 py-3 border border-white/30 rounded-lg hover:bg-white/10"
                            >
                            Shop Now
                        </a>
                        {/* <a
                            href="/contact"
                            
                            className="inline-flex items-center justify-center px-4 py-3 bg-white text-emerald-800 rounded-lg shadow"
                        >
                            Book Consultation
                        </a> */}
                    </div>

                    <div className="mt-6 text-sm flex items-center gap-4">
                        <Phone className="w-4 h-4" />
                        <div>
                            <div>Call us</div>
                            <div className="font-semibold">+91 12345 67890</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER STRIP */}
            <footer className="bg-gray-900 text-gray-300 py-6">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-center md:text-left">
                        © {new Date().getFullYear()} Nayaan Enterprise — Quality home furnishings since 2000
                    </div>
                    <div className="flex flex-wrap justify-center gap-6">
                        <a className="text-sm hover:text-white" href="/privacy">Privacy</a>
                        <a className="text-sm hover:text-white" href="/terms">Terms</a>
                        <a className="text-sm hover:text-white" href="/contact">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default About;
