: <<'END_COMMENT'


#!/bin/bash

# store the merged result
output_file="output.json"

# start with an empty products array
echo '{"products":[]}' > "$output_file"

# looping through pages 2-33
for i in $(seq 2 33); do
  echo "Fetching page $i..."

  # download page and extract the products
  curl -s "https://www.nuuly.com/api/catalog/v2/tops?inStock=true&pageNumber=$i&itemsPerPage=96" \
    | jq '.' > "page_$i.json"

  # merge page's products into output.json
  jq -s '.[0].products + .[1].products | {products: .}' "$output_file" "page_$i.json" > "temp.json"
  mv temp.json "$output_file"

  # deleting the temp page file
  rm "page_$i.json"
done

echo "all products saved to $output_file"

END_COMMENT

#!/bin/bash

# store the merged result
output_file="output.json"
echo '{"products":[]}' > "$output_file"

# each nuuly category on the site
categories=(
  "tops"
  "dresses"
  "skirts"
  "jeans"
  "pants"
  "shorts"
  "sweaters-sweatshirts"
  "jumpsuits"
  "jackets"
  "athleisure"
  "vintage"
)

# loop through each category and each page in each category
for category in "${categories[@]}"; do
  echo "⏳ Fetching category: $category"

  for page in $(seq 1 32); do
    echo "  → Page $page"

    # found the json catalog by just manually scraping the site, just need to switch out the specific cat
    # and page number and it works
    url="https://www.nuuly.com/api/catalog/v2/${category}?inStock=true&pageNumber=${page}&itemsPerPage=96"
    response=$(curl -s "$url")

    # check if the response has products
    has_products=$(echo "$response" | jq '.products | length')

    if [[ "$has_products" -gt 0 ]]; then
      # add the category and save to a temp file
      echo "$response" | jq --arg category "$category" '.products | map(. + {category: $category})' > "products_${category}_${page}.json"

      # merge this file with the output file
      jq -s '.[0].products + .[1] | {products: .}' "$output_file" "products_${category}_${page}.json" > temp_output.json
      mv temp_output.json "$output_file"

      rm "products_${category}_${page}.json"
    else
      echo "    ⚠️ No products on this page."
    fi
  done
done

echo "Done. all data saved to $output_file"
