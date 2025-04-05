import json
import requests
import time
import os
from io import BytesIO

INPUT_FILE = "cleaned_tops_only.json"
OUTPUT_FILE = "tops_with_vectors.json"
API_URL = "http://localhost:51000/post"

HEADERS = {"User-Agent": "Mozilla/5.0"}
BATCH_SAVE_INTERVAL = 50

with open(INPUT_FILE, "r") as f:
    data = json.load(f)

results = []

for i, item in enumerate(data["products"]):
    image_url = item["image"]
    try:
        print(f"🔄 [{i+1}/{len(data['products'])}] Downloading image: {image_url}")
        img_response = requests.get(image_url, headers=HEADERS, timeout=10)
        img_response.raise_for_status()

        files = {"data": img_response.content}
        response = requests.post(API_URL, files=files)
        response.raise_for_status()

        vector = response.json()["data"][0]
        item["vector"] = vector
        results.append(item)

        if i % BATCH_SAVE_INTERVAL == 0:
            with open(OUTPUT_FILE, "w") as out:
                json.dump({"products": results}, out, indent=2)

        time.sleep(0.3)  # be nice to the server

    except Exception as e:
        print(f"❌ Failed on {image_url}: {e}")
        item["vector"] = None
        results.append(item)

# Final save
with open(OUTPUT_FILE, "w") as out:
    json.dump({"products": results}, out, indent=2)

print("✅ All done! Vectors written to tops_with_vectors.json")
