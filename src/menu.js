// Full menu for Zukerino Pastry Shop.
// Transcribed from the in-store menu board. Prices + items are accurate;
// each item's `img` is a best-fit product photo and can be swapped in one line
// (just change the DSC_#### filename — all photos live in /public/img/products).

const P = "/img/products/"; // product photo folder

export const cakeFlavors = [
  "Black & White", "Blondie", "Cannoli", "Caramel", "Chocolate Mousse",
  "Coffee", "Coconut", "Pineapple", "Crazy", "Fruit", "Carrot", "Birthday",
  "Key Lime", "Oreo", "Pistachio", "Red Velvet", "Red Velvet Oreo",
  "Italian Rum", "Santorini", "Black Forest", "Strawberry-Chocolate",
  "Mousse", "Tiramisu", "Reese's Peanut Butter",
];

export const cheesecakeFlavors = [
  "Strawberry", "Chocolate", "Oreo", "Red Velvet", "Red Velvet Oreo",
  "Raspberry", "Caramel", "Coconut", "Reese's Peanut Butter", "Snickers",
  "Butterfinger", "M&M", "Carrot", "Key Lime",
];

// Extra cake photos shown as a "designs" gallery inside the Cakes section.
export const cakeGallery = [
  "1783","1786","1787","1790","1791","1793","1794","1796","1797","1798",
  "1799","1800","1801","1803","1804","1805","1806","1807","1808","1809",
  "1810","1811","1812","1813","1814","1815",
].map((n) => P + "DSC_" + n + ".jpg");

