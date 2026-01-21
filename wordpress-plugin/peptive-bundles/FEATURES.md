# Peptive Product Bundles - Complete Feature List

## 🎯 All-In-One WordPress/WooCommerce Plugin

This plugin provides **three major features** in one package:

### 1. 🌐 **Arabic Translation System**
- Add Arabic translations for any product type
- Fields available:
  - ✅ Product Name (Arabic)
  - ✅ Short Description (Arabic)
  - ✅ Full Description (Arabic)
  - ✅ Tags (Arabic)
- RTL-ready text inputs
- Accessible via REST API
- **Works with:** Simple, Variable, Bundle products

### 2. 💰 **Bundle Pricing**
- Set custom pricing for multi-month bundles
- Options:
  - ✅ 3-Month Bundle (Regular & Sale Price)
  - ✅ 6-Month Bundle (Regular & Sale Price)
- Auto-calculation if left empty
- Manual override for discounts
- Exposed via REST API
- **Works with:** Simple products

### 3. 📦 **Product Bundles**
- Create bundles of multiple products
- Features:
  - ✅ Select component products
  - ✅ Set quantity for each component
  - ✅ Virtual pricing (auto-calculate from components)
  - ✅ Automatic inventory management
  - ✅ Deduct stock from components
  - ✅ Order tracking & display
- **Works with:** Custom "Bundle" product type

---

## 📊 Admin Interface

### For ALL Products (Simple, Variable, Bundle):

#### **Arabic Translation Tab**
```
Product Data → Arabic Translation
├── Arabic Product Name
├── Arabic Short Description
├── Arabic Description (Full)
└── Arabic Tags (comma-separated)
```

### For SIMPLE Products:

#### **Bundle Pricing Tab**
```
Product Data → Bundle Pricing
├── 3-Month Bundle
│   ├── Regular Price
│   └── Sale Price
└── 6-Month Bundle
    ├── Regular Price
    └── Sale Price
```

### For BUNDLE Products:

#### **Bundle Products Tab**
```
Product Data → Bundle Products
├── Add Product (button)
│   ├── Select Product (dropdown)
│   └── Quantity (number)
├── Virtual Pricing (checkbox)
└── Bundle Items List
```

---

## 🔌 REST API Integration

All data is automatically exposed via WooCommerce REST API:

```javascript
{
  "id": 123,
  "name": "BPC-157 5mg",
  
  // Arabic translations (all products)
  "arabic_name": "بي بي سي-157 5 ملغ",
  "arabic_description": "وصف المنتج بالعربية",
  "arabic_short_description": "وصف قصير بالعربية",
  "arabic_tags": "ببتيد، بحث، شفاء",
  
  // Bundle pricing (simple products)
  "bundle_pricing": {
    "three_month": {
      "regular_price": "147.00",
      "sale_price": "127.00"
    },
    "six_month": {
      "regular_price": "294.00",
      "sale_price": "247.00"
    }
  },
  
  // Bundle items (bundle products)
  "is_bundle": true,
  "bundle_items": [
    {
      "product_id": 456,
      "quantity": 2,
      "product": {
        "id": 456,
        "name": "BPC-157",
        "price": "49.99",
        "stock_status": "instock"
      }
    }
  ]
}
```

---

## 💻 Frontend Integration (Next.js)

### Using Arabic Translations

```typescript
const { language } = useLanguage(); // 'en' or 'ar'

// Get localized content
const productName = language === 'ar' && product.arabic_name 
  ? product.arabic_name 
  : product.name;

const productDesc = language === 'ar' && product.arabic_description 
  ? product.arabic_description 
  : product.description;
```

### Using Bundle Pricing

```typescript
// Product has bundle_pricing from API
const bundleOptions = [
  {
    id: '1-month',
    label: t('bundle.one_month'),
    price: parseFloat(product.price),
  },
  {
    id: '3-months',
    label: t('bundle.three_months'),
    price: product.bundle_pricing?.three_month?.sale_price 
      ? parseFloat(product.bundle_pricing.three_month.sale_price)
      : parseFloat(product.price) * 3,
  },
  {
    id: '6-months',
    label: t('bundle.six_months'),
    price: product.bundle_pricing?.six_month?.sale_price 
      ? parseFloat(product.bundle_pricing.six_month.sale_price)
      : parseFloat(product.price) * 6,
  },
];
```

---

## 🛒 Inventory Management (Bundles)

### How Stock Works:

1. **Bundle product is sold**
2. **Component stock is reduced** automatically
3. **Order shows breakdown** of components
4. **Bundle stock calculated** from lowest component stock

### Example:

```
Bundle: "Recovery Stack"
├── BPC-157 × 2 (10 in stock → 5 bundles available)
└── TB-500 × 1 (3 in stock → 3 bundles available)

Bundle Stock = 3 (lowest of both)
```

When 1 bundle is sold:
- BPC-157: 10 → 8
- TB-500: 3 → 2
- Bundle: 3 → 2

---

## ✅ Quality Assurance

### Code Quality:
- ✅ PHP 7.4+ compatible
- ✅ WordPress coding standards
- ✅ WooCommerce best practices
- ✅ Secure data sanitization
- ✅ Proper escaping
- ✅ Translation-ready

### Features Tested:
- ✅ Arabic RTL text inputs
- ✅ Bundle pricing auto-calculation
- ✅ Bundle pricing manual override
- ✅ Bundle inventory deduction
- ✅ Order display with components
- ✅ REST API data exposure
- ✅ Frontend integration

### Browser Compatibility:
- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ RTL language support
- ✅ Mobile responsive

---

## 📦 Installation

1. Upload `peptive-bundles/` folder to `/wp-content/plugins/`
2. Activate plugin in WordPress admin
3. Start using the new tabs in product editor!

No configuration needed - works immediately!

---

## 🎓 Use Cases

### Use Case 1: Bilingual Product
```
Product: "BPC-157 5mg"
├── English Name: "BPC-157 5mg Vial"
├── Arabic Name: "بي بي سي-157 5 ملغ قنينة"
├── English Description: "High purity research peptide..."
└── Arabic Description: "ببتيد بحثي عالي النقاء..."
```

### Use Case 2: Bundle Discounts
```
Product: "TB-500 10mg"
├── Single: $50 (regular), $42 (sale)
├── 3-Month: Leave empty → Auto: $126 ($42 × 3)
│            Or set: $119 (custom discount)
└── 6-Month: Leave empty → Auto: $252 ($42 × 6)
             Or set: $239 (custom discount)
```

### Use Case 3: Product Bundle
```
Bundle: "Ultimate Recovery Stack"
├── BPC-157 5mg × 2
├── TB-500 10mg × 1
└── Thymosin Beta-4 × 1

Price: Auto-calculated OR set manually
Stock: Based on component availability
Order: Shows all 4 items individually
```

---

## 🚀 Performance

- **Lightweight** - No external dependencies
- **Optimized queries** - Minimal database load
- **Cached API** - Fast REST responses
- **No bloat** - Only loads what's needed

---

## 📞 Support

For issues or questions:
- Check README.md for documentation
- Review HOW-TO-INSTALL.md for setup
- Contact Peptive development team

---

## 🔄 Version

**Current Version:** 1.0.0
**Last Updated:** January 21, 2026
**WordPress:** 5.8+
**WooCommerce:** 6.0+
**PHP:** 7.4+
