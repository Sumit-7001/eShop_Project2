import { brandProducts } from '../data/dummyData';

export const attributesData = [

  { name: 'Room', options: ['Living Room', 'Bedroom', 'Dining Room', 'Office'], validCategories: ['furniture'] },
  { name: 'Furniture Material', options: ['Wood', 'Metal', 'Glass', 'Fabric'], validCategories: ['furniture'] },
  { name: 'Produce Type', options: ['Organic', 'Non-Organic', 'Locally Grown'], validCategories: ['vegetable'] },
  { name: 'Weight/Packaging', options: ['250g', '500g', '1kg', 'Bunch'], validCategories: ['vegetable'] },


  { name: 'Apparel Color', options: ['Black', 'White', 'Red', 'Blue', 'Pink'], validCategories: ['fashion'] },
  { name: 'Size', options: ['S', 'M', 'L', 'XL', 'XXL'], validCategories: ['fashion'] },
  { name: 'Fabric', options: ['Cotton', 'Leather', 'Silk', 'Denim'], validCategories: ['fashion'] },

  { name: 'Battery Power', options: ['Under 3000 mAh', '3000 - 4000 mAh', 'Above 4000 mAh'], validCategories: ['smartphones', 'electronics'] },
  { name: 'Color', options: ['Black', 'Silver', 'Golden', 'Blue'], validCategories: ['smartphones', 'electronics', 'kids', 'decor'] },
  { name: 'Connectivity technologies', options: ['Bluetooth', 'Wi-Fi', 'USB', 'NFC'], validCategories: ['smartphones', 'electronics'] },
  { name: 'Display Technology', options: ['OLED', 'AMOLED', 'LCD', 'IPS'], validCategories: ['smartphones', 'electronics'] },
  { name: 'Expandable Storage', options: ['Up to 128GB', 'Up to 256GB', 'Up to 512GB', '1TB+'], validCategories: ['smartphones', 'electronics'] },
  { name: 'Item Weight', options: ['Under 150g', '150g - 200g', 'Above 200g'], validCategories: ['smartphones', 'electronics', 'kids', 'decor', 'books'] },
  { name: 'Material Type', options: ['Plastic', 'Metal', 'Glass', 'Leather'], validCategories: ['decor'] }
];

// Helper to consistently assign an attribute option to a product based on its ID
// This ensures that our dummy products can actually be filtered by attributes!
export const getProductAttributeOption = (productId, attributeName) => {
  const attr = attributesData.find(a => a.name === attributeName);
  if (!attr) return null;
  
  // Create a pseudo-random hash from the product ID and attribute name
  let hash = productId;
  for (let i = 0; i < attributeName.length; i++) {
    hash = ((hash << 5) - hash) + attributeName.charCodeAt(i);
    hash |= 0; 
  }
  
  const index = Math.abs(hash) % attr.options.length;
  return attr.options[index];
};

// Available brands list to simulate brand assignments
const allBrands = [
  'adidas', 'nike', 'aldo', 'zara', 'puma', 'levis', 'gucci', 'asics', 'hm', 'apple',
  'samsung', 'sony', 'microsoft', 'amazon', 'dell', 'hp', 'lenovo', 'asus', 'acer', 'logitech',
  'razer', 'corsair', 'msi', 'intel', 'amd', 'nvidia', 'gigabyte', 'western-digital', 'seagate', 'crucial'
];

export const applyFilters = (products, selectedFilters) => {
  let filtered = [...products];

  // 1. Filter by Brands
  if (selectedFilters.brands && selectedFilters.brands.length > 0) {
    let brandSpecificProducts = [];
    selectedFilters.brands.forEach(brandSlug => {
      if (brandProducts[brandSlug]) {
        brandSpecificProducts = [...brandSpecificProducts, ...brandProducts[brandSlug]];
      }
    });

    if (brandSpecificProducts.length > 0) {
      // If we found specific products for the selected brands, use them instead!
      filtered = brandSpecificProducts;
    } else {
      // Fallback to simulation if brand is not explicitly in brandProducts
      filtered = filtered.filter(p => {
        const textMatch = selectedFilters.brands.some(brandSlug => p.title.toLowerCase().includes(brandSlug.toLowerCase()));
        if (textMatch) return true;
        
        const simulatedBrandIndex = (typeof p.id === 'number' ? p.id : p.id.charCodeAt(0)) % allBrands.length;
        const simulatedBrand = allBrands[simulatedBrandIndex];
        return selectedFilters.brands.includes(simulatedBrand);
      });
    }
  }

  // 2. Filter by Categories
  if (selectedFilters.categories && selectedFilters.categories.length > 0) {
    // If we have categories selected, let's fake a match using modulo so we don't return 0 results
    filtered = filtered.filter(p => {
      // Simulate that each product belongs to one of the 30 categories
      const numericId = typeof p.id === 'number' ? p.id : p.id.charCodeAt(0);
      const simulatedCategoryId = (numericId % 30) + 1;
      return selectedFilters.categories.includes(simulatedCategoryId);
    });
  }

  // 3. Filter by Attributes
  if (selectedFilters.attributes) {
    Object.keys(selectedFilters.attributes).forEach(attrName => {
      const selectedOptions = selectedFilters.attributes[attrName];
      if (selectedOptions && selectedOptions.length > 0) {
        filtered = filtered.filter(p => {
          // If product has explicit attributes defined
          if (p.attributes && p.attributes[attrName]) {
            const productAttr = p.attributes[attrName];
            if (Array.isArray(productAttr)) {
              return selectedOptions.some(opt => productAttr.includes(opt));
            } else {
              return selectedOptions.includes(productAttr);
            }
          }

          // If the product title contains the option, it's a direct match
          // Use regex with word boundaries to prevent 'red' matching 'powered'
          const textMatch = selectedOptions.some(opt => {
            const regex = new RegExp(`\\b${opt}\\b`, 'i');
            return regex.test(p.title) || (p.description && regex.test(p.description));
          });
          
          return textMatch;
        });
      }
    });
  }

  return filtered;
};
