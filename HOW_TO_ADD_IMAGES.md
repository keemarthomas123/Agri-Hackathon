# Instructions to Add Images to Existing Products

## Option 1: Manual Upload Through App
1. Login to http://localhost:3000
2. Click "Add Product"
3. Upload image when creating new product
4. Images saved automatically to Server/uploads/

## Option 2: Add Images to Sample Products

### Step 1: Put images in Server/uploads/ folder
Copy your product images to:
`C:\Users\UWI User\Desktop\Reacthackathon\Server\uploads\`

Example files:
- tomato.jpg
- corn.jpg
- apple.jpg
- milk.jpg
- rice.jpg

### Step 2: Update database with image paths

Open MySQL and run:

```sql
USE agri_store;

-- Update Fresh Tomatoes
UPDATE products 
SET image_path = '/uploads/tomato.jpg' 
WHERE product_name = 'Fresh Tomatoes';

-- Update Sweet Corn
UPDATE products 
SET image_path = '/uploads/corn.jpg' 
WHERE product_name = 'Sweet Corn';

-- Update Red Apples
UPDATE products 
SET image_path = '/uploads/apple.jpg' 
WHERE product_name = 'Red Apples';

-- Update Fresh Milk
UPDATE products 
SET image_path = '/uploads/milk.jpg' 
WHERE product_name = 'Fresh Milk';

-- Update Brown Rice
UPDATE products 
SET image_path = '/uploads/rice.jpg' 
WHERE product_name = 'Brown Rice';
```

### Step 3: Refresh your browser
Go to "View Products" and you'll see the images!

## Option 3: Download Free Images

### Free Image Sources:
- **Unsplash**: https://unsplash.com/s/photos/vegetables
- **Pexels**: https://www.pexels.com/search/fruits/
- **Pixabay**: https://pixabay.com/images/search/agriculture/

Search for:
- tomatoes
- corn
- apples
- milk
- rice

Download and save to Server/uploads/ folder.

## Quick Test:
1. Use the app's "Add Product" feature
2. Upload any image from your computer
3. Fill in product details
4. Click "Add Product"
5. Go to "View Products" to see your new product with image!
