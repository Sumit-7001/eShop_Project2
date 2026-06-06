const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Product = require('./models/Product');

// Load environment variables
dotenv.config();

// Define data pools for each category to generate high-quality product records programmatically.

// 1. Smartphones (19 items)
const smartphoneBrands = ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Motorola', 'Realme', 'Nothing', 'Sony', 'Asus', 'Oppo', 'Vivo'];
const smartphoneModels = ['Pro Max', 'Ultra', 'Fold', 'Flip', 'Neo', 'Lite', 'Zoom', 'Edge', 'Speed', 'Play', 'GT', 'Pocket', 'Aero', 'Nova', 'Prime'];
const smartphoneColors = ['Titanium Gray', 'Phantom Black', 'Glacier White', 'Forest Green', 'Sunset Gold', 'Deep Violet'];
const smartphoneImages = [
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
  'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400',
  'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400',
  'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
  'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=400',
  'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400',
  'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400',
  'https://images.unsplash.com/photo-1598327106026-d9521da673d1?w=400',
  'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400',
  'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=400'
];

const smartphones = [];
for (let i = 0; i < 19; i++) {
  const brand = smartphoneBrands[i % smartphoneBrands.length];
  const model = smartphoneModels[i % smartphoneModels.length];
  const title = `${brand} ${model} ${10 + i}`;
  const price = 25000 + i * 4500;
  const oldPrice = Math.round(price * 1.15 / 100) * 100;
  const color = smartphoneColors[i % smartphoneColors.length];
  const rating = (4.0 + (i * 0.05) % 1.0).toFixed(1);
  const image = smartphoneImages[i % smartphoneImages.length];
  const description = `The brand new ${title} in elegant ${color}. Experience blazing fast speeds, advanced AI features, and a breathtaking camera system with multi-sensor optical zoom. Perfect for everyday power usage.`;
  smartphones.push({
    title,
    price,
    oldPrice,
    color,
    rating: parseFloat(rating),
    image,
    sale: i % 2 === 0,
    category: 'smartphones',
    description
  });
}

// 2. Watches (19 items)
const watchBrands = ['Seiko', 'Citizen', 'Rolex', 'Casio', 'Garmin', 'Fossil', 'Tissot', 'Omega', 'Fitbit', 'Apple', 'Tag Heuer', 'Orient'];
const watchModels = ['Classic Chrono', 'Diver Pro', 'Smartwatch Active', 'Solar Precision', 'Automatic Sport', 'Heritage Leather', 'Titanium Explorer', 'Retro Digital'];
const watchColors = ['Silver Steel', 'Rose Gold', 'Midnight Black', 'Brown Leather', 'Ocean Blue', 'Obsidian'];
const watchImages = [
  'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400',
  'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=400',
  'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400',
  'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=400',
  'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400',
  'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400',
  'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=400',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
  'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400',
  'https://images.unsplash.com/photo-1619134778706-7015533a6150?w=400'
];

const watches = [];
for (let i = 0; i < 19; i++) {
  const brand = watchBrands[i % watchBrands.length];
  const model = watchModels[i % watchModels.length];
  const title = `${brand} ${model} W${i + 1}`;
  const price = 8900 + i * 2200;
  const oldPrice = Math.round(price * 1.20 / 100) * 100;
  const color = watchColors[i % watchColors.length];
  const rating = (4.2 + (i * 0.04) % 0.8).toFixed(1);
  const image = watchImages[i % watchImages.length];
  const description = `Elevate your style with the ${title} watch. Finished in premium ${color}, it features exceptional timekeeping accuracy, water resistance, and a modern aesthetic suitable for both work and adventure.`;
  watches.push({
    title,
    price,
    oldPrice,
    color,
    rating: parseFloat(rating),
    image,
    sale: i % 3 === 0,
    category: 'watches',
    description
  });
}

