from PIL import Image
import base64, os, shutil

# Source image
src_path = r'C:\Users\shaya\.gemini\antigravity-ide\brain\b6a0f766-2edd-455a-b135-b2434484ff01\razorpay_rebound_favicon_1788453460913.jpg'

img = Image.open(src_path).convert('RGBA')

# 1. Save optimized 128x128 PNG for logo (fast loading, ~8KB)
logo_img = img.resize((128, 128), Image.LANCZOS)
logo_img.save(r'c:\Users\shaya\OneDrive\Desktop\razorpay\frontend\public\logo.png', 'PNG', optimize=True)
logo_img.save(r'c:\Users\shaya\OneDrive\Desktop\razorpay\backend\static\logo.png', 'PNG', optimize=True)

# 2. Save 64x64 PNG for favicon
fav_img = img.resize((64, 64), Image.LANCZOS)
fav_img.save(r'c:\Users\shaya\OneDrive\Desktop\razorpay\frontend\public\favicon-64.png', 'PNG', optimize=True)
fav_img.save(r'c:\Users\shaya\OneDrive\Desktop\razorpay\backend\static\favicon-64.png', 'PNG', optimize=True)
fav_img.save(r'c:\Users\shaya\OneDrive\Desktop\razorpay\frontend\public\favicon.png', 'PNG', optimize=True)
fav_img.save(r'c:\Users\shaya\OneDrive\Desktop\razorpay\backend\static\favicon.png', 'PNG', optimize=True)

# 3. Multi-size ICO
ico_img = img.resize((32, 32), Image.LANCZOS)
ico_img.save(r'c:\Users\shaya\OneDrive\Desktop\razorpay\frontend\public\favicon.ico', 'ICO')
ico_img.save(r'c:\Users\shaya\OneDrive\Desktop\razorpay\backend\static\favicon.ico', 'ICO')

# Copy to dist if dist exists
dist_dir = r'c:\Users\shaya\OneDrive\Desktop\razorpay\frontend\dist'
if os.path.exists(dist_dir):
    shutil.copy(r'c:\Users\shaya\OneDrive\Desktop\razorpay\frontend\public\logo.png', os.path.join(dist_dir, 'logo.png'))
    shutil.copy(r'c:\Users\shaya\OneDrive\Desktop\razorpay\frontend\public\favicon-64.png', os.path.join(dist_dir, 'favicon-64.png'))
    shutil.copy(r'c:\Users\shaya\OneDrive\Desktop\razorpay\frontend\public\favicon.png', os.path.join(dist_dir, 'favicon.png'))
    shutil.copy(r'c:\Users\shaya\OneDrive\Desktop\razorpay\frontend\public\favicon.ico', os.path.join(dist_dir, 'favicon.ico'))

# Get Base64 for inline fallback
with open(r'c:\Users\shaya\OneDrive\Desktop\razorpay\frontend\public\favicon-64.png', 'rb') as f:
    b64_fav = base64.b64encode(f.read()).decode()

with open(r'c:\Users\shaya\OneDrive\Desktop\razorpay\frontend\public\logo.png', 'rb') as f:
    b64_logo = base64.b64encode(f.read()).decode()

print('Logo size:', os.path.getsize(r'c:\Users\shaya\OneDrive\Desktop\razorpay\frontend\public\logo.png'))
print('Favicon size:', os.path.getsize(r'c:\Users\shaya\OneDrive\Desktop\razorpay\frontend\public\favicon-64.png'))
print('B64 Favicon length:', len(b64_fav))
print('B64 Logo length:', len(b64_logo))
