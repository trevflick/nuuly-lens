import json

# Load JSON file
with open('cleaned_tops_only.json', 'r') as f:
    data = json.load(f)

# Update the first 31 items to point to the local images
for i, item in enumerate(data["products"][:36]):
    item["image"] = f"photos/{i}.jpg"

# Save to a new file so you don't overwrite the original
with open('data_with_local_images.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Updated JSON with local image paths saved to data_with_local_images.json")
