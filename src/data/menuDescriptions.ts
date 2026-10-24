import type { MenuItem } from "@/data/menuItems";

function getMeatName(name: string) {
  const lowerName = name.toLowerCase();

  if (lowerName.includes("pork")) return "pulled pork";
  if (lowerName.includes("beef")) return "BBQ beef";
  if (lowerName.includes("brisket")) return "brisket";
  if (lowerName.includes("chicken")) return "barbecue chicken";
  if (lowerName.includes("rib")) return "ribs";

  return "Ronnie's Q barbecue";
}

function getSizeDescription(name: string) {
  const lowerName = name.toLowerCase();

  if (lowerName.includes("jumbo")) return "a larger portion";
  if (lowerName.includes("regular")) return "a classic regular-size portion";
  if (lowerName.includes("small")) return "a smaller portion";
  if (lowerName.includes("large")) return "a larger serving";

  return "a hearty serving";
}

const customDescriptions: Record<string, string> = {
  "pork-nachos":
    "Crinkle-cut fries or chips loaded with pulled pork, nacho cheese, Ronnie's Q barbecue flavor, and jalapeños. A bold, filling favorite.",

  "banana-pudding":
    "Creamy banana pudding with classic Southern flavor. A sweet finish after barbecue, plates, baskets, or family meals.",

  "whole-chicken":
    "A whole barbecue chicken cooked Ronnie's Q style until tender, flavorful, and ready to share.",

  "pork-sliders":
    "Mini pulled pork sandwiches packed with Ronnie's Q barbecue flavor. Great for sharing, lighter meals, or group orders.",

  "french-fries":
    "Hot, crispy crinkle-cut fries served fresh. Great as a side or as the base for loaded BBQ favorites.",

  "1-lb-pork-family-pack":
    "One pound of pulled pork served family-style with classic Ronnie's Q sides and bread options. Built for easy call-ahead meals.",
};

function getSandwichDescription(item: MenuItem) {
  const meat = getMeatName(item.name);
  const size = getSizeDescription(item.name);

  return `A Ronnie's Q sandwich with ${size} of ${meat}, served on a bun with classic barbecue flavor. Add sauce preferences or special instructions before adding it to your Call-In List.`;
}

function getBasketDescription(item: MenuItem) {
  const meat = getMeatName(item.name);

  return `A filling Ronnie's Q basket featuring ${meat}, served as an easy lunch or dinner option. Choose your sauce preference and drink before adding it to your Call-In List.`;
}

function getSandwichAndFriesDescription(item: MenuItem) {
  const meat = getMeatName(item.name);

  return `A Ronnie's Q sandwich made with ${meat} and served with fries. A simple, satisfying BBQ meal for customers who want the sandwich and side together.`;
}

function getPlateDescription(item: MenuItem) {
  const meat = getMeatName(item.name);

  return `A full Ronnie's Q plate featuring ${meat}, served with classic side choices and bread. Choose your sides, bread, and sauce preference before adding it to your Call-In List.`;
}

function getClassicDescription(item: MenuItem) {
  const meat = getMeatName(item.name);

  if (item.name.toLowerCase().includes("lb") || item.name.toLowerCase().includes("pound")) {
    return `A larger portion of ${meat} ordered by the pound. Great for sharing, family meals, gatherings, or building your own BBQ plate at home.`;
  }

  return `A Ronnie's Q BBQ classic featuring ${meat}, cooked with smokehouse flavor and served as a hearty main item.`;
}

function getFamilyPackDescription(item: MenuItem) {
  const meat = getMeatName(item.name);

  return `A family-style Ronnie's Q meal built around ${meat}, made for groups, dinners, and easy call-ahead ordering. Great when you need enough food to share.`;
}

function getNachosDescription(item: MenuItem) {
  const meat = getMeatName(item.name);

  return `Ronnie's Q nachos loaded with ${meat}, nacho cheese, barbecue flavor, and toppings. Choose your sauce and jalapeño preference before adding it to your Call-In List.`;
}

