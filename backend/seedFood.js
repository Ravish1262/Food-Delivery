// Seed script to add food items to all menu categories
// Run with: node seedFood.js

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Food model schema (inline to keep script self-contained)
const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
});
const Food = mongoose.models.food || mongoose.model("food", foodSchema);

// All food items matching the frontend assets.js food_list
// Images already exist in the uploads/ folder with these filenames
const foodItems = [
  // ─── Salad (4 items) ───
  {
    name: "Greek Salad",
    description: "Fresh lettuce, ripe tomatoes, cucumbers, olives, and creamy feta cheese tossed in a zesty olive oil dressing.",
    price: 12,
    image: "1722865444288food_1.png",
    category: "Salad",
  },
  {
    name: "Veg Salad",
    description: "A vibrant mix of seasonal vegetables, crunchy croutons, and a light vinaigrette for a refreshing bite.",
    price: 18,
    image: "1722865514626food_2.png",
    category: "Salad",
  },
  {
    name: "Clover Salad",
    description: "Delicate clover greens paired with cherry tomatoes, avocado slices, and a tangy lemon herb dressing.",
    price: 16,
    image: "1722865628915food_3.png",
    category: "Salad",
  },
  {
    name: "Chicken Salad",
    description: "Tender grilled chicken breast over mixed greens with roasted walnuts and a creamy ranch dressing.",
    price: 24,
    image: "1722865668073food_4.png",
    category: "Salad",
  },

  // ─── Rolls (4 items) ───
  {
    name: "Lasagna Rolls",
    description: "Rich layers of pasta rolled with herbed ricotta, ground beef, and smothered in marinara sauce.",
    price: 14,
    image: "1722865738489food_5.png",
    category: "Rolls",
  },
  {
    name: "Peri Peri Rolls",
    description: "Spicy peri peri grilled chicken wrapped in a soft tortilla with pickled onions and chipotle mayo.",
    price: 12,
    image: "1722865934153food_6.png",
    category: "Rolls",
  },
  {
    name: "Chicken Rolls",
    description: "Juicy shredded chicken rolled in a flaky paratha with mint chutney and crisp lettuce.",
    price: 20,
    image: "1722865976487food_7.png",
    category: "Rolls",
  },
  {
    name: "Veg Rolls",
    description: "Crunchy mixed vegetables and paneer wrapped in a whole wheat roti with spicy green chutney.",
    price: 15,
    image: "1722866043779food_8.png",
    category: "Rolls",
  },

  // ─── Deserts (4 items) ───
  {
    name: "Ripple Ice Cream",
    description: "Swirls of rich chocolate ripple through creamy vanilla bean ice cream — an indulgent treat.",
    price: 14,
    image: "1722866109947food_9.png",
    category: "Deserts",
  },
  {
    name: "Fruit Ice Cream",
    description: "A refreshing blend of mango, strawberry, and kiwi folded into smooth, natural fruit ice cream.",
    price: 22,
    image: "1722866148130food_10.png",
    category: "Deserts",
  },
  {
    name: "Jar Ice Cream",
    description: "Layered cookie crumble and salted caramel ice cream served in a charming mason jar.",
    price: 10,
    image: "1722866329894food_11.png",
    category: "Deserts",
  },
  {
    name: "Vanilla Ice Cream",
    description: "Classic Madagascar vanilla bean ice cream, silky smooth and topped with chocolate shavings.",
    price: 12,
    image: "1722866385025food_12.png",
    category: "Deserts",
  },

  // ─── Sandwich (4 items) ───
  {
    name: "Chicken Sandwich",
    description: "Grilled chicken breast with melted cheddar, crispy bacon, fresh lettuce on toasted sourdough.",
    price: 12,
    image: "1722866412882food_13.png",
    category: "Sandwich",
  },
  {
    name: "Vegan Sandwich",
    description: "Smashed avocado, roasted bell peppers, hummus, and sprouts on artisan multigrain bread.",
    price: 18,
    image: "1722866469319food_14.png",
    category: "Sandwich",
  },
  {
    name: "Grilled Sandwich",
    description: "Golden-pressed sandwich with mozzarella, sun-dried tomatoes, and fresh basil pesto.",
    price: 16,
    image: "1722866504992food_15.png",
    category: "Sandwich",
  },
  {
    name: "Bread Sandwich",
    description: "Triple-decker club sandwich with egg salad, cucumber, and a hint of mustard on white bread.",
    price: 24,
    image: "1722866560218food_16.png",
    category: "Sandwich",
  },

  // ─── Cake (4 items) ───
  {
    name: "Cup Cake",
    description: "Fluffy vanilla cupcake crowned with a swirl of buttercream frosting and rainbow sprinkles.",
    price: 14,
    image: "1722866610567food_17.png",
    category: "Cake",
  },
  {
    name: "Vegan Cake",
    description: "Moist chocolate cake made with coconut oil and almond milk, topped with cashew cream frosting.",
    price: 12,
    image: "1722866647952food_18.png",
    category: "Cake",
  },
  {
    name: "Butterscotch Cake",
    description: "Rich butterscotch sponge layered with caramel cream and crunchy praline bits.",
    price: 20,
    image: "1722866694357food_19.png",
    category: "Cake",
  },
  {
    name: "Sliced Cake",
    description: "A generous slice of layered red velvet cake with cream cheese frosting and white chocolate curls.",
    price: 15,
    image: "1722866729053food_20.png",
    category: "Cake",
  },

  // ─── Pure Veg (4 items) ───
  {
    name: "Garlic Mushroom",
    description: "Button mushrooms sautéed in garlic butter with thyme, served sizzling on a hot plate.",
    price: 14,
    image: "1722866777756food_21.png",
    category: "Pure Veg",
  },
  {
    name: "Fried Cauliflower",
    description: "Crispy golden cauliflower florets tossed in a sweet chili glaze with toasted sesame seeds.",
    price: 22,
    image: "1722866830901food_22.png",
    category: "Pure Veg",
  },
  {
    name: "Mix Veg Pulao",
    description: "Aromatic basmati rice cooked with garden-fresh vegetables, whole spices, and a touch of saffron.",
    price: 10,
    image: "1722866871307food_23.png",
    category: "Pure Veg",
  },
  {
    name: "Rice Zucchini",
    description: "Lightly grilled zucchini rounds served over seasoned jasmine rice with a lemon herb drizzle.",
    price: 12,
    image: "1722866909328food_24.png",
    category: "Pure Veg",
  },

  // ─── Pasta (4 items) ───
  {
    name: "Cheese Pasta",
    description: "Al dente penne in a rich four-cheese sauce with parmesan crisps and fresh cracked pepper.",
    price: 12,
    image: "1722866948105food_25.png",
    category: "Pasta",
  },
  {
    name: "Tomato Pasta",
    description: "Classic spaghetti tossed in a slow-simmered San Marzano tomato sauce with fresh basil.",
    price: 18,
    image: "1722867018540food_26.png",
    category: "Pasta",
  },
  {
    name: "Creamy Pasta",
    description: "Fettuccine bathed in a velvety Alfredo cream sauce with sautéed garlic and mushrooms.",
    price: 16,
    image: "1722867053413food_27.png",
    category: "Pasta",
  },
  {
    name: "Chicken Pasta",
    description: "Grilled chicken tossed with rigatoni in a smoky roasted red pepper cream sauce.",
    price: 24,
    image: "1722867110108food_28.png",
    category: "Pasta",
  },

  // ─── Noodles (4 items) ───
  {
    name: "Butter Noodles",
    description: "Silky egg noodles tossed in golden brown butter with a sprinkle of parsley and parmesan.",
    price: 14,
    image: "1722867144188food_29.png",
    category: "Noodles",
  },
  {
    name: "Veg Noodles",
    description: "Stir-fried hakka noodles loaded with bell peppers, cabbage, and carrots in a savory soy glaze.",
    price: 12,
    image: "1722867222977food_30.png",
    category: "Noodles",
  },
  {
    name: "Somen Noodles",
    description: "Delicate Japanese somen noodles served chilled with a light dashi dipping sauce and nori.",
    price: 20,
    image: "1722867254829food_31.png",
    category: "Noodles",
  },
  {
    name: "Cooked Noodles",
    description: "Wok-tossed ramen noodles with bok choy, shiitake mushrooms, and a spicy miso broth.",
    price: 15,
    image: "1722867630288food_32.png",
    category: "Noodles",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to MongoDB");

    // Remove old food items (keeping it clean)
    const deleted = await Food.deleteMany({});
    console.log(`🗑️  Removed ${deleted.deletedCount} existing food items`);

    // Insert all items
    const result = await Food.insertMany(foodItems);
    console.log(`🍔 Added ${result.length} food items across 8 categories:`);

    // Summary by category
    const categories = {};
    result.forEach((item) => {
      categories[item.category] = (categories[item.category] || 0) + 1;
    });
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`   • ${cat}: ${count} items`);
    });

    console.log("\n✅ Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
}

seed();
