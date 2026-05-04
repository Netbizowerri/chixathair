
const templates = [
    {
        name: "Omalicha {length} Black Color",
        description: "A timeless crown of pure elegance. The Omalicha {length}-inch unit is a masterpiece of length and texture. Crafted for the queen who commands attention with grace. 100% Raw Virgin human hair with Edna's signature HD skin-melt lace.",
        category: "Wigs",
        images: ["https://i.ibb.co/JWDNKQMv/Whats-App-Image-2026-01-28-at-10-49-35-PM-2.jpg"],
        video: "https://vimeo.com/1164925003"
    },
    {
        name: "Kamdili {length} Reddish Brown",
        description: "A fiery masterpiece of elegance. The Kamdili {length}-inch Reddish Brown unit offers a rich, warm mahogany tone that radiates luxury. Hand-selected Raw Virgin hair paired with Edna's signature HD skin-melt lace for a look that is as bold as it is beautiful.",
        category: "Wigs",
        images: ["https://i.ibb.co/spbvz3vL/CHIXATHAIR-9.jpg"],
        video: "https://vimeo.com/1163517105"
    },
    {
        name: "Zikora {length} Luminous",
        description: "A masterpiece of radiance and refined length. The Zikora {length}-inch unit features a lush, natural density with a luminous sheen. Hand-selected Raw Virgin hair paired with Edna's signature HD skin-melt lace for an undetectable, elite finish.",
        category: "Wigs",
        images: ["https://i.ibb.co/kgkThjvs/Whats-App-Image-2026-01-28-at-3-27-52-PM-1.jpg"],
        video: "https://vimeo.com/1163514091"
    },
    {
        name: "Joy {length} J99 Burgundy",
        description: "A ruby crown of pure elegance. The Joy {length}-inch unit in our signature J99 burgundy is a masterpiece of color and texture. Crafted for the queen who commands attention with grace. 100% Raw Virgin human hair.",
        category: "Wigs",
        images: ["https://i.ibb.co/vxRfCj57/CHIXATHAIR-2.jpg"],
        video: "https://vimeo.com/1163434443"
    }
];

const lengths = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34];
const basePrice = 45000;

const products = [];
let idCounter = 1;

for (let i = 0; i < 100; i++) {
    const template = templates[i % templates.length];
    const length = lengths[Math.floor(i / (100 / lengths.length)) % lengths.length];
    const price = basePrice + (length * 1000) + (i * 100);

    const id = `${template.name.split(' ')[0].toLowerCase()}-${length}-${i}`;

    products.push({
        id,
        name: template.name.replace('{length}', length),
        price: Math.floor(price / 1000) * 1000, // Round to nearest 1k
        description: template.description.replace('{length}', length),
        category: template.category,
        images: template.images,
        video: template.video,
        stock: 10,
        isFeatured: i < 8
    });
}

console.log(JSON.stringify(products, null, 2));