// 3. Furniture (18 items)
const furnitureStyles = ['Scandinavian', 'Modernist Walnut', 'Rustic Oak', 'Industrial Steel', 'Minimalist Pine', 'Mid-Century Velvet'];
const furnitureItems = ['Office Chair', 'Dining Table', 'Floating Bookshelf', 'Ergonomic Desk', 'Living Room Credenza', 'Padded Bar Stool', 'Accent Armchair', 'Bed Frame'];
const furnitureColors = ['Natural Wood', 'Classic White', 'Dark Espresso', 'Slate Gray', 'Forest Green', 'Charcoal'];
const furnitureImages = [
  'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=400',
  'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400',
  'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
  'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400',
  'https://images.unsplash.com/photo-1503602642458-232111445657?w=400',
  'https://images.unsplash.com/photo-1519643381401-22c77e60520e?w=400',
  'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=400',
  'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400'
];

const furniture = [];
for (let i = 0; i < 18; i++) {
  const style = furnitureStyles[i % furnitureStyles.length];
  const item = furnitureItems[i % furnitureItems.length];
  const title = `${style} ${item}`;
  const price = 4500 + i * 1800;
  const oldPrice = Math.round(price * 1.15 / 100) * 100;
  const color = furnitureColors[i % furnitureColors.length];
  const rating = (4.1 + (i * 0.05) % 0.9).toFixed(1);
  const image = furnitureImages[i % furnitureImages.length];
  const description = `Enhance your living space with this beautiful ${title}. Constructed from premium materials and finished in ${color}, it combines modern aesthetic appeal with everyday functionality.`;
  furniture.push({
    title,
    price,
    oldPrice,
    color,
    rating: parseFloat(rating),
    image,
    sale: i % 2 === 0,
    category: 'furniture',
    description
  });
}

// 4. Kids (18 items)
const kidsItems = ['Magnetic Building Tiles', 'Dinosaur Excavation Kit', 'Remote Control Stunt Car', 'Interactive Learning Globe', 'Kids Telescope with Tripod', 'Plush Teddy Bear', 'Wooden Block Castle', 'STEM Robotics Kit', 'Art & Craft Supply Set', 'Childrens Microscope'];
const kidsThemes = ['Creative', 'Explorer', 'SmartKids', 'PlayTime', 'EduFun', 'MegaBlocks'];
const kidsColors = ['Multi-color', 'Bright Blue', 'Vibrant Pink', 'Lemon Yellow', 'Lime Green'];
const kidsImages = [
  'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400',
  'https://images.unsplash.com/photo-1552084117-56a987666449?w=400',
  'https://images.unsplash.com/photo-1558244661-d248897f7bc4?w=400',
  'https://images.unsplash.com/photo-1533906966484-a9c978a3f090?w=400',
  'https://images.unsplash.com/photo-1618354691792-d1d42acfd860?w=400',
  'https://images.unsplash.com/photo-1559251606-c623743a6d76?w=400',
  'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400',
  'https://images.unsplash.com/photo-1559251606-c623743a6d76?w=400',
  'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400',
  'https://images.unsplash.com/photo-1532330393533-443990a51d10?w=400'
];

const kids = [];
for (let i = 0; i < 18; i++) {
  const theme = kidsThemes[i % kidsThemes.length];
  const item = kidsItems[i % kidsItems.length];
  const title = `${theme} ${item}`;
  const price = 1200 + i * 350;
  const oldPrice = Math.round(price * 1.25 / 50) * 50;
  const color = kidsColors[i % kidsColors.length];
  const rating = (4.3 + (i * 0.04) % 0.7).toFixed(1);
  const image = kidsImages[i % kidsImages.length];
  const description = `An engaging, high-quality toy for children. The ${title} stimulates creativity, problem-solving skills, and hand-eye coordination while providing hours of fun. Safe and child-friendly.`;
  kids.push({
    title,
    price,
    oldPrice,
    color,
    rating: parseFloat(rating),
    image,
    sale: i % 3 === 0,
    category: 'kids',
    description
  });
}

// 5. Fashion (18 items)
const fashionItems = ['Summer Linen Dress', 'Classic Denim Jacket', 'Slim Fit Cotton Chinos', 'Premium Leather Jacket', 'Wool Blend Overcoat', 'Graphic Print Tee', 'Formal Office Suit', 'Waterproof Trench Coat', 'Leather Designer Belt', 'Cozy Knit Sweater'];
const fashionBrands = ['Zara', 'H&M', 'Levis', 'Tommy Hilfiger', 'Calvin Klein', 'Ralph Lauren'];
const fashionColors = ['Charcoal Gray', 'Navy Blue', 'Burgundy Red', 'Camel Brown', 'Olive Green', 'Classic Black'];
const fashionImages = [
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400',
  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400',
  'https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=400',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
  'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400',
  'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400',
  'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=400'
];

