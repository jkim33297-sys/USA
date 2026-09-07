// ==========================================
// USA PRODUCT DATABASE - DEMO PRODUCTS
// ==========================================

const products = [

    // ================= LAPTOPS =================

    {
        id: 1,
        category: "laptop",
        brand: "Lenovo",
        name: "Lenovo IdeaPad Slim 3",
        price: 449,
        oldPrice: 549,
        rating: 4.6,
        reviews: 1842,
        quality: 88,
        image: "💻",
        specs: ["16GB RAM", "512GB SSD", "Good Battery"],
        description: "A balanced laptop offering strong everyday performance at a lower price.",
        whyBetter: "Excellent value because it gives you 16GB RAM and a 512GB SSD without moving into expensive premium pricing."
    },

    {
        id: 2,
        category: "laptop",
        brand: "Dell",
        name: "Dell Inspiron 15",
        price: 529,
        oldPrice: 649,
        rating: 4.7,
        reviews: 2310,
        quality: 92,
        image: "💻",
        specs: ["16GB RAM", "512GB SSD", "Good Battery"],
        description: "Reliable everyday laptop with strong performance and build quality.",
        whyBetter: "Higher quality score and excellent reviews while remaining significantly cheaper than many premium alternatives."
    },

    {
        id: 3,
        category: "laptop",
        brand: "HP",
        name: "HP Pavilion 15",
        price: 579,
        oldPrice: 699,
        rating: 4.5,
        reviews: 1654,
        quality: 90,
        image: "💻",
        specs: ["16GB RAM", "512GB SSD", "Good Battery"],
        description: "A versatile laptop designed for work, study and entertainment.",
        whyBetter: "Strong combination of quality, storage and battery life for the price."
    },

    {
        id: 4,
        category: "laptop",
        brand: "Lenovo",
        name: "Lenovo ThinkBook 14",
        price: 649,
        oldPrice: 799,
        rating: 4.8,
        reviews: 932,
        quality: 95,
        image: "💻",
        specs: ["16GB RAM", "512GB SSD", "Good Battery"],
        description: "Business-focused laptop with excellent reliability.",
        whyBetter: "Excellent quality score makes it a strong choice when reliability matters more than getting the absolute lowest price."
    },

    {
        id: 5,
        category: "laptop",
        brand: "Dell",
        name: "Dell Vostro 14",
        price: 599,
        oldPrice: 729,
        rating: 4.6,
        reviews: 1201,
        quality: 91,
        image: "💻",
        specs: ["16GB RAM", "512GB SSD", "Good Battery"],
        description: "Practical laptop for students and professionals.",
        whyBetter: "Offers professional features at a lower cost than many business laptops."
    },

    {
        id: 6,
        category: "laptop",
        brand: "HP",
        name: "HP 15 Business Edition",
        price: 479,
        oldPrice: 599,
        rating: 4.4,
        reviews: 987,
        quality: 86,
        image: "💻",
        specs: ["16GB RAM", "512GB SSD"],
        description: "Affordable productivity laptop.",
        whyBetter: "One of the lower-priced options while still providing enough memory and storage for everyday work."
    },

    {
        id: 7,
        category: "laptop",
        brand: "Lenovo",
        name: "Lenovo Flex 5",
        price: 699,
        oldPrice: 849,
        rating: 4.8,
        reviews: 1456,
        quality: 96,
        image: "💻",
        specs: ["16GB RAM", "512GB SSD", "Good Battery"],
        description: "Premium-feeling 2-in-1 laptop without premium pricing.",
        whyBetter: "Very high quality score and flexible design make it a better long-term value than cheaper basic laptops."
    },

    {
        id: 8,
        category: "laptop",
        brand: "Dell",
        name: "Dell Latitude 5420",
        price: 679,
        oldPrice: 829,
        rating: 4.7,
        reviews: 2100,
        quality: 94,
        image: "💻",
        specs: ["16GB RAM", "512GB SSD", "Good Battery"],
        description: "Durable business laptop with dependable performance.",
        whyBetter: "Excellent durability and quality make it a strong option for users who want reliability at a reasonable price."
    },


    // ================= PHONES =================

    {
        id: 9,
        category: "phone",
        brand: "Samsung",
        name: "Samsung Galaxy A55",
        price: 349,
        oldPrice: 429,
        rating: 4.7,
        reviews: 3210,
        quality: 92,
        image: "📱",
        specs: ["128GB Storage", "Great Camera", "Good Battery"],
        description: "Balanced smartphone with a strong camera and long battery life.",
        whyBetter: "Provides many premium-style features without the price of a flagship phone."
    },

    {
        id: 10,
        category: "phone",
        brand: "Google",
        name: "Google Pixel 8a",
        price: 399,
        oldPrice: 499,
        rating: 4.8,
        reviews: 2890,
        quality: 95,
        image: "📱",
        specs: ["128GB Storage", "Great Camera", "Good Battery"],
        description: "Excellent camera-focused smartphone.",
        whyBetter: "Outstanding camera quality for its price makes it one of the strongest value choices."
    },

    {
        id: 11,
        category: "phone",
        brand: "OnePlus",
        name: "OnePlus Nord",
        price: 329,
        oldPrice: 399,
        rating: 4.6,
        reviews: 1780,
        quality: 89,
        image: "📱",
        specs: ["128GB Storage", "Fast Charging", "Good Battery"],
        description: "Fast and affordable smartphone.",
        whyBetter: "Lower price with strong performance and fast charging."
    },

    {
        id: 12,
        category: "phone",
        brand: "Samsung",
        name: "Samsung Galaxy S23 FE",
        price: 449,
        oldPrice: 599,
        rating: 4.7,
        reviews: 2450,
        quality: 94,
        image: "📱",
        specs: ["128GB Storage", "Great Camera", "Good Battery"],
        description: "Flagship-style experience at a lower price.",
        whyBetter: "Higher quality than many phones in this price range while remaining below premium flagship prices."
    },

    {
        id: 13,
        category: "phone",
        brand: "Motorola",
        name: "Moto G Power",
        price: 249,
        oldPrice: 299,
        rating: 4.5,
        reviews: 4120,
        quality: 84,
        image: "📱",
        specs: ["128GB Storage", "Good Battery"],
        description: "Budget phone focused on battery life.",
        whyBetter: "Excellent choice when your main priority is keeping the cost low."
    },


    // ================= HEADPHONES =================

    {
        id: 14,
        category: "headphones",
        brand: "Sony",
        name: "Sony WH-CH720N",
        price: 99,
        oldPrice: 149,
        rating: 4.6,
        reviews: 5620,
        quality: 91,
        image: "🎧",
        specs: ["Noise Cancelling", "Wireless", "Good Battery"],
        description: "Lightweight wireless headphones with noise cancellation.",
        whyBetter: "Very strong noise cancellation and battery performance for a much lower price than premium models."
    },

    {
        id: 15,
        category: "headphones",
        brand: "JBL",
        name: "JBL Tune 770NC",
        price: 89,
        oldPrice: 129,
        rating: 4.5,
        reviews: 3890,
        quality: 87,
        image: "🎧",
        specs: ["Noise Cancelling", "Wireless", "Good Battery"],
        description: "Affordable headphones with strong sound.",
        whyBetter: "Lower price while still offering noise cancellation and wireless convenience."
    },

    {
        id: 16,
        category: "headphones",
        brand: "Anker",
        name: "Soundcore Q30",
        price: 79,
        oldPrice: 109,
        rating: 4.6,
        reviews: 7210,
        quality: 89,
        image: "🎧",
        specs: ["Noise Cancelling", "Wireless", "Good Battery"],
        description: "Budget-friendly headphones with excellent battery life.",
        whyBetter: "One of the strongest low-price options because of its feature-to-price ratio."
    },

    {
        id: 17,
        category: "headphones",
        brand: "Sony",
        name: "Sony WH-1000XM4",
        price: 249,
        oldPrice: 349,
        rating: 4.8,
        reviews: 8430,
        quality: 98,
        image: "🎧",
        specs: ["Noise Cancelling", "Wireless", "Good Battery"],
        description: "Premium noise-cancelling headphones.",
        whyBetter: "Higher quality than cheaper alternatives, making it the best choice when sound quality is the priority."
    },


    // ================= CAMERAS =================

    {
        id: 18,
        category: "camera",
        brand: "Canon",
        name: "Canon EOS R50",
        price: 679,
        oldPrice: 799,
        rating: 4.8,
        reviews: 1890,
        quality: 96,
        image: "📷",
        specs: ["24MP", "4K Video", "Great Autofocus"],
        description: "Compact mirrorless camera for photography and video.",
        whyBetter: "Excellent image quality and autofocus without reaching the price of professional cameras."
    },

    {
        id: 19,
        category: "camera",
        brand: "Sony",
        name: "Sony ZV-E10",
        price: 599,
        oldPrice: 699,
        rating: 4.7,
        reviews: 2340,
        quality: 94,
        image: "📷",
        specs: ["24MP", "4K Video", "Great Autofocus"],
        description: "Creator-friendly mirrorless camera.",
        whyBetter: "Excellent choice for content creators looking for professional results at a lower price."
    },

    {
        id: 20,
        category: "camera",
        brand: "Nikon",
        name: "Nikon Z30",
        price: 649,
        oldPrice: 749,
        rating: 4.6,
        reviews: 1320,
        quality: 91,
        image: "📷",
        specs: ["20MP", "4K Video", "Good Battery"],
        description: "Compact camera designed for creators.",
        whyBetter: "Good video quality and compact design at a competitive price."
    },


    // ================= MORE LAPTOPS =================

    {
        id: 21,
        category: "laptop",
        brand: "HP",
        name: "HP Envy 13",
        price: 729,
        oldPrice: 899,
        rating: 4.8,
        reviews: 1780,
        quality: 96,
        image: "💻",
        specs: ["16GB RAM", "512GB SSD", "Good Battery"],
        description: "Premium compact laptop with excellent build quality.",
        whyBetter: "Excellent quality and portability without the price of the most expensive premium laptops."
    },

    {
        id: 22,
        category: "laptop",
        brand: "Dell",
        name: "Dell XPS 13",
        price: 799,
        oldPrice: 999,
        rating: 4.9,
        reviews: 3220,
        quality: 98,
        image: "💻",
        specs: ["16GB RAM", "512GB SSD", "Good Battery"],
        description: "Premium compact laptop.",
        whyBetter: "Outstanding quality and portability. It costs more, but its quality score makes it a strong premium-value option."
    },

    {
        id: 23,
        category: "laptop",
        brand: "Lenovo",
        name: "Lenovo Yoga 7",
        price: 749,
        oldPrice: 899,
        rating: 4.8,
        reviews: 1920,
        quality: 96,
        image: "💻",
        specs: ["16GB RAM", "512GB SSD", "Good Battery"],
        description: "Flexible laptop with premium design.",
        whyBetter: "High quality and flexible design at a lower cost than many premium 2-in-1 laptops."
    },

    {
        id: 24,
        category: "laptop",
        brand: "Acer",
        name: "Acer Aspire 5",
        price: 399,
        oldPrice: 499,
        rating: 4.4,
        reviews: 5100,
        quality: 84,
        image: "💻",
        specs: ["16GB RAM", "512GB SSD", "Good Battery"],
        description: "Affordable laptop for everyday tasks.",
        whyBetter: "One of the cheapest options while still providing useful memory and SSD storage."
    },

    {
        id: 25,
        category: "laptop",
        brand: "ASUS",
        name: "ASUS VivoBook 15",
        price: 429,
        oldPrice: 529,
        rating: 4.5,
        reviews: 3470,
        quality: 87,
        image: "💻",
        specs: ["16GB RAM", "512GB SSD", "Good Battery"],
        description: "Affordable and stylish everyday laptop.",
        whyBetter: "Good balance between price, performance and design."
    },

    {
        id: 26,
        category: "laptop",
        brand: "Acer",
        name: "Acer Swift Go",
        price: 599,
        oldPrice: 699,
        rating: 4.7,
        reviews: 1650,
        quality: 93,
        image: "💻",
        specs: ["16GB RAM", "512GB SSD", "Good Battery"],
        description: "Lightweight laptop with strong performance.",
        whyBetter: "Excellent balance between portability, quality and price."
    },


    // ================= MORE PHONES =================

    {
        id: 27,
        category: "phone",
        brand: "Google",
        name: "Pixel 7a",
        price: 299,
        oldPrice: 399,
        rating: 4.7,
        reviews: 4900,
        quality: 91,
        image: "📱",
        specs: ["128GB Storage", "Great Camera", "Good Battery"],
        description: "Affordable camera-focused smartphone.",
        whyBetter: "Excellent photography performance at a significantly lower price."
    },

    {
        id: 28,
        category: "phone",
        brand: "OnePlus",
        name: "OnePlus 12R",
        price: 499,
        oldPrice: 599,
        rating: 4.8,
        reviews: 2210,
        quality: 95,
        image: "📱",
        specs: ["256GB Storage", "Fast Charging", "Good Battery"],
        description: "Powerful smartphone with excellent battery life.",
        whyBetter: "Strong performance and large storage for considerably less than many flagship phones."
    },

    {
        id: 29,
        category: "phone",
        brand: "Samsung",
        name: "Galaxy A35",
        price: 299,
        oldPrice: 349,
        rating: 4.5,
        reviews: 2850,
        quality: 87,
        image: "📱",
        specs: ["128GB Storage", "Great Camera", "Good Battery"],
        description: "Affordable Samsung smartphone.",
        whyBetter: "Good everyday features at a lower price point."
    },

    {
        id: 30,
        category: "phone",
        brand: "Motorola",
        name: "Moto Edge",
        price: 399,
        oldPrice: 499,
        rating: 4.6,
        reviews: 1760,
        quality: 90,
        image: "📱",
        specs: ["256GB Storage", "Great Camera", "Good Battery"],
        description: "Feature-rich smartphone at a competitive price.",
        whyBetter: "More storage and strong features without flagship-level pricing."
    }

];