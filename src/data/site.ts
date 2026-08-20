export const site = {
  name: "Vimash Manufacturing India Pvt. Ltd.",
  shortName: "Vimash",
  tagline:
    "Vimash Manufacturing Pvt. Ltd. builds reliable atta and masala pulverizers for commercial use. Trusted by businesses across India.",
  phone: "+91 95749 54050",
  phoneHref: "tel:+919574954050",
  whatsappHref: "https://wa.me/919574954050",
  email: "vimashmachinery@gmail.com",
  address:
    "Plot No. 01, Panchamrut Industrial Park-04, Vanch Dhamatvan Road, Dhamatvan, Ahmedabad, Gujarat 382435, India",
  hours: "Mon – Sat · 9:30 AM to 7:00 PM IST",
  /** Edit these social links as needed. */
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61583474861871",
    instagram: "https://www.instagram.com/vimash_manufacturing_pvt_ltd/",
    youtube: "https://www.youtube.com/@vimash_mfg_ind_pvt_ltd1",
  },
};

export const navLinks = [
  { label: "Home", to: "/" },
  { label: "About us", to: "/about" },
  { label: "Products", to: "/products" },

  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
] as const;