const fashion = [];
for (let i = 0; i < 18; i++) {
  const brand = fashionBrands[i % fashionBrands.length];
  const item = fashionItems[i % fashionItems.length];
  const title = `${brand} ${item}`;
  const price = 1500 + i * 850;
  const oldPrice = Math.round(price * 1.30 / 100) * 100;
  const color = fashionColors[i % fashionColors.length];
  const rating = (4.0 + (i * 0.06) % 1.0).toFixed(1);
  const image = fashionImages[i % fashionImages.length];
  const description = `Upgrade your wardrobe with this stylish ${title}. Designed with premium fabric in ${color}, it offers comfort and style for any casual or semi-formal outing.`;
  fashion.push({
    title,
    price,
    oldPrice,
    color,
    rating: parseFloat(rating),
    image,
    sale: i % 2 === 0,
    category: 'fashion',
    description
  });
}

// 6. Electronics (18 items)
const electronicsItems = ['Wireless ANC Earbuds', 'Bluetooth SoundBar Speaker', 'Mechanical Tactile Keyboard', 'Precision Wireless Mouse', 'UltraHD Web Camera', 'Smart Router WiFi 6', 'External Portable SSD', 'Multiport USB-C Hub', 'Vlogger Ring Light Setup', 'Gaming Audio Headset'];
const electronicsBrands = ['Sony', 'Logitech', 'Razer', 'JBL', 'Samsung', 'SanDisk', 'TP-Link'];
const electronicsColors = ['Matte Black', 'Glacier Silver', 'Gunmetal Gray', 'RGB Accent', 'Snow White'];
const electronicsImages = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
  'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
  'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400',
  'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400',
  'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
  'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400',
  'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=400',
  'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
  'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400'
];

const electronics = [];
for (let i = 0; i < 18; i++) {
  const brand = electronicsBrands[i % electronicsBrands.length];
  const item = electronicsItems[i % electronicsItems.length];
  const title = `${brand} ${item}`;
  const price = 2500 + i * 1900;
  const oldPrice = Math.round(price * 1.15 / 100) * 100;
  const color = electronicsColors[i % electronicsColors.length];
  const rating = (4.2 + (i * 0.05) % 0.8).toFixed(1);
  const image = electronicsImages[i % electronicsImages.length];
  const description = `High-performance ${title}. Features cutting-edge technology, user-friendly features, and a sleek ${color} design. Engineered to elevate your digital experience.`;
  electronics.push({
    title,
    price,
    oldPrice,
    color,
    rating: parseFloat(rating),
    image,
    sale: i % 2 === 0,
    category: 'electronics',
    description
  });
}

// 7. Digital Products (18 items)
const digitalItems = ['Python Coding Bootcamp', 'Full UI/UX Masterclass', 'SEO Strategies Guide', 'Responsive Resume Templates', 'Stock Travel Photo Bundle', 'Financial Budgeting Spreadsheets', 'Lo-Fi Audio Beat Packs', 'Custom Notion Templates', 'WordPress Starter Theme'];
const digitalPublishers = ['CodeAcademy', 'CreativeHub', 'GrowthHacker', 'DesignStudio', 'DevPacks'];
const digitalImages = [
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
  'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400'
];

const digitalProducts = [];
for (let i = 0; i < 18; i++) {
  const publisher = digitalPublishers[i % digitalPublishers.length];
  const item = digitalItems[i % digitalItems.length];
  const title = `${publisher} ${item} v${i + 1}`;
  const price = 499 + i * 350;
  const oldPrice = Math.round(price * 1.5 / 50) * 50;
  const rating = (4.4 + (i * 0.04) % 0.6).toFixed(1);
  const image = digitalImages[i % digitalImages.length];
  const description = `Unlock your potential with ${title}. A fully downloadable resource packed with premium instructions, assets, and guides designed by industry experts. Instant delivery.`;
  digitalProducts.push({
    title,
    price,
    oldPrice,
    rating: parseFloat(rating),
    image,
    sale: i % 3 === 0,
    category: 'digital-product',
    description
  });
}

