#!/usr/bin/env python3
"""
Scan public/images/places/ and update src/lib/placeImages.ts with actual image paths.
Run after download-place-images.py completes.
"""

import os
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PLACES_DIR = os.path.join(BASE_DIR, "public", "images", "places")
OUT_FILE = os.path.join(BASE_DIR, "src", "lib", "placeImages.ts")

# Read the existing file to preserve aliases
with open(OUT_FILE, "r", encoding="utf-8") as f:
    existing = f.read()

# Scan directories
place_images = {}
if os.path.exists(PLACES_DIR):
    for dirname in os.listdir(PLACES_DIR):
        dirpath = os.path.join(PLACES_DIR, dirname)
        if not os.path.isdir(dirpath):
            continue
        files = sorted([
            f for f in os.listdir(dirpath)
            if f.lower().endswith((".jpg", ".jpeg", ".png"))
        ])
        if files:
            place_images[dirname] = [
                f"/images/places/{dirname}/{f}" for f in files
            ]

print(f"Found {len(place_images)} places with images")
total_imgs = sum(len(v) for v in place_images.values())
print(f"Total images: {total_imgs}")

# Update the images arrays in the TS file
# Pattern: { id: "xxx", ... images: [] },
def update_images(match):
    full_match = match.group(0)
    place_id = match.group(1)
    if place_id in place_images:
        imgs = place_images[place_id]
        imgs_str = ", ".join(f'"{im}"' for im in imgs)
        # Replace images: [] with images: [...]
        return re.sub(r'images:\s*\[\]', f'images: [{imgs_str}]', full_match)
    return full_match

# Match each place entry and update its images array
pattern = r'\{[^}]*?id:\s*"([^"]+)"[^}]*?images:\s*\[\][^}]*?\}'
updated = re.sub(pattern, update_images, existing, flags=re.DOTALL)

with open(OUT_FILE, "w", encoding="utf-8") as f:
    f.write(updated)

print(f"Updated {OUT_FILE}")

# Print summary
for place_id, imgs in sorted(place_images.items()):
    print(f"  {place_id}: {len(imgs)} images")
