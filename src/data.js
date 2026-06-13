// Business data for Zukerino Pastry Shop
// Sourced from the shop's public listing.

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

export const intro =
  "Zukerino is a small, family-owned pastry shop on Cotillion Drive. The recipes are Greek and Italian — baklava, cannoli, tiramisu, spanakopita — and everything in the case was baked here that morning. Custom cakes too, often on surprisingly short notice.";

export const hours = [
  { day: "Monday", time: "9:00 AM – 6:00 PM" },
  { day: "Tuesday", time: "9:00 AM – 6:00 PM" },
  { day: "Wednesday", time: "9:00 AM – 6:00 PM" },
  { day: "Thursday", time: "9:00 AM – 6:00 PM" },
  { day: "Friday", time: "9:00 AM – 6:00 PM" },
  { day: "Saturday", time: "9:00 AM – 6:00 PM" },
  { day: "Sunday", time: "Closed", closed: true },
];

export const specialties = [
  {
    name: "Baklava",
    desc: "Honey, nuts, and more phyllo layers than anyone's counted. If the pistachio one is in the case, get it.",
    tag: "Signature",
  },
  {
    name: "Cheesecake",
    desc: "Creamy, not too sweet, no gimmicks. The one people drive back across town for.",
    tag: "Customer Favorite",
  },
  {
    name: "Tiramisu Cake",
    desc: "Espresso-soaked layers and a generous hand with the mascarpone.",
  },
  {
    name: "Cannoli",
    desc: "Crisp shells, filled when you order so they never go soft.",
  },
  {
    name: "Chocolate Mousse Cake",
    desc: "Light enough to finish the slice. Rich enough to think about it later.",
  },
  {
    name: "Celebration Cakes",
    desc: "Birthday and occasion cakes, decorated to order. Call even if the party is this weekend.",
    tag: "Made to Order",
  },
  {
    name: "Spanakopita",
    desc: "Spinach and feta in crackling phyllo — the savory break between sweets.",
    tag: "Savory",
  },
  {
    name: "Fresh-Baked Cookies & Breads",
    desc: "Cookies, breads, and whatever else came out of the oven that morning.",
  },
];

export const photoBase = "https://place.com-photos.com/82307/";

// Detects whether a media URL points to a video so the gallery/hero can
// render a <video> player instead of an <img>.
export const isVideo = (src) =>
  typeof src === "string" && /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(src);

// The shop's public listing only provided photos. To add a video, simply drop
// a URL (or local file path imported above) ending in .mp4/.webm into the
// `gallery` array below, or set `heroVideo` — both will play automatically.
// Example: "https://example.com/zukerino-tour.mp4",
export const heroVideo = null;

export const gallery = [
  "zukerino-pastry-shop-AF1QipMGtwn-IssT5QcaZ0q8dSl6SJPiOCYpiEyOhdOh.jpg",
  "zukerino-pastry-shop-AF1QipMTxTf4TY35hTlK6oJk9C-zKn5IXNw4L5KDwBVE.jpg",
  "zukerino-pastry-shop-AF1QipOqSILfn-wKUqk7c9jlSNu2y8-hmTIrWEtRZO2l.jpg",
  "zukerino-pastry-shop-AF1QipPl7tI4-1h6ZKJPqjKy0zIC1yq-KcsO5qYAEJ7N.jpg",
  "zukerino-pastry-shop-AF1QipPvbBGEmFXR3yV9J9uESE0Sf_2DOT9eyGkUisAP.jpg",
  "zukerino-pastry-shop-AF1QipPTP8Gur5EYu2gnsnT1Rd4SBzwI1bE9SaerYe4N.jpg",
  "zukerino-pastry-shop-AF1QipOONKUORO6nzjLgaMTvdQv-jUlMs7-p-dL7UIpO.jpg",
].map((f) => photoBase + f);

export const heroImage = gallery[0];

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
    text: "Ordered the crazy cake for a birthday — absolutely delicious and ready on short notice. Very friendly and sweet service. Definitely recommend and will be back for more!",
  },
];

export const highlights = [
  { stat: "Family-run", label: "Same family behind the counter every day" },
  { stat: "Baked daily", label: "The cases are filled fresh each morning" },
  { stat: "Short notice", label: "Custom cakes, sometimes same-day" },
];
