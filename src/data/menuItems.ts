export type MenuCategory =
  | "Baskets"
  | "Sandwiches"
  | "Sandwiches & Fries"
  | "Plates"
  | "Pounds, Ribs & Chickens"
  | "Family Packs"
  | "Nachos"
  | "Loaded Potatoes"
  | "Bowls"
  | "Sliders"
  | "Sides"
  | "Desserts"
  | "Drinks"
  | "Sauces"
  | "Kids Meals"
  | "Extras";

export type MenuItem = {
  id: string;
  name: string;
  price: string;
  category: MenuCategory;
  description?: string;
  image?: string;
  alt?: string;
  badge?: string;
  featured?: boolean;
};

export const menuCategories: MenuCategory[] = [
  "Baskets",
  "Sandwiches",
  "Sandwiches & Fries",
  "Plates",
  "Pounds, Ribs & Chickens",
  "Family Packs",
  "Nachos",
  "Loaded Potatoes",
  "Bowls",
  "Sliders",
  "Sides",
  "Desserts",
  "Drinks",
  "Sauces",
  "Kids Meals",
  "Extras",
];

export const featuredMenuItems: MenuItem[] = [
  {
    id: "pork-nachos-with-fries",
    name: "Pork Nachos w/ Fries",
    price: "$11.50",
    category: "Nachos",
    badge: "Featured",
    image: "/images/menu-1.png",
    alt: "Pork Nachos with Fries",
    description:
      "Crinkle-cut fries topped with pulled pork, Ronnie Q’s red signature sauce, melted nacho cheese, and jalapeños.",
    featured: true,
  },
  {
    id: "whole-chicken",
    name: "Whole Chicken",
    price: "$12.25",
    category: "Pounds, Ribs & Chickens",
    image: "/images/menu-2.png",
    alt: "Whole Chicken",
    description:
      "A whole barbecue chicken cooked until tender, juicy, and full of Ronnie Q flavor.",
    featured: true,
  },
  {
    id: "sliders-only",
    name: "Sliders",
    price: "$2.25",
    category: "Sliders",
    badge: "Popular",
    image: "/images/menu-3.png",
    alt: "Pork Sliders with Fries",
    description:
      "Pulled pork sliders served with Ronnie Q’s bold barbecue flavor.",
    featured: true,
  },
  {
    id: "fries",
    name: "Fries",
    price: "$4.75",
    category: "Sides",
    image: "/images/menu-4.png",
    alt: "French Fries",
    description:
      "Crispy golden fries served hot and fresh, perfect on the side or loaded with Ronnie Q flavor.",
    featured: true,
  },
  {
    id: "one-pound-pork-family-pack",
    name: "1 lb Pork Family Pack",
    price: "$23.99",
    category: "Family Packs",
    image: "/images/menu-5.png",
    alt: "1 lb Pork Family Pack",
    description:
      "One pound of pulled pork served family-style with sides, buns, and classic Ronnie Q comfort.",
    featured: true,
  },
  {
    id: "banana-pudding",
    name: "Banana Pudding",
    price: "$3.75",
    category: "Desserts",
    image: "/images/menu-6.png",
    alt: "Banana Pudding",
    description:
      "A Ronnie Q favorite made with creamy banana pudding, vanilla wafers, and classic Southern comfort.",
    featured: true,
  },
];