// 8. Home Appliances (18 items)
const applianceItems = ['True HEPA Air Purifier', 'Espresso Maker Station', 'Professional Stand Mixer', 'Masticating Slow Juicer', 'Digital Air Fryer Pro', 'Intelligent Robot Vacuum', 'Power Smoothie Blender', 'Precision Temperature Kettle', 'Compact Garment Steamer'];
const applianceBrands = ['Dyson', 'Breville', 'KitchenAid', 'Philips', 'Cosori', 'Roborock', 'Tefal'];
const applianceColors = ['Stainless Steel', 'Classic Red', 'Matte Black', 'Polar White', 'Cream Retro'];
const applianceImages = [
  'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400',
  'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400',
  'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400',
  'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400',
  'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=400',
  'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=400'
];

const homeAppliances = [];
for (let i = 0; i < 18; i++) {
  const brand = applianceBrands[i % applianceBrands.length];
  const item = applianceItems[i % applianceItems.length];
  const title = `${brand} ${item}`;
  const price = 4900 + i * 2900;
  const oldPrice = Math.round(price * 1.15 / 100) * 100;
  const color = applianceColors[i % applianceColors.length];
  const rating = (4.3 + (i * 0.04) % 0.7).toFixed(1);
  const image = applianceImages[i % applianceImages.length];
  const description = `Simplify your daily routine with the ${title}. Featuring smart controls, energy-efficient performance, and a stunning ${color} finish, it's a perfect addition to any modern home.`;
  homeAppliances.push({
    title,
    price,
    oldPrice,
    color,
    rating: parseFloat(rating),
    image,
    sale: i % 2 === 0,
    category: 'home-appliances',
    description
  });
}

// 9. Vegetables (18 items)
const vegetableItems = ['Organic Carrots', 'Farm Fresh Spinach', 'Red Potatoes Bag', 'Fresh Broccoli Crowns', 'Mixed Bell Peppers', 'Vine Cherry Tomatoes', 'Sweet Potatoes', 'Fresh Garden Asparagus', 'Crisp Iceberg Lettuce', 'Organic Garlic Bulbs'];
const vegetableSources = ['LocalHarvest', 'GreenValley', 'OrganicFarms', 'NatureFresh', 'EarthBound'];
const vegetableImages = [
  'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=400',
  'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=400',
  'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400',
  'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=400',
  'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=400',
  'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400',
  'https://images.unsplash.com/photo-1568584711271-6c929fb49b60?w=400'
];

const vegetables = [];
for (let i = 0; i < 18; i++) {
  const source = vegetableSources[i % vegetableSources.length];
  const item = vegetableItems[i % vegetableItems.length];
  const title = `${source} ${item}`;
  const price = 120 + i * 40;
  const oldPrice = Math.round(price * 1.30 / 10) * 10;
  const rating = (4.5 + (i * 0.03) % 0.5).toFixed(1);
  const image = vegetableImages[i % vegetableImages.length];
  const description = `100% organic and fresh ${title}. Sourced directly from local farmers, packed with essential nutrients, and delivered fresh to your doorstep within 24 hours.`;
  vegetables.push({
    title,
    price,
    oldPrice,
    rating: parseFloat(rating),
    image,
    sale: i % 3 === 0,
    category: 'vegetable',
    description
  });
}

// 10. Decor (18 items)
const decorItems = ['Handmade Ceramic Vase', 'Abstract Canvas Art', 'Scented Soy Candle Set', 'Velvet Throw Pillows', 'Floating Wall Shelves', 'Minimalist Table Lamp', 'Gold Tabletop Mirror', 'Macrame Wall Hanging', 'Geometric Jewelry Box'];
const decorStyles = ['Boho Chic', 'Scandinavian Modern', 'Vintage Rust', 'Nordic Minimalist'];
const decorColors = ['Beige', 'Terracotta', 'Slate Blue', 'Charcoal', 'Sage Green', 'Gold Accent'];
const decorImages = [
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400',
  'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400',
  'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400',
  'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400',
  'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400',
  'https://images.unsplash.com/photo-1507646227500-4d389b0012be?w=400'
];

