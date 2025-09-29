import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* Top Section */}
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-gray-700">
                {/* Column 1 */}
                <div>
                    <h4 className="text-white font-semibold mb-4">Get to Know Us</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/about" className="hover:text-white">About Us</a></li>
                        <li><a href="" className="hover:text-white">Careers</a></li>
                        <li><a href="" className="hover:text-white">Press Releases</a></li>
                        <li><a href="" className="hover:text-white">Corporate Info</a></li>
                    </ul>
                </div>

                {/* Column 2 */}
                <div>
                    <h4 className="text-white font-semibold mb-4">Customer Service</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="" className="hover:text-white">Help Center</a></li>
                        <li><a href="" className="hover:text-white">Returns</a></li>
                        <li><a href="" className="hover:text-white">Shipping Info</a></li>
                        <li><a href="" className="hover:text-white">Contact Us</a></li>
                    </ul>
                </div>

                {/* Column 3 */}
                <div>
                    <h4 className="text-white font-semibold mb-4">Make Money With Us</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="" className="hover:text-white">Sell on OurSite</a></li>
                        <li><a href="" className="hover:text-white">Advertise Your Products</a></li>
                        <li><a href="" className="hover:text-white">Become an Affiliate</a></li>
                        <li><a href="" className="hover:text-white">Supplier Program</a></li>
                    </ul>
                </div>

                {/* Column 4 */}
                <div>
                    <h4 className="text-white font-semibold mb-4">Connect With Us</h4>
                    <div className="flex space-x-4">
                        <a href=""><Facebook className="w-5 h-5 hover:text-blue-400" /></a>
                        <a href=""><Twitter className="w-5 h-5 hover:text-blue-400" /></a>
                        <a href=""><Instagram className="w-5 h-5 hover:text-blue-400" /></a>
                        <a href=""><Linkedin className="w-5 h-5 hover:text-blue-400" /></a>
                        <a href=""><Youtube className="w-5 h-5 hover:text-blue-400" /></a>
                    </div>
                </div>
            </div>

            {/* Middle Section */}
            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm border-b border-gray-700">
                <div>
                    <h5 className="text-white font-medium mb-3">Payment Methods</h5>
                    <p>COD but soon will have UPI , Credit Card</p>
                </div>
                <div>
                    <h5 className="text-white font-medium mb-3">Delivery Partners</h5>
                    <p>Porter , FedX</p>
                </div>
                <div>
                    <h5 className="text-white font-medium mb-3">Policies</h5>
                    <div className="flex flex-col space-y-2">
                        <a href="/paymentpolicy">Payment Policy</a>
                        <a href="/securitypolicy">Security Policy</a>
                    </div>
                </div>
                <div>
                    <h5 className="text-white font-medium mb-3">Secure Shopping</h5>
                    <p>SSL Secured Checkout</p>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
                <p>© {new Date().getFullYear()} Nayaan - Enterprise. All rights reserved.</p>
                <div className="flex space-x-4 mt-2 md:mt-0">
                    {/* <a href="#" className="hover:text-white">Privacy Policy</a> */}
                    <a href="#" className="hover:text-white">Terms of Service</a>
                    <a href="#" className="hover:text-white">Cookies</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