export const fullMenuItems: MenuItem[] = [
  // Baskets
  { id: "pork-basket", name: "Pork Basket", price: "$9.50", category: "Baskets" },
  { id: "chicken-basket", name: "Chicken Basket", price: "$11.75", category: "Baskets" },
  { id: "bbq-beef-basket", name: "BBQ Beef Basket", price: "$12.50", category: "Baskets" },
  { id: "rib-basket", name: "Rib Basket", price: "$10.50", category: "Baskets" },
  { id: "jumbo-pork-basket", name: "Jumbo Pork Basket", price: "$10.25", category: "Baskets" },
  { id: "mopped-chicken-basket", name: "Mopped Chicken Basket", price: "$12.50", category: "Baskets" },

  // Sandwiches
  { id: "regular-bbq-pork-sandwich", name: "Regular BBQ Pork Sandwich", price: "$7.25", category: "Sandwiches" },
  { id: "beef-sandwich", name: "Beef Sandwich", price: "$9.50", category: "Sandwiches" },
  { id: "jumbo-chicken-sandwich", name: "Jumbo Chicken Sandwich", price: "$9.75", category: "Sandwiches" },
  { id: "rib-sandwich", name: "Rib Sandwich", price: "$9.25", category: "Sandwiches" },
  { id: "jumbo-pork-sandwich", name: "Jumbo Pork Sandwich", price: "$8.00", category: "Sandwiches" },
  { id: "mopped-chicken-sandwich", name: "Mopped Chicken Sandwich", price: "$9.50", category: "Sandwiches" },
  { id: "jumbo-beef-sandwich", name: "Jumbo Beef Sandwich", price: "$10.50", category: "Sandwiches" },
  { id: "chicken-sandwich", name: "Chicken Sandwich", price: "$8.75", category: "Sandwiches" },
  { id: "jumbo-rib-sandwich", name: "Jumbo Rib Sandwich", price: "$10.25", category: "Sandwiches" },

  // Sandwiches & Fries
  { id: "pork-and-fries", name: "Pork & Fries", price: "$11.75", category: "Sandwiches & Fries" },
  { id: "beef-and-fries", name: "Beef & Fries", price: "$14.25", category: "Sandwiches & Fries" },
  { id: "chicken-sandwich-and-fries", name: "Chicken Sandwich & Fries", price: "$13.75", category: "Sandwiches & Fries" },
  { id: "rib-sandwich-and-fries", name: "Rib Sandwich & Fries", price: "$13.50", category: "Sandwiches & Fries" },
  { id: "jumbo-pork-and-fries", name: "Jumbo Pork & Fries", price: "$12.25", category: "Sandwiches & Fries" },
  { id: "jumbo-chicken-and-fries", name: "Jumbo Chicken & Fries", price: "$14.75", category: "Sandwiches & Fries" },
  { id: "jumbo-beef-and-fries", name: "Jumbo Beef & Fries", price: "$15.99", category: "Sandwiches & Fries" },
  { id: "jumbo-rib-and-fries", name: "Jumbo Rib & Fries", price: "$14.50", category: "Sandwiches & Fries" },
  { id: "mopped-chicken-sandwich-and-fries", name: "Mopped Chicken Sandwich & Fries", price: "$14.50", category: "Sandwiches & Fries" },
  { id: "half-chicken-and-fries", name: "Half Chicken & Fries", price: "$12.25", category: "Sandwiches & Fries" },
  { id: "half-mopped-chicken-and-fries", name: "Half Mopped Chicken & Fries", price: "$13.25", category: "Sandwiches & Fries" },

  // Plates
  { id: "half-chicken-plate", name: "1/2 Chicken Plate", price: "$12.75", category: "Plates" },
  { id: "rib-plate", name: "Rib Plate", price: "$13.75", category: "Plates" },
  { id: "beef-plate", name: "Beef Plate", price: "$13.75", category: "Plates" },
  { id: "pork-plate", name: "Pork Plate", price: "$12.25", category: "Plates" },
  { id: "half-mopped-chicken-plate", name: "1/2 Mopped Chicken Plate", price: "$13.75", category: "Plates" },
  { id: "jumbo-pork-plate", name: "Jumbo Pork Plate", price: "$13.25", category: "Plates" },
  { id: "chicken-sandwich-plate", name: "Chicken Sandwich Plate", price: "$14.00", category: "Plates" },
  { id: "mopped-chicken-sandwich-plate", name: "Mopped Chicken Sandwich Plate", price: "$13.25", category: "Plates" },
  { id: "rib-sandwich-plate", name: "Rib Sandwich Plate", price: "$15.50", category: "Plates" },

  // Pounds, Ribs & Chickens
  { id: "pound-bbq-pork", name: "1 Lb Pork", price: "$13.25", category: "Pounds, Ribs & Chickens" },
  { id: "whole-chicken-full", name: "Whole Chicken", price: "$12.25", category: "Pounds, Ribs & Chickens" },
  { id: "pound-beef-bbq", name: "1 Lb Beef", price: "$23.99", category: "Pounds, Ribs & Chickens" },
  { id: "whole-slab-ribs", name: "Whole Slab Ribs", price: "$27.99", category: "Pounds, Ribs & Chickens" },
  { id: "half-pound-pork", name: "1/2 Lb Pork", price: "$8.50", category: "Pounds, Ribs & Chickens" },
  { id: "half-chicken", name: "1/2 Chicken", price: "$7.50", category: "Pounds, Ribs & Chickens" },
  { id: "half-pound-beef-bbq", name: "1/2 Lb Beef", price: "$13.99", category: "Pounds, Ribs & Chickens" },
  { id: "half-slab-ribs", name: "1/2 Slab Ribs", price: "$14.25", category: "Pounds, Ribs & Chickens" },
  { id: "mopped-chicken-whole", name: "Whole Mopped Chicken", price: "$14.25", category: "Pounds, Ribs & Chickens" },
  { id: "mopped-chicken-half", name: "1/2 Mopped Chicken", price: "$9.00", category: "Pounds, Ribs & Chickens" },

  // Family Packs
  { id: "chicken-family-pack", name: "Chicken Family Pack", price: "$32.99", category: "Family Packs" },
  { id: "two-pound-pork-family-pack", name: "2 lb Pork Family Pack", price: "$33.99", category: "Family Packs" },
  { id: "two-pound-beef-family-pack", name: "2 lb Beef Family Pack", price: "$49.99", category: "Family Packs" },
  { id: "one-pound-pork-family-pack-full", name: "1 lb Pork Family Pack", price: "$23.99", category: "Family Packs" },
  { id: "one-pound-beef-family-pack", name: "1 lb Beef Family Pack", price: "$35.99", category: "Family Packs" },
  { id: "mopped-chicken-family-pack", name: "Mopped Chicken Family Pack", price: "$33.99", category: "Family Packs" },

  // Nachos
  { id: "pork-nachos", name: "Pork Nachos", price: "$11.25", category: "Nachos" },
  { id: "pork-nachos-with-fries-full", name: "Pork Nachos w/ Fries", price: "$11.50", category: "Nachos" },

  // Loaded Potatoes
  { id: "pork-potato", name: "Pork Potato", price: "$8.50", category: "Loaded Potatoes" },
  { id: "chicken-potato", name: "Chicken Potato", price: "$8.50", category: "Loaded Potatoes" },
  { id: "beef-potato", name: "Beef Potato", price: "$11.99", category: "Loaded Potatoes" },
  { id: "plain-potato", name: "Plain Potato", price: "$6.25", category: "Loaded Potatoes" },
  { id: "mopped-chicken-potato", name: "Mopped Chicken Potato", price: "$10.50", category: "Loaded Potatoes" },

  // Bowls
  { id: "pork-bowl", name: "Pork Bowl", price: "$6.75", category: "Bowls" },

  // Sliders
  { id: "sliders-lunch-fries", name: "Lunch Sliders w/ Fries", price: "$12.75", category: "Sliders" },
  { id: "sliders-lunch-chips", name: "Lunch Sliders w/ Chips", price: "$11.75", category: "Sliders" },
  { id: "sliders-dinner", name: "Dinner Sliders", price: "$15.75", category: "Sliders" },
  { id: "sliders-12-count-family-pack", name: "12 ct. Slider Family Pack", price: "$19.75", category: "Sliders" },
  { id: "sliders-24-count-gift-pack", name: "24 ct. Slider Gift Pack", price: "$39.99", category: "Sliders" },
  { id: "sliders-only", name: "Sliders Only", price: "$2.25", category: "Sliders" },

  // Sides
  { id: "chips", name: "Chips", price: "$1.25", category: "Sides" },
  { id: "mac-and-cheese", name: "Mac & Cheese", price: "$2.65", category: "Sides" },
  { id: "green-beans", name: "Green Beans", price: "$2.65", category: "Sides" },
  { id: "vinegar-slaw", name: "Vinegar Slaw", price: "$2.65", category: "Sides" },
  { id: "potato-salad", name: "Potato Salad", price: "$2.65", category: "Sides" },
  { id: "fried-okra", name: "Fried Okra", price: "$2.65", category: "Sides" },
  { id: "baked-beans", name: "Baked Beans", price: "$2.65", category: "Sides" },
  { id: "white-beans", name: "White Beans", price: "$2.65", category: "Sides" },
  { id: "mayo-slaw", name: "Mayo Slaw", price: "$2.65", category: "Sides" },



  // Drinks
  { id: "tea-lemonade-large", name: "Large Drink", price: "$2.25", category: "Drinks" },
  { id: "tea-lemonade-small", name: "Small Drink", price: "$1.75", category: "Drinks" },


  // Kids Meals
  { id: "jr-pork-sandwich-chips-drink", name: "Jr. Pork Sandwich w/ Chips & Drink", price: "$8.50", category: "Kids Meals" },
  { id: "jr-pork-sandwich-only", name: "Jr. Pork Sandwich Only", price: "$6.85", category: "Kids Meals" },

  // Extras
  { id: "pork-skins", name: "Pork Skins", price: "$7.99", category: "Extras" },
];