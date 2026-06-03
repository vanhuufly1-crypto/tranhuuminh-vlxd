#!/bin/bash
echo "=== KHỞI CHẠY KHAI BÁO ĐỒNG BỘ TOÀN BỘ DANH MỤC SẢN PHẨM ==="

declare -A BRAND_PRODUCTS=(
 ["Munich"]="65"
 ["Nano House"]="35"
 ["Sika"]="40"
 ["Dulux"]="50"
 ["Jotun"]="45"
 ["Kova"]="35"
 ["Nippon"]="19"
 ["Maxilite"]="11"
 ["MPE (Rạng Đông)"]="16"
 ["Ống nhựa HDPE"]="120"
)

# MySQL không khả dụng trên static site — bỏ qua
echo "→ Web static (GitHub Pages) — không có MySQL. Dữ liệu sản phẩm trong js/prices.js"

echo "=== HOÀN TẤT KHAI BÁO ==="