export const menu = [
  {
    id: "cakes",
    name: "Cakes",
    blurb: "Decorated to order, often on short notice. Choose your size, then your flavor.",
    flavorLabel: "Cake flavors",
    flavors: cakeFlavors,
    note: "Mix & match up to two flavors for an additional $5.",
    items: [
      { name: "Round Cake — Medium (10\")", price: "$45", desc: "Rich layered round, filled and decorated for the occasion. Serves about 8–10.", img: P + "DSC_1785.jpg" },
      { name: "Round Cake — Large (12\")", price: "$55", desc: "Our full-size round — the go-to for birthdays and parties. Serves about 12–16.", img: P + "DSC_1792.jpg" },
      { name: "Sheet Cake — Feeds 20+", price: "$72", desc: "Half-sheet, decorated to match your celebration.", img: P + "DSC_1802.jpg" },
      { name: "Sheet Cake — Feeds 30+", price: "$108", desc: "Full-sheet for a bigger crowd.", img: P + "DSC_1784.jpg" },
      { name: "Sheet Cake — Serves 50+", price: "$180", desc: "Extra-large sheet for the whole party.", img: P + "DSC_1780.jpg" },
    ],
  },
  {
    id: "cheesecakes",
    name: "Cheesecakes",
    blurb: "Creamy, not too sweet — the one people drive back across town for.",
    flavorLabel: "Cheesecake flavors",
    flavors: cheesecakeFlavors,
    note: "Mix & match up to two flavors for an additional $5.",
    items: [
      { name: "12\" Plain Cheesecake", price: "$40", desc: "The classic — smooth, rich, and balanced.", img: P + "DSC_1788.jpg" },
      { name: "12\" Flavored Cheesecake", price: "$55", desc: "Same creamy base, finished in the flavor of your choice.", img: P + "DSC_1795.jpg" },
      { name: "Flavored Slice", price: "$6.95", desc: "A single slice to try before you commit." },
    ],
  },
  {
    id: "baklava",
    name: "Baklava",
    blurb: "Buttery phyllo, honey, and more layers than anyone's counted.",
    items: [
      { name: "Pistachio Baklava", price: "$6.50", unit: "each", sub: "24-piece pan $148", desc: "Crisp phyllo, honey, and rich pistachios.", img: P + "DSC_1771.jpg" },
      { name: "Almond Baklava", price: "$4.50", unit: "each", sub: "24-piece pan $95", desc: "Golden phyllo layered with almonds and honey.", img: P + "DSC_1770.jpg" },
      { name: "Lady Finger", price: "$2.00", unit: "each", sub: "72-piece pan $125", desc: "Rolled phyllo with a nutty, honeyed center.", img: P + "DSC_1774.jpg" },
      { name: "Mini Kataifi", price: "$2.00", unit: "each", sub: "77-piece pan $135", desc: "Little shredded-phyllo nests, light and crunchy.", img: P + "DSC_1775.jpg" },
      { name: "Kataifi", price: "$4.00", unit: "each", sub: "12-piece pan $40", desc: "Larger shredded-phyllo rolls soaked in syrup.", img: P + "DSC_1778.jpg" },
      { name: "Lady Finger, Chocolate Drizzle", price: "$2.50", unit: "single only", desc: "Our lady finger, finished with a chocolate drizzle.", img: P + "DSC_1774.jpg" },
      { name: "Lady Finger, Chocolate Dipped", price: "$2.75", unit: "single only", tag: "Seasonal", desc: "Dipped in chocolate — here for a limited time.", img: P + "DSC_1779.jpg" },
      { name: "Baklava Slice", price: "$7.00", desc: "A generous single slice of the classic." },
      { name: "Small Tray — 10 pieces", price: "$55", desc: "A ready-to-share assortment.", img: P + "DSC_1776.jpg" },
      { name: "Large Tray — 21 pieces", price: "$100", desc: "The full spread for a crowd.", img: P + "DSC_1770.jpg" },
      { name: "8-Piece Variety Box", price: "$17.95", desc: "A mix of lady fingers, kataifi, and a chocolate lady finger.", img: P + "DSC_1776.jpg" },
    ],
  },
  {
    id: "cookies",
    name: "Cookies (Singles)",
    blurb: "Greek and Italian classics, baked fresh daily.",
    note: "$1.00 each · 12 for $8.95 · 24 for $14.95 (except where noted).",
    items: [
      { name: "Kourabiethes", price: "$1.00", unit: "each", desc: "Almond wedding cookie under a snow of powdered sugar.", img: P + "DSC_1765.jpg" },
      { name: "Melomakarona", price: "$1.00", unit: "each", tag: "Dairy-Free", desc: "Honey-and-cinnamon cookie.", img: P + "DSC_1764.jpg" },
      { name: "Koulourakia", price: "$1.00", unit: "each", desc: "Vanilla shortbread twist, biscotti-style.", img: P + "DSC_1766.jpg" },
      { name: "Molasses", price: "$1.00", unit: "each", tag: "Dairy-Free", desc: "Soft, spiced molasses cookie.", img: P + "DSC_1772.jpg" },
      { name: "Italian Biscotti", price: "$1.00", unit: "each", tag: "Dairy-Free", desc: "Crunchy and made for coffee.", img: P + "DSC_1769.jpg" },
      { name: "Paksimathi", price: "$1.00", unit: "each", tag: "Dairy-Free", desc: "Twice-baked Greek biscuit.", img: P + "DSC_1768.jpg" },
      { name: "Butter Cookie", price: "$1.00", unit: "each", desc: "Tender butter cookie with chocolate or raspberry filling.", img: P + "DSC_1767.jpg" },
      { name: "Coconut Macaroon", price: "$2.00", unit: "each", sub: "12 for $8.95", desc: "Chewy coconut, golden on top.", img: P + "DSC_1776.jpg" },
    ],
  },
  {
    id: "gluten-free",
    name: "Gluten Free",
    blurb: "Almond-based favorites, made without gluten.",
    items: [
      { name: "Almond Horseshoe", price: "$3.75", unit: "single", desc: "Almond cookie shaped in a horseshoe.", img: P + "DSC_1768.jpg" },
      { name: "Almond Macaroon", price: "$2.50", unit: "single", desc: "Soft, chewy almond macaroon.", img: P + "DSC_1770.jpg" },
      { name: "Florette", price: "$14.95", unit: "bag of 8", desc: "Delicate almond florettes.", img: P + "DSC_1771.jpg" },
      { name: "Almond Crescent", price: "$16.95", unit: "bag of 12", desc: "Crescent-shaped almond cookies.", img: P + "DSC_1764.jpg" },
    ],
  },
  {
    id: "pastries",
    name: "Pastries",
    blurb: "Filled and baked fresh — best the day you get them.",
    items: [
      { name: "Cannoli", price: "$3.00", unit: "each", desc: "Crisp shells filled when you order so they never go soft." },
      { name: "Eclairs", price: "$4.00", unit: "each", desc: "Choux pastry, cream filling, chocolate on top." },
      { name: "Fruit Turnovers", price: "$5.00", unit: "each", desc: "Flaky pastry folded over fruit.", img: P + "DSC_1777.jpg" },
      { name: "Cinnamon Honey Twist", price: "$4.00", unit: "each", desc: "Twisted pastry with cinnamon and honey." },
      { name: "Galaktoboureko & Bougatsa", price: "$5", unit: "individual", sub: "$10 square · 12-slice tray $45 · 24-slice tray $85", desc: "Semolina custard in crackling phyllo, dusted with sugar.", img: P + "DSC_1781.jpg" },
    ],
  },
  {
    id: "party-trays",
    name: "Party Trays",
    blurb: "A variety of cookies and baklava, boxed for sharing.",
    note: "Ask about our holiday platter — great for gifts!",
    items: [
      { name: "Small — 24 pieces", price: "$16.95", desc: "Just right for a small gathering.", img: P + "DSC_1776.jpg" },
      { name: "Medium — 32 pieces", price: "$25.95", desc: "A fuller mix for the table.", img: P + "DSC_1773.jpg" },
      { name: "Large — 48 pieces", price: "$35.95", desc: "Plenty to pass around.", img: P + "DSC_1770.jpg" },
      { name: "X-Large — 60 pieces", price: "$49.95", desc: "For the whole party.", img: P + "DSC_1771.jpg" },
    ],
  },
  {
    id: "pies",
    name: "Pies",
    blurb: "Whole pies, baked fresh. Seasonal flavors come and go.",
    items: [
      { name: "Apple Pie", price: "$19.95", desc: "Classic, flaky, baked fresh." },
      { name: "Blueberry Pie", price: "$19.95", desc: "Sweet-tart blueberry in a buttery crust." },
      { name: "Cherry Pie", price: "$19.95", desc: "Bright cherry filling, golden lattice." },
      { name: "Pumpkin Pie", price: "$19.95", tag: "Seasonal", desc: "Spiced pumpkin custard." },
      { name: "Lemon Meringue Pie", price: "$34.95", desc: "Tangy lemon under toasted meringue." },
      { name: "Key Lime Pie", price: "$34.95", desc: "Cool, zesty, and creamy." },
      { name: "Chocolate Mousse Pie", price: "$34.95", desc: "Light, rich chocolate mousse." },
      { name: "Oreo Pie", price: "$34.95", desc: "Cookies-and-cream in every bite." },
      { name: "Coconut Cream Pie", price: "$34.95", desc: "Silky coconut custard and cream." },
      { name: "California Fruit Pie", price: "$34.95", desc: "Loaded with fresh seasonal fruit." },
      { name: "Pecan Pie", price: "$24.95", tag: "Seasonal", desc: "Buttery, toasty, and rich." },
    ],
  },
];
