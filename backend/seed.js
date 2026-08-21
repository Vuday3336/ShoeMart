// Populates the products table with a full sample shoe catalog.
// Run with: npm run seed   (after your .env DATABASE_URL is set and schema.sql has been run)

const pool = require("./config/db");

// Curated pool of verified, license-free Unsplash shoe photos.
const IMG = [
  "1542291026-7eec264c27ff", "1595950653106-6c9ebd614d3a", "1533867617858-e7b97e060509",
  "1520639888713-7851133b1ed0", "1525966222134-fcfa99b8ae77", "1600185365483-26d7a4cc7519",
  "1605348532760-6753d2c43329", "1614252369475-531eba835eb1", "1600269452121-4f2416e55c28",
  "1460353581641-37baddab0fa2", "1618354691373-d851c5c3a990", "1523275335684-37898b6baf30",
  "1518002171953-a080ee817e1f", "1549298916-b41d501d3772", "1560769629-975ec94e6a86",
  "1491553895911-0055eca6402d", "1465453869711-7e174808ace9", "1608231387042-66d1773070a5",
  "1519415943484-9fa1873496d4", "1606107557195-0e29a4b5b4aa", "1543508282-6319a3e2621f",
  "1562183241-b937e95585b6", "1465479423260-c4afc24172c6", "1512374382149-233c42b6a83b",
  "1483721310020-03333e577078", "1441984904996-e0b6ba687e04", "1556906781-9a412961c28c",
];
const img = (i, w = 800) => `https://images.unsplash.com/photo-${IMG[i % IMG.length]}?w=${w}&q=80&auto=format&fit=crop`;

let n = 0;
const next = () => n++;

const P = (overrides) => {
  const primary = next();
  const hover = next();
  return {
    stock: 20,
    sizes: "6,7,8,9,10,11",
    rating: 4.0,
    review_count: 20,
    is_new: false,
    is_bestseller: false,
    original_price: null,
    image_url: img(primary),
    hover_image_url: img(hover),
    ...overrides,
  };
};

