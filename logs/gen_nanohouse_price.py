#!/usr/bin/env python3
"""Generate Nanohouse price PDF with 50% discount column"""

from fpdf import FPDF
import os

FONT_DIR = '/usr/share/fonts/truetype/dejavu'

class PDF(FPDF):
    def __init__(self):
        super().__init__('P', 'mm', 'A4')
        # Add Unicode fonts
        self.add_font('DejaVu', '', os.path.join(FONT_DIR, 'DejaVuSansCondensed.ttf'), uni=True)
        self.add_font('DejaVu', 'B', os.path.join(FONT_DIR, 'DejaVuSansCondensed-Bold.ttf'), uni=True)
        self.add_font('DejaVuMono', '', os.path.join(FONT_DIR, 'DejaVuSansMono.ttf'), uni=True)
        self.add_font('DejaVuMono', 'B', os.path.join(FONT_DIR, 'DejaVuSansMono-Bold.ttf'), uni=True)

    def header(self):
        if self.page_no() == 1:
            self.set_font('DejaVu', 'B', 9)
            self.cell(0, 5, u'B\u1ea2NG GI\u00c1 NANOHOUSE - CHI\u1ebeT KH\u1ea4U 50% (Hi\u1ec7u l\u1ef1c 02/02/2026)', new_x="LMARGIN", new_y="NEXT", align='C')
            self.ln(1)

    def footer(self):
        self.set_y(-10)
        self.set_font('DejaVu', '', 7)
        self.cell(0, 5, f'Trang {self.page_no()}/{{nb}}', align='C')

    def section_title(self, title):
        self.set_font('DejaVu', 'B', 9)
        self.set_fill_color(41, 77, 143)
        self.set_text_color(255, 255, 255)
        self.cell(0, 6, f'  {title}', new_x="LMARGIN", new_y="NEXT", fill=True)
        self.set_text_color(0, 0, 0)
        self.ln(1)


