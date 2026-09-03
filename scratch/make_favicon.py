from PIL import Image
import base64, shutil

# Create 64x64 PNG favicon
img = Image.open('frontend/dist/logo.png').convert('RGBA').resize((64, 64), Image.LANCZOS)
img.save('frontend/dist/favicon-64.png', 'PNG')
img.save('backend/static/favicon-64.png', 'PNG')
shutil.copy('frontend/dist/favicon-64.png', 'frontend/public/favicon-64.png')

with open('frontend/dist/favicon-64.png', 'rb') as f:
    b64 = base64.b64encode(f.read()).decode()

print('PNG 64px favicon created.')
print('Base64 length:', len(b64))