const products = [
  // ---------------- RUNNING ----------------
  P({ name: "Air Runner X1", brand: "Nova", category: "Running", price: 3499, original_price: 4299, stock: 25, rating: 4.3, review_count: 142, is_bestseller: true, description: "Lightweight running shoe with breathable mesh upper and responsive foam cushioning built for daily miles." }),
  P({ name: "Velocity Sprint Trainer", brand: "Nova", category: "Running", price: 3999, stock: 30, rating: 4.5, review_count: 98, is_new: true, description: "Engineered for speed with a carbon-infused midsole and an aggressive sprint-ready outsole." }),
  P({ name: "Marathon Elite Runner", brand: "Nova", category: "Running", price: 5999, original_price: 6999, stock: 10, rating: 4.7, review_count: 210, is_bestseller: true, description: "Premium marathon racing shoe with a plated foam midsole for elite-level energy return." }),
  P({ name: "CloudPace Distance Runner", brand: "Vantage", category: "Running", price: 4599, stock: 18, rating: 4.2, review_count: 61, description: "Cushioned distance runner with a rocker geometry that keeps your stride smooth mile after mile." }),
  P({ name: "SwiftStride Trainer", brand: "Zenith", category: "Running", price: 2999, stock: 40, rating: 4.0, review_count: 34, is_new: true, description: "An entry-level daily trainer with a soft EVA midsole and a knit upper that moves with your foot." }),
  P({ name: "AeroFlex Racer", brand: "Apex", category: "Running", price: 4299, original_price: 4999, stock: 22, rating: 4.4, review_count: 77, description: "Race-day flat with a nylon plate for a snappy toe-off and a featherweight upper." }),
  P({ name: "TrackStar Pro Spike", brand: "Vantage", category: "Running", price: 3799, stock: 15, rating: 4.1, review_count: 29, description: "Track spike built for sprinters, with a rigid plate and low-profile fit for maximum ground contact." }),

  // ---------------- CASUAL ----------------
  P({ name: "CasualComfort Slip-On", brand: "EaseWear", category: "Casual", price: 1999, stock: 50, rating: 4.1, review_count: 88, is_bestseller: true, description: "Slip-on casual shoe designed for all-day comfort with a memory-foam insole." }),
  P({ name: "CloudWalk Comfort Shoe", brand: "EaseWear", category: "Casual", price: 2299, original_price: 2799, stock: 35, rating: 4.3, review_count: 65, description: "Ultra-soft cushioning designed to feel like walking on clouds, from errands to travel days." }),
  P({ name: "Weekend Wanderer Loafer", brand: "Coreline", category: "Casual", price: 2599, stock: 28, rating: 4.0, review_count: 40, is_new: true, description: "A relaxed suede loafer that pairs equally well with jeans or chinos." }),
  P({ name: "DailyDrift Canvas Slip-On", brand: "EaseWear", category: "Casual", price: 1699, stock: 45, rating: 3.9, review_count: 22, description: "Breathable canvas slip-on built for warm-weather everyday wear." }),
  P({ name: "UrbanEase Knit Walker", brand: "Coreline", category: "Casual", price: 2899, stock: 24, rating: 4.2, review_count: 53, is_bestseller: true, description: "Sock-fit knit upper with a flexible outsole made for all-day city walking." }),
  P({ name: "Harbor Deck Shoe", brand: "Regalio", category: "Casual", price: 3199, stock: 20, rating: 4.1, review_count: 31, description: "Classic boat-shoe styling in water-resistant leather with a non-marking sole." }),

  // ---------------- FORMAL ----------------
  P({ name: "ClassicFit Formal Oxford", brand: "Regalio", category: "Formal", price: 4299, stock: 15, rating: 4.4, review_count: 58, is_bestseller: true, description: "Genuine leather formal oxford, hand-finished and perfect for the office or black-tie events." }),
  P({ name: "Heritage Leather Loafer", brand: "Regalio", category: "Formal", price: 3799, original_price: 4499, stock: 12, rating: 4.3, review_count: 47, description: "Timeless leather loafer with a cushioned footbed and a hand-stitched apron toe." }),
  P({ name: "Boardroom Brogue", brand: "Regalio", category: "Formal", price: 4599, stock: 10, rating: 4.5, review_count: 36, is_new: true, description: "Wingtip brogue detailing on full-grain leather, built for the sharpest of suits." }),
  P({ name: "Executive Derby Shoe", brand: "Coreline", category: "Formal", price: 3999, stock: 14, rating: 4.2, review_count: 25, description: "Open-lace derby with a polished leather finish for a confident, refined stride." }),
  P({ name: "Monk Strap Elite", brand: "Regalio", category: "Formal", price: 4899, original_price: 5499, stock: 8, rating: 4.6, review_count: 19, description: "Double monk-strap silhouette in burnished leather — a statement piece for formal wardrobes." }),

  // ---------------- SNEAKERS ----------------
  P({ name: "Urban Street Sneaker", brand: "Kicks Co", category: "Sneakers", price: 2799, stock: 40, rating: 4.0, review_count: 112, is_bestseller: true, description: "Everyday streetwear sneaker with a durable rubber sole and a clean, minimal silhouette." }),
  P({ name: "Retro Canvas Sneaker", brand: "Kicks Co", category: "Sneakers", price: 1799, stock: 60, rating: 3.9, review_count: 74, description: "Classic canvas sneaker with a vulcanized rubber sole — a wardrobe staple." }),
  P({ name: "HighTop Legacy Sneaker", brand: "Kicks Co", category: "Sneakers", price: 3299, original_price: 3899, stock: 26, rating: 4.4, review_count: 91, is_new: true, description: "High-top silhouette with padded collar for a locked-in, vintage-inspired look." }),
  P({ name: "Chunky Dad Sneaker", brand: "Stridewell", category: "Sneakers", price: 3599, stock: 20, rating: 4.1, review_count: 55, is_new: true, description: "Bold layered midsole and mixed-material upper for the chunky-sneaker trend." }),
  P({ name: "MonoTone Court Sneaker", brand: "Stridewell", category: "Sneakers", price: 2499, stock: 33, rating: 4.0, review_count: 38, description: "Clean tonal leather sneaker inspired by classic tennis silhouettes." }),
  P({ name: "GraffitiEdge Street Sneaker", brand: "Kicks Co", category: "Sneakers", price: 2999, stock: 18, rating: 4.2, review_count: 27, is_bestseller: true, description: "Statement print sneaker with extra cushioning for long days on concrete." }),
  P({ name: "Skate Deck Low", brand: "Glide", category: "Sneakers", price: 2199, stock: 30, rating: 3.8, review_count: 21, description: "Reinforced toe cap and grippy vulcanized sole built for skate parks and pavement alike." }),

  // ---------------- SPORTS ----------------
  P({ name: "TrailBlaze Hiking Boot", brand: "PeakGear", category: "Sports", price: 5199, stock: 18, rating: 4.5, review_count: 66, is_bestseller: true, description: "Waterproof hiking boot with reinforced ankle support and an aggressive lugged outsole." }),
  P({ name: "Summit Ridge Trail Runner", brand: "PeakGear", category: "Sports", price: 4499, original_price: 5199, stock: 22, rating: 4.3, review_count: 49, description: "Trail runner with rock-plate protection and multidirectional grip for uneven terrain." }),
  P({ name: "AllCourt Tennis Shoe", brand: "Apex", category: "Sports", price: 3899, stock: 25, rating: 4.1, review_count: 33, description: "Lateral-support tennis shoe with a herringbone outsole for quick direction changes." }),
  P({ name: "AquaGrip Water Shoe", brand: "PeakGear", category: "Sports", price: 1899, stock: 40, rating: 3.9, review_count: 17, is_new: true, description: "Quick-drying water shoe with a non-slip sole for beach, kayak, and poolside wear." }),
  P({ name: "CycleFlex Cleat Shoe", brand: "Vantage", category: "Sports", price: 4999, stock: 12, rating: 4.4, review_count: 24, description: "Stiff-soled cycling shoe with a ratchet strap for efficient power transfer." }),
  P({ name: "GolfPro Spikeless Shoe", brand: "Apex", category: "Sports", price: 5499, stock: 14, rating: 4.3, review_count: 20, description: "Spikeless golf shoe with waterproof leather and traction lugs for all-terrain stability." }),

  // ---------------- BASKETBALL ----------------
  P({ name: "Court Pro Basketball", brand: "SkyJump", category: "Basketball", price: 4799, stock: 20, rating: 4.4, review_count: 87, is_bestseller: true, description: "High-top basketball shoe with extra ankle cushioning and a herringbone traction pattern." }),
  P({ name: "SkyRise Hyperjump", brand: "SkyJump", category: "Basketball", price: 6499, original_price: 7499, stock: 9, rating: 4.7, review_count: 63, is_new: true, description: "Responsive air-cushioned midsole built for explosive first steps and high verticals." }),
  P({ name: "Baseline Grip Low", brand: "SkyJump", category: "Basketball", price: 3999, stock: 24, rating: 4.0, review_count: 28, description: "Low-top hoops shoe with a wide grip zone for guards who need agility over ankle support." }),
  P({ name: "PowerDunk Mid", brand: "Zenith", category: "Basketball", price: 4299, stock: 16, rating: 4.2, review_count: 35, description: "Mid-cut basketball shoe balancing support and mobility for all-around players." }),

  // ---------------- TRAINING ----------------
  P({ name: "PowerLift Training Shoe", brand: "SkyJump", category: "Training", price: 4399, stock: 22, rating: 4.2, review_count: 71, description: "Stable, flat-soled base with a flexible forefoot for gym and cross-training sessions." }),
  P({ name: "CrossFit Grind Trainer", brand: "Apex", category: "Training", price: 3899, original_price: 4499, stock: 26, rating: 4.3, review_count: 44, is_bestseller: true, description: "Rope-climb-ready outsole with a locked-down midfoot for high-intensity circuits." }),
  P({ name: "GymCore Flex Trainer", brand: "Zenith", category: "Training", price: 2999, stock: 34, rating: 4.0, review_count: 30, is_new: true, description: "Everyday gym trainer with breathable mesh and cushioning for cardio and lifting alike." }),
  P({ name: "IronGrip Weightlifting Shoe", brand: "Apex", category: "Training", price: 5299, stock: 10, rating: 4.5, review_count: 18, description: "Raised heel and rigid TPU sole engineered for squats and Olympic lifts." }),

  // ---------------- SLIDES ----------------
  P({ name: "CloudSlide Recovery Sandal", brand: "EaseWear", category: "Slides", price: 1299, stock: 55, rating: 4.1, review_count: 96, is_bestseller: true, description: "Contoured recovery slide with a soft footbed — perfect for post-workout comfort." }),
  P({ name: "PoolSide Comfort Slide", brand: "Glide", category: "Slides", price: 999, stock: 60, rating: 3.8, review_count: 41, description: "Quick-dry, water-friendly slide with a textured non-slip outsole." }),
  P({ name: "Sport Strap Sandal", brand: "Vantage", category: "Slides", price: 1499, stock: 38, rating: 4.0, review_count: 27, is_new: true, description: "Adjustable dual-strap sandal built for outdoor trails and casual summer wear." }),
  P({ name: "Cushioned Flip Flop", brand: "EaseWear", category: "Slides", price: 799, stock: 70, rating: 3.7, review_count: 33, description: "Everyday flip-flop with a soft EVA base and a durable rubber grip." }),
];

async function seed() {
  try {
    console.log("Seeding products...");
    await pool.query("TRUNCATE TABLE products RESTART IDENTITY CASCADE");
    for (const p of products) {
      await pool.query(
        `INSERT INTO products
           (name, description, brand, category, price, original_price, stock,
            image_url, hover_image_url, sizes, rating, review_count, is_new, is_bestseller)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
        [
          p.name, p.description, p.brand, p.category, p.price, p.original_price, p.stock,
          p.image_url, p.hover_image_url, p.sizes, p.rating, p.review_count, p.is_new, p.is_bestseller,
        ]
      );
    }
    console.log(`Seeded ${products.length} products across ${new Set(products.map((p) => p.category)).size} categories.`);
  } catch (err) {
    console.error("Seeding error:", err.message);
  } finally {
    await pool.end();
  }
}

seed();