# --- DATA ---
products = [
    ('S\u01a0N PH\u1ee6 N\u1ed8I TH\u1ea4T', [
        ('SUPER INTERIOR - NO1', 'Si\u00eau b\u00f3ng n\u1ed9i th\u1ea5t th\u01b0\u1ee3ng h\u1ea1ng', '15l', 4983000),
        ('', '', '5l', 1765000),
        ('', '', '1l', 418000),
        ('ECO NANO GUARD - NO2', 'B\u00f3ng n\u1ed9i th\u1ea5t cao c\u1ea5p', '18l', 4818000),
        ('', '', '5l', 1620000),
        ('ECO NANO GLOSSY - NO3', 'B\u00f3ng n\u1ed9i th\u1ea5t cao c\u1ea5p', '18l', 3886000),
        ('', '', '5l', 1128000),
        ('ECO NANO CLEAN - NO4', 'B\u00f3ng n\u1ed9i th\u1ea5t \u0111\u1eb7c bi\u1ec7t', '18l', 2818000),
        ('', '', '5l', 836000),
        ('ECO CLASSIC - NO5', 'M\u1ecbn n\u1ed9i th\u1ea5t cao c\u1ea5p', '18l', 2188000),
        ('', '', '5l', 720000),
        ('ECO SUPER WHITE - NO6', 'Si\u00eau tr\u1eafng tr\u1ea7n', '18l', 2458000),
        ('', '', '5l', 768000),
        ('ECO REGULAR - NO7', 'N\u1ed9i-ngo\u1ea1i th\u1ea5t \u0111\u1eb7c bi\u1ec7t', '18l', 1068000),
        ('', '', '5l', 389000),
    ]),
    ('S\u01a0N PH\u1ee6 NGO\u1ea0I TH\u1ea4T', [
        ('SUPER EXTERIOR - NA1', 'Si\u00eau b\u00f3ng ngo\u1ea1i th\u1ea5t th\u01b0\u1ee3ng h\u1ea1ng', '5l', 2138000),
        ('', '', '1l', 496000),
        ('ECO PRIMER EX - NA2', 'Si\u00eau b\u00f3ng ngo\u1ea1i ch\u1ed1ng n\u00f3ng CC', '15l', 5818000),
        ('', '', '5l', 1957000),
        ('', '', '1l', 474000),
        ('ECO NANO SHIELD - NA3', 'B\u00f3ng ngo\u1ea1i th\u1ea5t cao c\u1ea5p', '15l', 4398000),
        ('', '', '5l', 1486000),
        ('ECO PLATIUM - NA4', 'M\u1ecbn ngo\u1ea1i th\u1ea5t cao c\u1ea5p', '18l', 2998000),
        ('', '', '5l', 958000),
        ('ECO CLEAR - NA5', 'Si\u00eau b\u00f3ng ngo\u1ea1i ch\u1ed1ng n\u00f3ng CC', '5l', 1828000),
        ('', '', '1l', 458000),
        ('ECO PROGUARD - NA6', 'Ch\u1ed1ng th\u1ea5m cao c\u1ea5p', '18l', 4428000),
        ('', '', '5l', 1340000),
        ('ECO PROGUARD - NA7', 'Ch\u1ed1ng th\u1ea5m m\u00e0u cao c\u1ea5p', '18l', 5368000),
        ('', '', '5l', 1566000),
    ]),
    ('S\u01a0N L\u00d3T CH\u1ed0NG KI\u1ec0M', [
        ('ECO SEALER - KT1', 'L\u00f3t ki\u1ec1m n\u1ed9i-ngo\u1ea1i th\u1ea5t', '18l', 1605000),
        ('', '', '5l', 485000),
        ('ECO SEALER - KT2', 'L\u00f3t ki\u1ec1m n\u1ed9i th\u1ea5t \u0111\u1eb7c bi\u1ec7t', '18l', 2228000),
        ('', '', '5l', 708000),
        ('INTERIOR - KT3', 'L\u00f3t ki\u1ec1m n\u1ed9i th\u1ea5t cao c\u1ea5p', '18l', 2737000),
        ('', '', '5l', 868000),
        ('EX-MASTER - KN1', 'L\u00f3t ki\u1ec1m ngo\u1ea1i th\u1ea5t \u0111\u1eb7c bi\u1ec7t', '18l', 2838000),
        ('', '', '5l', 898000),
        ('EX-TERIOR - KN2', 'L\u00f3t ki\u1ec1m ngo\u1ea1i th\u1ea5t cao c\u1ea5p', '18l', 3788000),
        ('', '', '5l', 1132000),
        ('ECO PRIMER - KN3', 'L\u00f3t ki\u1ec1m ngo\u1ea1i th\u1ea5t th\u01b0\u1ee3ng h\u1ea1ng', '18l', 4508000),
        ('', '', '5l', 1365000),
    ]),
    ('B\u1ed8T B\u1ea2', [
        ('HOME COAT - B1', 'B\u1ed9t b\u1ea3 trong & ngo\u00e0i cao c\u1ea5p', '40kg', 620000),
        ('LEVEN COAT - B2', 'B\u1ed9t b\u1ea3 ch\u1ed1ng th\u1ea5m cao c\u1ea5p', '40kg', 838000),
    ]),
]

pdf = PDF()
pdf.alias_nb_pages()
pdf.set_margins(5, 5, 5)
pdf.set_auto_page_break(auto=True, margin=10)
pdf.add_page()

# Title block
pdf.set_font('DejaVu', 'B', 12)
pdf.cell(0, 7, u'C\u00d4NG TY CP SX & TM S\u01a0N NANO VI\u1ec6T NAM', new_x="LMARGIN", new_y="NEXT", align='C')
pdf.set_font('DejaVu', '', 8)
pdf.cell(0, 4, u'Nh\u00e0 m\u00e1y: KCN Duy\u00ean Th\u00e1i, Thanh Tr\u00ec - H\u00e0 N\u1ed9i', new_x="LMARGIN", new_y="NEXT", align='C')
pdf.cell(0, 4, u'Tel: 024.39.057.999 - 09.11.33.66.99 | Web: www.nanohouse.vn', new_x="LMARGIN", new_y="NEXT", align='C')
pdf.ln(2)

# Info bar
pdf.set_font('DejaVu', 'B', 9)
pdf.cell(0, 5, u'B\u1ea2NG GI\u00c1 CHI\u1ebeT KH\u1ea4U 50% (Hi\u1ec7u l\u1ef1c: 02/02/2026 - \u0110\u1ebfn khi c\u00f3 TB m\u1edbi)', new_x="LMARGIN", new_y="NEXT", align='C')
pdf.ln(1)

