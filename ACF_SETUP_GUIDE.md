# ACF Setup Guide for Peptive

## Step 1: Create ACF Global Settings (Options Page)

### 1.1 Add Options Page Support

Add this code to your WordPress theme's `functions.php`:

```php
<?php
// Create ACF Options Page for Global Settings
if (function_exists('acf_add_options_page')) {
    acf_add_options_page(array(
        'page_title' => 'Global Settings',
        'menu_title' => 'Global Settings',
        'menu_slug' => 'global-settings',
        'capability' => 'edit_posts',
        'redirect' => false,
        'icon_url' => 'dashicons-admin-settings',
    ));
}
```

### 1.2 Create Global Settings Field Group

1. Go to **WordPress Admin > Custom Fields > Add New**
2. **Title:** Global Settings
3. Add these fields:

| Field Label      | Field Name       | Field Type | Instructions                                       |
| ---------------- | ---------------- | ---------- | -------------------------------------------------- |
| Site Logo        | site_logo        | Image      | Upload your site logo (recommended: 200x50px)      |
| Site Favicon     | site_favicon     | Image      | Upload favicon (recommended: 32x32px or 512x512px) |
| Site Title       | site_title       | Text       | Website title (fallback if logo not set)           |
| Site Description | site_description | Textarea   | Short site description                             |

4. **Location Rules:**
   - Rule: Options Page is equal to Global Settings
5. Click **Publish**

---

## Step 2: Create Hero Section Fields

### 2.1 Create Hero Section Field Group

1. Go to **WordPress Admin > Custom Fields > Add New**
2. **Title:** Hero Section
3. Add these fields:

| Field Label     | Field Name    | Field Type | Instructions                                           |
| --------------- | ------------- | ---------- | ------------------------------------------------------ |
| Hero Title      | hero_title    | Text       | Main heading for hero section                          |
| Hero Subtitle   | hero_subtitle | Textarea   | Secondary text below title                             |
| Hero Image      | hero_image    | Image      | Background or feature image (recommended: 1920x1080px) |
| CTA Button Text | hero_cta_text | Text       | Button text (e.g., "Shop Now")                         |
| CTA Button Link | hero_cta_link | URL        | Where button should link to                            |

4. **Location Rules:**
   - Rule: Post Type is equal to Page
   - AND Page is equal to Home (or any specific page)
5. Click **Publish**

---

## Step 3: Set Up Your Content in WordPress

### 3.1 Configure Global Settings

1. Go to **WordPress Admin > Global Settings** (in sidebar)
2. Upload your **Site Logo** image
3. Upload your **Site Favicon** image
4. Enter **Site Title** and **Site Description**
5. Click **Save Changes**

### 3.2 Configure Home Page Hero Section

1. Go to **WordPress Admin > Pages**
2. Edit your **Home** page (create one if it doesn't exist)
3. Scroll down to the **Hero Section** fields
4. Fill in:
   - Hero Title: e.g., "Premium Research Peptides"
   - Hero Subtitle: e.g., "Swiss Grade, 99% Purity, Lab Tested"
   - Hero Image: Upload your hero background image
   - CTA Button Text: e.g., "Shop All Peptides"
   - CTA Button Link: e.g., "/products"
5. Click **Update**

---

## Step 4: Use ACF Data in Next.js

### 4.1 Fetch Global Settings

```typescript
import { wordpress } from '@/lib/wordpress';

export default async function Layout() {
  const settings = await wordpress.getGlobalSettings();
  
  return (
    <div>
      {settings?.site_logo && (
        <img 
          src={settings.site_logo.url} 
          alt={settings.site_logo.alt || 'Site Logo'} 
        />
      )}
    </div>
  );
}
```

### 4.2 Fetch Hero Section

```typescript
import { wordpress } from '@/lib/wordpress';

export default async function HomePage() {
  const hero = await wordpress.getHeroSection('home');
  
  return (
    <section className="hero">
      {hero?.hero_image && (
        <img src={hero.hero_image.url} alt={hero.hero_image.alt} />
      )}
      <h1>{hero?.hero_title}</h1>
      <p>{hero?.hero_subtitle}</p>
      {hero?.hero_cta_text && (
        <a href={hero.hero_cta_link}>
          {hero.hero_cta_text}
        </a>
      )}
    </section>
  );
}
```

### 4.3 Update Site Favicon

In your `app/layout.tsx`:

```typescript
import { wordpress } from '@/lib/wordpress';

export async function generateMetadata() {
  const settings = await wordpress.getGlobalSettings();
  
  return {
    title: settings?.site_title || 'Peptive Peptides',
    description: settings?.site_description || 'Premium Research Peptides',
    icons: {
      icon: settings?.site_favicon?.url || '/favicon.ico',
    },
  };
}
```

---

## Step 5: Verify ACF to REST API Plugin

Make sure you have installed:

1. **ACF to REST API** plugin

   - WordPress Admin > Plugins > Add New
   - Search for "ACF to REST API"
   - Install and Activate
2. **Test the API endpoints:**

   - Global Settings: `http://peptivepeptides.local/wp-json/acf/v3/options/options`
   - Page ACF Fields: `http://peptivepeptides.local/wp-json/wp/v2/pages?slug=home`

---

## Common Image Sizes Recommendations

| Use Case       | Recommended Size         | Format                |
| -------------- | ------------------------ | --------------------- |
| Site Logo      | 200x50px to 300x100px    | PNG with transparency |
| Favicon        | 32x32px or 512x512px     | ICO or PNG            |
| Hero Image     | 1920x1080px              | JPG or WebP           |
| Product Images | 800x800px or 1200x1200px | JPG or WebP           |

---

## Troubleshooting

### ACF Fields Not Showing in API

1. Make sure **ACF to REST API** plugin is activated
2. Check that field names use underscores (not hyphens)
3. Verify **Show in REST API** is enabled for field groups

### Images Not Loading

1. Check image URLs in API response
2. Verify WordPress media library permissions
3. Check CORS settings if images from different domain

### Global Settings Not Found

1. Verify Options Page code is in `functions.php`
2. Check ACF field group location rules
3. Try deactivating and reactivating ACF plugin

---

## Next Steps

Now that you have ACF set up:

1. ✅ Configure Global Settings in WordPress
2. ✅ Set up Hero Section on Home page
3. 🔄 Update Header component to use site logo
4. 🔄 Update Layout to use favicon
5. 🔄 Create Hero section component for homepage

Ready to implement these in your Next.js components!
