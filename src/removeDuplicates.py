import json

# load dataset
with open("/Users/trevorschool/Desktop/cleaned_output.json", "r") as f:
    data = json.load(f)

seen = set()
unique_products = []

for product in data["products"]:
    img_url = product.get("image")
    if img_url and img_url not in seen:
        seen.add(img_url)
        unique_products.append(product)

# save to new cleaned file
with open("cleaned_output_deduped.json", "w") as f:
    json.dump({"products": unique_products}, f, indent=2)

print(f"Got rid of duplicates {len(data['products'])} -> {len(unique_products)}")