pdf.set_font('DejaVu', '', 7)
pdf.cell(0, 4, u'* Gi\u00e1 \u0111\u00e3 bao g\u1ed3m 10% VAT. M\u00e0u s\u1eafc (*) c\u1ed9ng th\u00eam 10%, (**) c\u1ed9ng th\u00eam 20%.', new_x="LMARGIN", new_y="NEXT", align='C')
pdf.cell(0, 4, u'* "Gi\u00e1 g\u1ed1c" theo b\u1ea3ng gi\u00e1 Nh\u00e0 m\u00e1y. "CK 50%" = Gi\u00e1 g\u1ed1c x 50% (d\u00e0nh cho NPP/\u0110\u1ea1i l\u00fd).', new_x="LMARGIN", new_y="NEXT", align='C')
pdf.ln(3)

# Column widths
col_w = [8, 54, 32, 12, 24, 24]
w_total = sum(col_w)
lm = (210 - w_total) / 2
pdf.set_margins(lm, 5, lm)

# Table header
pdf.set_font('DejaVu', 'B', 7)
pdf.set_fill_color(41, 77, 143)
pdf.set_text_color(255, 255, 255)
headers = ['STT', u'S\u1ea3n ph\u1ea9m', u'T\u00ednh n\u0103ng', u'Quy c\u00e1ch', u'Gi\u00e1 g\u1ed1c (VND)', u'CK 50% (VND)']
for i, h in enumerate(headers):
    pdf.cell(col_w[i], 5, h, border=1, align='C', fill=True)
pdf.ln()
pdf.set_text_color(0, 0, 0)

stt = 0
for section, items in products:
    # Section title
    pdf.section_title(section)
    # Sub-header
    pdf.set_font('DejaVu', 'B', 7)
    pdf.set_fill_color(230, 230, 230)
    for i, h in enumerate(headers):
        pdf.cell(col_w[i], 4, h, border=1, align='C', fill=True)
    pdf.ln()

    for name, spec, qty, price in items:
        stt += 1
        discount = int(price * 0.5)

        y_start = pdf.get_y()
        if y_start > pdf.h - pdf.b_margin - 20:
            pdf.add_page()
            pdf.section_title(f'{section} (ti\u1ebfp)')
            pdf.set_font('DejaVu', 'B', 7)
            pdf.set_fill_color(230, 230, 230)
            for i, h in enumerate(headers):
                pdf.cell(col_w[i], 4, h, border=1, align='C', fill=True)
            pdf.ln()

        row_h = 5
        # STT
        pdf.set_font('DejaVu', '', 7)
        pdf.cell(col_w[0], row_h, str(stt) if name else '', align='C')
        # Name
        if name:
            pdf.set_font('DejaVu', 'B', 7)
        else:
            pdf.set_font('DejaVu', '', 7)
        pdf.cell(col_w[1], row_h, name[:30] if name else '', align='L')
        # Spec
        pdf.set_font('DejaVu', '', 7)
        pdf.cell(col_w[2], row_h, spec[:25], align='L')
        # Qty
        pdf.cell(col_w[3], row_h, qty, align='C')
        # Price original
        pdf.cell(col_w[4], row_h, f'{price:,}', align='R')
        # Discount 50%
        pdf.set_text_color(200, 0, 0)
        pdf.cell(col_w[5], row_h, f'{discount:,}', align='R')
        pdf.set_text_color(0, 0, 0)
        pdf.ln(row_h)

    pdf.ln(3)

# Footer note
pdf.ln(5)
pdf.set_font('DejaVu', '', 7)
lm2 = 5
pdf.set_margins(lm2, 5, lm2)
pdf.cell(0, 4, u'Ghi ch\u00fa: B\u1ea3ng gi\u00e1 chi\u1ebft kh\u1ea5u 50% d\u00e0nh cho NPP / \u0110\u1ea1i l\u00fd. S\u1ed1 l\u01b0\u1ee3ng l\u1edbn li\u00ean h\u1ec7: 0378.679.633 (Mr. H\u1eefu)', new_x="LMARGIN", new_y="NEXT", align='C')
pdf.cell(0, 4, u'CTY TNHH XD & TM H\u1eeeU MINH - TDP Quy\u1ebft Ti\u1ebfn, P. Nam \u0110\u1ed3 S\u01a1n, H\u1ea3i Ph\u00f2ng', new_x="LMARGIN", new_y="NEXT", align='C')

output_path = '/home/huu-minh/website-vlxd/logs/Nanohouse_Gia_CK50.pdf'
pdf.output(output_path)
print(f'OK -> {output_path}')
print(f'Size: {os.path.getsize(output_path)} bytes')
