const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Product = require('./models/Product');

// Load environment variables
dotenv.config();

const newProductsList = [
  // ─── Smartphones (5 items) ──────────────────────────────────────────────────
  {
    id: 201,
    title: 'Nothing Phone (2a)',
    price: 34900,
    oldPrice: 39900,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=400',
    sale: true,
    description: 'Powerful performance meets a unique transparent design. The Nothing Phone (2a) features a custom MediaTek Dimensity 7200 Pro chip and dual 50MP cameras.',
    category: 'smartphones'
  },
  {
    id: 202,
    title: 'Google Pixel 8a',
    price: 49900,
    oldPrice: 54900,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400',
    sale: true,
    description: 'The Google Pixel 8a is loaded with Google AI, like Best Take, Audio Magic Eraser, and Circle to Search. Features a stunning 120Hz Actua display.',
    category: 'smartphones'
  },
  {
    id: 203,
    title: 'Samsung Galaxy A55',
    price: 44900,
    oldPrice: 49900,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
    sale: false,
    description: 'Bring bright colors to life with the Galaxy A55. Featuring a sleek metal flat frame, a triple camera setup, and an immersive FHD+ Super AMOLED screen.',
    category: 'smartphones'
  },
  {
    id: 204,
    title: 'Sony Xperia 5 V',
    price: 89900,
    oldPrice: 99900,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=400',
    sale: true,
    description: 'A compact flagship with professional camera technology. Features Sony\'s next-generation Exmor T sensor and a beautiful 21:9 OLED display.',
    category: 'smartphones'
  },
  {
    id: 205,
    title: 'Realme 12 Pro+',
    price: 39900,
    oldPrice: 44900,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1598327106026-d9521da673d1?w=400',
    sale: true,
    description: 'Redefine photography with the periscope portrait camera. Features a premium luxury watch-inspired design by master designer Ollivier Savéo.',
    category: 'smartphones'
  },

  // ─── Watches (5 items) ─────────────────────────────────────────────────────
  {
    id: 206,
    title: 'Apple Watch Ultra 2',
    price: 79900,
    oldPrice: 84900,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=400',
    sale: false,
    description: 'The ultimate sports and adventure watch. Featuring a bright Always-On Retina display, dual-frequency GPS, and a battery that lasts up to 72 hours.',
    category: 'watches'
  },
  {
    id: 207,
    title: 'Garmin Fenix 7 Pro',
    price: 69900,
    oldPrice: 79900,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400',
    sale: true,
    description: 'Solar-powered multisport GPS watch designed for elite athletes and adventurers. Features a built-in LED flashlight and advanced training metrics.',
    category: 'watches'
  },
  {
    id: 208,
    title: 'Fitbit Charge 6',
    price: 15900,
    oldPrice: 17900,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400',
    sale: true,
    description: 'Track your health and fitness with built-in GPS, premium sleep tools, heart rate tracking, and integrated Google Maps.',
    category: 'watches'
  },
  {
    id: 209,
    title: 'Withings Steel HR',
    price: 17900,
    oldPrice: 19900,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=400',
    sale: false,
    description: 'A hybrid smartwatch with a classic analog design, continuous heart rate monitoring, multisport tracking, and smart notifications.',
    category: 'watches'
  },
  {
    id: 210,
    title: 'Fossil Heritage Automatic',
    price: 29900,
    oldPrice: 34900,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400',
    sale: true,
    description: 'A tribute to Fossil\'s heritage. Featuring an exposed automatic movement, stainless steel case, and a genuine leather strap.',
    category: 'watches'
  },

  // ─── Furniture (5 items) ───────────────────────────────────────────────────
  {
    id: 211,
    title: 'Industrial Wooden Desk',
    price: 24900,
    oldPrice: 29900,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=400',
    sale: true,
    description: 'Perfect for home offices. Made with solid reclaimed pine wood and a black steel frame for a premium industrial feel.',
    category: 'furniture'
  },
  {
    id: 212,
    title: 'Plush Accent Armchair',
    price: 19900,
    oldPrice: 24900,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400',
    sale: true,
    description: 'Plush velvet accent chair. Provides cozy seating and brings modern elegance into your bedroom or living room.',
    category: 'furniture'
  },
  {
    id: 213,
    title: 'Minimalist Floating Shelf',
    price: 3900,
    oldPrice: 4900,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400',
    sale: false,
    description: 'Keep your room tidy and elegant. A set of three dark-finish wooden shelves that float seamlessly on your walls.',
    category: 'furniture'
  },
  {
    id: 214,
    title: 'Modern Glass Coffee Table',
    price: 17900,
    oldPrice: 22900,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400',
    sale: true,
    description: 'Elevate your living room aesthetics with this sleek glass top coffee table featuring unique geometric wooden legs.',
    category: 'furniture'
  },
  {
    id: 215,
    title: 'Adjustable Bar Stools (Pair)',
    price: 14900,
    oldPrice: 17900,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=400',
    sale: true,
    description: 'A set of two padded bar stools with matte-black metal bases and fully adjustable hydraulic swivels.',
    category: 'furniture'
  },

  // ─── Kids (5 items) ────────────────────────────────────────────────────────
  {
    id: 216,
    title: 'Magnetic Building Tiles (100)',
    price: 5900,
    oldPrice: 7900,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400',
    sale: true,
    description: 'Creative and educational magnetic building toy set. Spark the imagination of young builders in constructing 3D towers and structures.',
    category: 'kids'
  },
  {
    id: 217,
    title: 'Dinosaur Excavation Kit',
    price: 2400,
    oldPrice: 3400,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1552084117-56a987666449?w=400',
    sale: false,
    description: 'Dig up and build dinosaur fossils! High-quality clay bricks with safety-tested chisel tools for young explorers.',
    category: 'kids'
  },
  {
    id: 218,
    title: 'Remote Control Stunt Car',
    price: 3400,
    oldPrice: 4400,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1558244661-d248897f7bc4?w=400',
    sale: true,
    description: 'Perform extreme flips and spins. Double-sided 360-degree high-speed stunt car with a 2.4GHz remote system.',
    category: 'kids'
  },
  {
    id: 219,
    title: 'Interactive Learning Globe',
    price: 4900,
    oldPrice: 5900,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1533906966484-a9c978a3f090?w=400',
    sale: false,
    description: 'A touch-sensitive educational world globe that teaches geography, capitals, and trivia through interactive quizzes.',
    category: 'kids'
  },
  {
    id: 220,
    title: 'Kids Telescope with Tripod',
    price: 7900,
    oldPrice: 9900,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1618354691792-d1d42acfd860?w=400',
    sale: true,
    description: 'Explore the night sky and learn astronomy. Lightweight astronomical refractor telescope with multi-power eyepieces.',
    category: 'kids'
  }
];

const seed20 = async () => {
  try {
    console.log('🔌 Connecting to MongoDB Database...');
    await connectDB();
    
    console.log('🚀 Checking for products collection status...');
    
    // Check if any product from seed list already exists to prevent duplicate key errors
    let addedCount = 0;
    for (const prod of newProductsList) {
      const exists = await Product.findOne({ id: prod.id });
      if (!exists) {
        await Product.create(prod);
        addedCount++;
      } else {
        await Product.updateOne(
          { id: prod.id },
          {
            $set: {
              title: prod.title,
              price: prod.price,
              oldPrice: prod.oldPrice,
              image: prod.image,
              description: prod.description,
              sale: prod.sale,
              rating: prod.rating,
              category: prod.category
            }
          }
        );
        addedCount++;
      }
    }
    
    console.log(`✅ Successfully stored ${addedCount} new and unique products permanently in MongoDB!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error executing database seeding:', err.message);
    process.exit(1);
  }
};

seed20();
