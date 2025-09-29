const carpets = [
    {
        id: 1,
        img: "/images/carpets/download-1.jfif",
        title: "Modern Block Carpet",
        price: "₹2,499",
        desc: "This modern block-pattern carpet is designed to give your space a stylish and elegant look. Its soft texture makes it comfortable underfoot while enhancing the decor. Perfect for living rooms, bedrooms, or lounges where you want a modern vibe."
    },
    {
        id: 2,
        img: "/images/carpets/download-2.jfif",
        title: "Plush Beige Carpet",
        price: "₹3,199",
        desc: "Crafted with a plush finish, this beige carpet provides warmth and luxury to your home. Its soft fibers feel smooth and comfortable, making it ideal for relaxing spaces. The neutral shade blends effortlessly with all types of interiors."
    },
    {
        id: 3,
        img: "/images/carpets/download-3.jfif",
        title: "Classic Neutral Carpet",
        price: "₹2,899",
        desc: "A timeless carpet in neutral tones that brings sophistication to your home decor. The durable material ensures long-lasting use while maintaining its elegance. Ideal for minimalist and classic-style interiors."
    },
    {
        id: 4,
        img: "/images/carpets/download-4.jfif",
        title: "Diamond Weave Carpet",
        price: "₹3,499",
        desc: "Designed with a stylish diamond weave pattern, this carpet adds character to any room. It is made from high-quality material, making it both durable and comfortable. A perfect blend of style and practicality for modern homes."
    },
    {
        id: 5,
        img: "/images/carpets/download-5.jfif",
        title: "Luxury Cream Carpet",
        price: "₹3,799",
        desc: "Add a touch of elegance with this luxury cream carpet, perfect for bedrooms and living spaces. The subtle design enhances the sophistication of your interiors. Soft and warm underfoot, it creates a cozy atmosphere."
    },
    {
        id: 6,
        img: "/images/carpets/download-6.jfif",
        title: "Round Beige Carpet",
        price: "₹2,199",
        desc: "This unique round beige carpet is a stylish choice for modern homes. It works well in both small and large spaces, giving a sense of uniqueness. Comfortable, durable, and perfect for adding a cozy feel."
    },
    {
        id: 7,
        img: "/images/carpets/download-7.jfif",
        title: "White Textured Carpet",
        price: "₹3,599",
        desc: "A bright white carpet with a beautiful texture that instantly uplifts your decor. Its clean and modern look makes it ideal for luxury interiors. Soft underfoot, it adds both comfort and elegance."
    },
    {
        id: 8,
        img: "/images/carpets/download-8.jfif",
        title: "Classic Grey Carpet",
        price: "₹2,999",
        desc: "A durable and versatile grey carpet that suits all interior styles. Its subtle design makes it suitable for both casual and formal setups. Built with high-quality fibers to ensure long-lasting use."
    },
    {
        id: 9,
        img: "/images/carpets/download-9.jfif",
        title: "Colorful Pattern Carpet",
        price: "₹3,299",
        desc: "Brighten up your room with this vibrant multicolor carpet. The geometric patterns bring energy and liveliness to your interiors. Great for living rooms and kids' spaces where you want a playful touch."
    },
    {
        id: 10,
        img: "/images/carpets/download-10.jfif",
        title: "Black Diamond Carpet",
        price: "₹3,899",
        desc: "This bold black carpet with diamond accents is perfect for a modern and classy look. Its deep color adds depth to your space while being easy to pair with furniture. Durable and soft, it offers both beauty and comfort."
    },
    {
        id: 11,
        img: "/images/carpets/download-11.jfif",
        title: "Brown Geometric Carpet",
        price: "₹2,799",
        desc: "An elegant brown carpet with geometric designs that blend seamlessly with all decor styles. It brings warmth to your room while maintaining durability. A perfect choice for hallways, bedrooms, or lounges."
    },
    {
        id: 12,
        img: "/images/carpets/download-12.jfif",
        title: "Blue Designer Carpet",
        price: "₹3,499",
        desc: "This stylish blue designer carpet adds a unique charm to your space. Its bold geometric prints make it stand out as a statement piece. Built with premium material for long-lasting quality."
    },
    {
        id: 13,
        img: "/images/carpets/download-13.jfif",
        title: "Cream Grid Carpet",
        price: "₹2,999",
        desc: "Featuring a subtle grid design, this cream carpet adds sophistication to any interior. Its soft tones make it versatile and easy to style. Perfect for those who prefer a minimal yet classy look."
    },
    {
        id: 14,
        img: "/images/carpets/download-14.jfif",
        title: "Golden Beige Carpet",
        price: "₹3,599",
        desc: "This golden beige carpet creates a luxurious and welcoming feel. Its soft surface makes it comfortable for everyday use. A great addition to bedrooms and living rooms alike."
    },
    {
        id: 15,
        img: "/images/carpets/download-15.jfif",
        title: "Zebra Print Carpet",
        price: "₹3,999",
        desc: "Make a bold statement with this zebra-print carpet in black and white. It’s designed to add a striking modern touch to your decor. Durable and stylish, perfect for living rooms and lounges."
    },
    {
        id: 16,
        img: "/images/carpets/download-16.jfif",
        title: "Dark Grey Shaggy Carpet",
        price: "₹4,199",
        desc: "This ultra-soft shaggy carpet provides comfort like no other. Its thick pile makes it warm and cozy, ideal for bedrooms and lounges. Add a sense of luxury with its rich dark grey shade."
    },
    {
        id: 17,
        img: "/images/carpets/download-17.jfif",
        title: "Rust Brown Carpet",
        price: "₹2,499",
        desc: "A rust-brown carpet that adds earthy tones and warmth to your decor. Its solid color makes it versatile and timeless. Great for spaces that need a cozy yet elegant touch."
    },
    {
        id: 18,
        img: "/images/carpets/download-18.jfif",
        title: "Red Wave Carpet",
        price: "₹3,799",
        desc: "Featuring bold red and white waves, this carpet is perfect for modern interiors. Its eye-catching design makes it a great centerpiece. Durable and stylish, perfect for living rooms or lounges."
    },
    {
        id: 19,
        img: "/images/carpets/download-19.jfif",
        title: "Blue Patchwork Carpet",
        price: "₹3,299",
        desc: "A trendy patchwork carpet in shades of blue that brings uniqueness to your home. The modern geometric style makes it stand out beautifully. Ideal for adding a contemporary touch to your decor."
    },
    {
        id: 20,
        img: "/images/carpets/download-20.jfif",
        title: "Elegant Beige Carpet",
        price: "₹2,999",
        desc: "This elegant beige carpet combines comfort with style. Its subtle shade makes it perfect for pairing with all interior colors. A great addition to any room needing a warm and cozy feel."
    }
];

export default carpets;