function getLoadedPotatoDescription(item: MenuItem) {
  const meat = getMeatName(item.name);

  return `A loaded baked potato topped Ronnie's Q style with ${meat}, barbecue flavor, and hearty toppings. A filling option when you want BBQ without the bun.`;
}

function getBowlDescription(item: MenuItem) {
  const meat = getMeatName(item.name);

  return `A Ronnie's Q BBQ bowl layered with comfort-food flavor and a hearty serving of ${meat}. Choose your sauce and toppings before adding it to your Call-In List.`;
}

function getSliderDescription(item: MenuItem) {
  const meat = getMeatName(item.name);

  return `Mini Ronnie's Q sliders made with ${meat} and barbecue flavor. Great for smaller meals, sharing, kids, or group-style ordering.`;
}

function getSideDescription(item: MenuItem) {
  const lowerName = item.name.toLowerCase();

  if (lowerName.includes("mac")) {
    return "Creamy mac and cheese served as a classic comfort side with sandwiches, baskets, plates, and family meals.";
  }

  if (lowerName.includes("green bean")) {
    return "Seasoned green beans served as a classic Southern-style side for Ronnie's Q meals.";
  }

  if (lowerName.includes("potato salad")) {
    return "Cool, creamy potato salad that pairs well with barbecue sandwiches, plates, ribs, and chicken.";
  }

  if (lowerName.includes("slaw")) {
    return "Tangy slaw with a fresh bite, perfect on the side or paired with barbecue favorites.";
  }

  if (lowerName.includes("fries")) {
    return "Hot crinkle-cut fries served fresh and crispy. Great as a side or with BBQ sandwiches.";
  }

  return "A classic Ronnie's Q side made to pair with sandwiches, plates, baskets, and family meals.";
}

function getDessertDescription(item: MenuItem) {
  const lowerName = item.name.toLowerCase();

  if (lowerName.includes("banana")) {
    return "Creamy banana pudding with classic Southern flavor. A sweet finish after a Ronnie's Q barbecue meal.";
  }

  return "A sweet Ronnie's Q dessert option, perfect after barbecue or as a treat on the side.";
}

function getDrinkDescription(item: MenuItem) {
  const lowerName = item.name.toLowerCase();

  if (lowerName.includes("tea")) {
    return "Fresh tea to pair with your Ronnie's Q meal.";
  }

  if (lowerName.includes("lemonade")) {
    return "Lemonade served cold and refreshing with sandwiches, baskets, plates, and family meals.";
  }

  if (lowerName.includes("water")) {
    return "Bottled water or water option to pair with your meal.";
  }

  return "A drink option to pair with your Ronnie's Q meal.";
}

export function getMenuItemDescription(item: MenuItem) {
  if (item.description) return item.description;

  const customDescription = customDescriptions[item.id];

  if (customDescription) return customDescription;

  switch (item.category) {
    case "Sandwiches":
      return getSandwichDescription(item);

    case "Baskets":
      return getBasketDescription(item);

    case "Sandwiches & Fries":
      return getSandwichAndFriesDescription(item);

    case "Plates":
      return getPlateDescription(item);

    case "Pounds, Ribs & Chickens":
      return getClassicDescription(item);

    case "Family Packs":
      return getFamilyPackDescription(item);

    case "Nachos":
      return getNachosDescription(item);

    case "Loaded Potatoes":
      return getLoadedPotatoDescription(item);

    case "Bowls":
      return getBowlDescription(item);

    case "Sliders":
      return getSliderDescription(item);

    case "Sides":
      return getSideDescription(item);

    case "Desserts":
      return getDessertDescription(item);

    case "Drinks":
      return getDrinkDescription(item);

    case "Sauces":
      return "Ronnie's Q sauce available for adding extra flavor to your meal or taking home.";

    case "Kids Meals":
      return "A smaller Ronnie's Q meal option made for kids and lighter appetites.";

    case "Extras":
      return "An extra Ronnie's Q item or add-on to complete your order.";

    default:
      return "A Ronnie's Q favorite. Add it to your Call-In List or call to confirm details and availability.";
  }
}