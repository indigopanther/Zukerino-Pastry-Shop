// Business data for Zukerino Pastry Shop.
// Content reflects the client's redesign requests:
//  - family-OWNED (not family-run), wholesale & retail pastry shop
//  - custom cakes available upon phone request (not "short notice")
//  - cheesecakes in almost all of our cake flavors
//  - teal-blue highlights driven by the `teal` flags below

export const business = {
  name: "Zukerino",
  fullName: "Zukerino Pastry Shop",
  tagline: "Authentic Greek & Italian Pastries",
  location: "Atlanta, GA",
  address: "2230 Cotillion Dr, Atlanta, GA 30338, United States",
  phone: "+1 770 220 1733",
  phoneHref: "tel:+17702201733",
  mapsLink:
    "https://www.google.com/maps/place/Zukerino+Pastry+Shop/@33.9211518,-84.2975177,17z",
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3310.776484149824!2d-84.2975177!3d33.9211518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f50991e0f1afbb%3A0xde624ed2a8ad6a34!2sZukerino%20Pastry%20Shop!5e0!3m2!1sen!2s!4v1735828621895!5m2!1sen!2s",
};

// Primary navigation, shared by the navbar and the footer.
export const NAV_LINKS = [
  { href: "#about", label: "Our Story" },
  { href: "#favorites", label: "Specialties" },
  { href: "#menu", label: "Menu" },
  { href: "#gallery", label: "Gallery" },
  { href: "#reviews", label: "Reviews" },
  { href: "#visit", label: "Visit" },
];

export const hours = [
  { day: "Monday", time: "9:00 AM – 6:00 PM" },
  { day: "Tuesday", time: "9:00 AM – 6:00 PM" },
  { day: "Wednesday", time: "9:00 AM – 6:00 PM" },
  { day: "Thursday", time: "9:00 AM – 6:00 PM" },
  { day: "Friday", time: "9:00 AM – 6:00 PM" },
  { day: "Saturday", time: "9:00 AM – 6:00 PM" },
  { day: "Sunday", time: "Closed", closed: true },
];

// `teal` flag drives the teal-blue highlight the client asked for.
export const specialties = [
  {
    name: "Custom Cakes",
    desc: "Rounds, sheets, and tiers decorated to order for birthdays and big days — available upon phone request.",
    tag: "By Phone Request",
    teal: true,
    feature: true,
  },
  {
    name: "Baklava",
    desc: "Honey, nuts, and more flaky phyllo layers than anyone's counted.",
    tag: "Signature",
  },
  {
    name: "Cheesecakes",
    desc: "Creamy and not too sweet — made in almost all of our cake flavors.",
    tag: "Customer Favorite",
    teal: true,
  },
  {
    name: "Cannoli",
    desc: "Crisp shells, filled when you order so they never go soft.",
  },
  {
    name: "Cookies",
    desc: "Greek and Italian classics — kourabiethes, biscotti, butter cookies, and more.",
  },
  {
    name: "Pastries & Pies",
    desc: "Eclairs, turnovers, galaktoboureko, and fresh-baked pies.",
  },
];

// Detects whether a media URL points to a video so the gallery/hero can
// render a <video> player instead of an <img>.
export const isVideo = (src) =>
  typeof src === "string" && /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(src);

export const gallery = [
  "/img/place/DSC_1817.jpg",
  "/img/place/DSC_1821.jpg",
  "/img/place/DSC_1816.jpg",
  "/img/place/DSC_1827.jpg",
  "/img/place/DSC_1825.jpg",
  "/img/place/DSC_1826.jpg",
  "/img/place/DSC_1829.jpg",
  "/img/place/DSC_1819.jpg",
  "/img/place/DSC_1818.jpg",
  "/img/place/DSC_1828.jpg",
];

// Descriptive alt text for each gallery image (keyword-rich for SEO).
// Falls back to a generic description if an image has no entry.
export const galleryAlt = [
  "Display case of fresh Greek and Italian pastries at Zukerino Pastry Shop in Atlanta, GA",
  "Custom decorated cakes at Zukerino Pastry Shop, a family-owned bakery in Atlanta",
  "Trays of baklava and cannoli baked fresh at Zukerino Pastry Shop",
  "Assorted cookies and desserts in the case at Zukerino Pastry Shop, Atlanta",
  "Greek and Italian cakes and cheesecakes at Zukerino Pastry Shop",
  "Seating area inside Zukerino Pastry Shop on Cotillion Drive in Atlanta",
  "Fresh-baked pastries and pies at Zukerino Pastry Shop, Atlanta GA",
  "Tiramisu and chocolate mousse cakes at Zukerino Pastry Shop",
  "Counter and display at the family-owned Zukerino Pastry Shop in Atlanta",
  "Boxed pastries and cakes ready to go at Zukerino Pastry Shop",
];

export const heroSlides = [
  "/img/place/DSC_1822.jpg",
  "/img/place/DSC_1816.jpg",
  "/img/place/DSC_1821.jpg",
  "/img/place/DSC_1827.jpg",
  "/img/place/DSC_1817.jpg",
];

export const reviews = [
  {
    name: "Steve Schultz",
    rating: 5,
    date: "2 months ago",
    text: "WOW. Amazing. I needed a birthday cake at the last minute and the woman working there was so nice and helpful. Within a few minutes I was walking out the door and the cake was amazing. PERFECTION.",
  },
  {
    name: "Amy Baker",
    rating: 5,
    date: "3 months ago",
    text: "We highly recommend Zukerino's! Crystal was super friendly, explaining every dessert and even Greek traditions around them. The desserts were a hit, and the spanakopita was delicious.",
  },
  {
    name: "Katy DeLuca Lucey",
    rating: 5,
    date: "4 months ago",
    text: "Some of the BEST baked goods I've ever had. My favorites were the cannoli, tiramisu cake and chocolate mousse cake. Just incredible. Our go-to place for desserts from now on.",
  },
  {
    name: "Michael Meadows",
    rating: 5,
    date: "5 months ago",
    text: "A hidden gem in plain view. Crystal provided a warm welcome and an education on the fresh, daily-baked cookies, pastries and breads. A family-owned business that takes great pride in their craft. A must visit!",
  },
  {
    name: "skkanduri kanduri",
    rating: 5,
    date: "6 months ago",
    text: "Ordered a cake for a co-worker's retirement. Decoration fantastic, taste and texture a meticulously perfect blend. Folks at the table just closed their eyes remembering their taste buds.",
  },
  {
    name: "Martin Egger",
    rating: 5,
    date: "8 months ago",
    text: "Ordered a custom cake for a birthday — absolutely delicious and the friendliest, sweetest service. Definitely recommend and will be back for more!",
  },
];

// Stats row under the story. teal:true → highlighted teal-blue per client.
export const highlights = [
  { stat: "Family owned", label: "The same family behind the counter every day", teal: true },
  { stat: "Baked daily", label: "Our cases are filled fresh each morning", teal: true },
  { stat: "Wholesale & retail", label: "Serving Atlanta by the tray or by the slice", teal: false },
];