const decor = [];
for (let i = 0; i < 18; i++) {
  const style = decorStyles[i % decorStyles.length];
  const item = decorItems[i % decorItems.length];
  const title = `${style} ${item}`;
  const price = 900 + i * 350;
  const oldPrice = Math.round(price * 1.25 / 50) * 50;
  const color = decorColors[i % decorColors.length];
  const rating = (4.1 + (i * 0.05) % 0.9).toFixed(1);
  const image = decorImages[i % decorImages.length];
  const description = `Add a touch of elegance to your home with the ${title}. Designed with fine attention to detail, its warm tones and modern style make it a perfect accent piece for any room.`;
  decor.push({
    title,
    price,
    oldPrice,
    color,
    rating: parseFloat(rating),
    image,
    sale: i % 2 === 0,
    category: 'decor',
    description
  });
}

// 11. Books (18 items)
const bookTitles = [
  'Designing Data-Intensive Applications', 'The Lean Startup', 'Atomic Habits', 
  'Sapiens: A History of Humankind', 'Educated: A Memoir', 'Thinking, Fast and Slow', 
  'The Subtle Art of Not Giving a F*ck', 'Clean Code: A Handbook', 'Zero to One', 
  'Deep Work', 'Start With Why', 'The Alchemist', 
  'The Pragmatic Programmer', 'Code Complete', 'Refactoring', 
  'Introduction to Algorithms', 'Design Patterns', 'Soft Skills'
];
const bookAuthors = [
  'Martin Kleppmann', 'Eric Ries', 'James Clear', 
  'Yuval Noah Harari', 'Tara Westover', 'Daniel Kahneman', 
  'Mark Manson', 'Robert C. Martin', 'Peter Thiel', 
  'Cal Newport', 'Simon Sinek', 'Paulo Coelho', 
  'Andrew Hunt', 'Steve McConnell', 'Martin Fowler', 
  'Thomas H. Cormen', 'Erich Gamma', 'John Sonmez'
];
const bookImages = [
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
  'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400',
  'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
  'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400'
];

const books = [];
for (let i = 0; i < 18; i++) {
  const title = bookTitles[i];
  const author = bookAuthors[i];
  const price = 450 + i * 85;
  const oldPrice = Math.round(price * 1.25 / 10) * 10;
  const rating = (4.4 + (i * 0.03) % 0.6).toFixed(1);
  const image = bookImages[i % bookImages.length];
  const description = `"${title}" by ${author}. A masterfully written, highly acclaimed book that offers valuable insights and practical guidance. A must-read for anyone looking to broaden their perspective.`;
  books.push({
    title,
    price,
    oldPrice,
    rating: parseFloat(rating),
    image,
    sale: i % 3 === 0,
    category: 'books',
    description
  });
}

// Combine all product lists
const allProductsToSeed = [
  ...smartphones,
  ...watches,
  ...furniture,
  ...kids,
  ...fashion,
  ...electronics,
  ...digitalProducts,
  ...homeAppliances,
  ...vegetables,
  ...decor,
  ...books
];

// Seed process
const seedDatabase = async () => {
  try {
    console.log('🔌 Connecting to MongoDB Database...');
    await connectDB();
    
    console.log('🚀 Seeding 200 products into collection...');
    
    let addedCount = 0;
    // We assign product IDs sequentially starting from 1001 to 1200
    let startId = 1001;

    for (const prod of allProductsToSeed) {
      const currentId = startId++;
      prod.id = currentId;

      // Check if product with this ID already exists
      const exists = await Product.findOne({ id: currentId });
      
      if (!exists) {
        await Product.create(prod);
        addedCount++;
      } else {
        await Product.updateOne(
          { id: currentId },
          { $set: prod }
        );
        addedCount++;
      }
    }
    
    console.log(`✅ Successfully stored ${addedCount} products (IDs 1001-1200) permanently in MongoDB!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error executing database seeding:', err.message);
    process.exit(1);
  }
};

seedDatabase();
