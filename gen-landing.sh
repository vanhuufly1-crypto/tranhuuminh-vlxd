#!/bin/bash
# Tạo landing page cho tỉnh bất kỳ
NAME="$1"
NAME_LOWER=$(echo "$NAME" | tr '[:upper:]' '[:lower:]' | sed 's/à/a/g; s/á/a/g; s/ạ/a/g; s/ả/a/g; s/ã/a/g; s/â/a/g; s/ầ/a/g; s/ấ/a/g; s/ậ/a/g; s/ẩ/a/g; s/ẫ/a/g; s/ă/a/g; s/ằ/a/g; s/ắ/a/g; s/ặ/a/g; s/ẳ/a/g; s/ẵ/a/g; s/è/e/g; s/é/e/g; s/ẹ/e/g; s/ẻ/e/g; s/ẽ/e/g; s/ê/e/g; s/ề/e/g; s/ế/e/g; s/ệ/e/g; s/ể/e/g; s/ễ/e/g; s/ì/i/g; s/í/i/g; s/ị/i/g; s/ỉ/i/g; s/ĩ/i/g; s/ò/o/g; s/ó/o/g; s/ọ/o/g; s/ỏ/o/g; s/õ/o/g; s/ô/o/g; s/ồ/o/g; s/ố/o/g; s/ộ/o/g; s/ổ/o/g; s/ỗ/o/g; s/ơ/o/g; s/ờ/o/g; s/ớ/o/g; s/ợ/o/g; s/ở/o/g; s/ỡ/o/g; s/ù/u/g; s/ú/u/g; s/ụ/u/g; s/ủ/u/g; s/ũ/u/g; s/ư/u/g; s/ừ/u/g; s/ứ/u/g; s/ự/u/g; s/ử/u/g; s/ữ/u/g; s/đ/d/g')
SLUG="munich-$NAME_LOWER"
DIR="munich-$NAME_LOWER"
KCN="KCN $NAME"
QUANHUYEN="$NAME"
TIEPDAN="Khách hàng tại $NAME"
TIEUDE="Munich Chống Thấm $NAME"
DESC="Nhà phân phối chính thức Munich tại $NAME. G20 chống thấm sân thượng, nhà vệ sinh. Miễn phí khảo sát."

mkdir -p "$DIR"
cp munich-hai-phong/index.html "$DIR/"

# Replace nội dung
sed -i "s/Hải Phòng/$NAME/g; s/hai-phong/$SLUG/g; s/Hai Phong/$NAME_LOWER/g" "$DIR/index.html"
sed -i "s/Đồ Sơn, Ngô Quyền, Hải An, Lê Chân/trung tâm $NAME/g" "$DIR/index.html"
sed -i "s/KCN Tràng Duệ, KCN Nomura/KCN $NAME/g" "$DIR/index.html"
sed -i "s/Vĩnh Bảo, Tiên Lãng, An Lão/$QUANHUYEN/g" "$DIR/index.html"
sed -i "s/chung cư, nhà phố/nhà phố, công trình/g" "$DIR/index.html"
sed -i "s/Munich Chống Thấm Hải Phòng/$TIEUDE/g" "$DIR/index.html"
sed -i "s/Nhà phân phối chính thức Munich tại Hải Phòng/$DESC/g" "$DIR/index.html"
sed -i "s/G20, G20S, C20, CT0 chống thấm sân thượng, nhà vệ sinh, bể nước/G20 chống thấm sân thượng, nhà vệ sinh/g" "$DIR/index.html"
sed -i "s/300+ công trình/100+ công trình/g" "$DIR/index.html"
sed -i "s/\\(body:.*\\)'SEO Hải Phòng'/\\1'SEO $NAME'/g" "$DIR/index.html"

echo "✅ $DIR created"
