#!/usr/bin/env python3
"""
🏢 Blender Architecture Generator V2 — Nhà 6x16 3 tầng (Chi tiết)
Chạy: blender --background --python generate_house_v2.py
"""
import bpy
import math
import os

# ═══════ THÔNG SỐ ═══════
W = 6.0      # Ngang (m)
D = 16.0     # Dài (m)
H1, H2, H3 = 3.5, 3.3, 3.3  # Cao mỗi tầng
SLAB_T = 0.15 # Độ dày sàn
WALL_T = 0.2  # Tường dày
SETBACK = 1.0 # Thụt 1m phía trước

OUTPUT_DIR = os.path.expanduser("~/.openclaw/workspace/tranhuuminh-vlxd/images")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ═══════ HELPERS ═══════

def clean_scene():
    """Xoá đối tượng mặc định"""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()
    # Xoá vật liệu mặc định
    for mat in bpy.data.materials:
        bpy.data.materials.remove(mat, do_unlink=True)
    for img in bpy.data.images:
        bpy.data.images.remove(img, do_unlink=True)

def make_box(x, y, z, w, d, h, name="Box"):
    """Tạo khối hộp"""
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x+w/2, y+d/2, z+h/2))
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = (w, d, h)
    bpy.ops.object.transform_apply(scale=True)
    return obj

def assign_material(obj, color, name="Mat", roughness=0.5, metallic=0.0, transmission=0.0, ior=1.45):
    """Gán vật liệu PBR cho object"""
    mname = f"Mat_{name}_{obj.name}"
    mat = bpy.data.materials.new(name=mname)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    bsdf = nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    if transmission > 0:
        bsdf.inputs["Transmission Weight"].default_value = transmission
        bsdf.inputs["IOR"].default_value = ior
    if obj.data.materials:
        obj.data.materials[0] = mat
    else:
        obj.data.materials.append(mat)
    return mat

def make_material_wall(obj, color_key="cream"):
    """Gán màu tường"""
    colors = {
        "cream": (0.92, 0.90, 0.87),
        "white": (0.95, 0.95, 0.93),
        "gray": (0.75, 0.75, 0.75),
        "darkgray": (0.4, 0.4, 0.4),
        "brown": (0.45, 0.25, 0.15),
        "red": (0.65, 0.20, 0.10),
        "blue": (0.20, 0.40, 0.70),
        "darkblue": (0.12, 0.22, 0.35),
        "tile": (0.80, 0.75, 0.70),
    }
    c = colors.get(color_key, colors["cream"])
    assign_material(obj, c, name=f"Wall_{color_key}", roughness=0.7)

def make_wall(x, y, z, w, d, h, name="Wall", color="cream"):
    """Tạo tường với vật liệu"""
    obj = make_box(x, y, z, w, d, h, name)
    make_material_wall(obj, color)
    return obj

def make_slab(x, y, z, w, d, name="Slab"):
    """Sàn bê tông"""
    obj = make_box(x, y, z, w, d, SLAB_T, name)
    assign_material(obj, (0.65, 0.65, 0.62), name="Concrete", roughness=0.9)
    return obj

def make_glass(x, y, z, w, d, h, name="Glass"):
    """Kính trong suốt"""
    obj = make_box(x, y, z, w, d, h, name)
    assign_material(obj, (0.8, 0.9, 1.0), name="Glass", roughness=0.0, transmission=0.9, ior=1.45)
    return obj

def make_window(x, y, z, w, h, wall_thick, name="Window", on_front=True):
    """Cửa sổ hoàn chỉnh: khung + kính + thanh ngang dọc"""
    sign = 1 if on_front else -1
    yy = sign * 0.001 if on_front else (wall_thick if not on_front else 0)
    y_base = 0.001 if on_front else wall_thick - 0.001
    
    # Kính
    glass_w = w - 0.1
    glass_h = h - 0.1
    glass_y = y_base
    glass_d = 0.03
    make_glass(x + 0.05, y + glass_y, z + 0.05, glass_w, glass_d, glass_h, f"{name}_Glass")
    
    # Khung dọc trái
    frame_mat = (0.25, 0.25, 0.25)
    make_box(x, y + y_base, z, 0.04, 0.06, h, f"{name}_Frame_L").data.materials.append(
        assign_material(make_box(0,0,0,0.01,0.01,0.01), frame_mat, "Frame_White", roughness=0.4))
    # Khung dọc phải
    make_box(x + w - 0.04, y + y_base, z, 0.04, 0.06, h, f"{name}_Frame_R").data.materials.append(
        assign_material(make_box(0,0,0,0.01,0.01,0.01), frame_mat, "Frame_White", roughness=0.4))
    # Khung ngang trên
    make_box(x, y + y_base, z + h - 0.04, w, 0.06, 0.04, f"{name}_Frame_T").data.materials.append(
        assign_material(make_box(0,0,0,0.01,0.01,0.01), frame_mat, "Frame_White", roughness=0.4))
    # Khung ngang dưới
    make_box(x, y + y_base, z, w, 0.06, 0.04, f"{name}_Frame_B").data.materials.append(
        assign_material(make_box(0,0,0,0.01,0.01,0.01), frame_mat, "Frame_White", roughness=0.4))
    # Thanh dọc giữa
    make_box(x + w/2 - 0.02, y + y_base, z + 0.04, 0.04, 0.06, h - 0.08, f"{name}_Mullion").data.materials.append(
        assign_material(make_box(0,0,0,0.01,0.01,0.01), frame_mat, "Frame_White", roughness=0.4))
    # Bệ cửa sổ (window sill)
    make_box(x - 0.02, y + y_base - 0.02, z, w + 0.04, 0.08, 0.04, f"{name}_Sill").data.materials.append(
        assign_material(make_box(0,0,0,0.01,0.01,0.01), (0.5, 0.5, 0.5), "Sill", roughness=0.6, metallic=0.3))

def make_door(x, y, z, w, h, wall_thick, name="Door", on_front=True):
    """Cửa đi chính: khung + cánh + tay nắm"""
    sign = 1 if on_front else -1
    y_base = 0.001 if on_front else wall_thick - 0.001
    y_center = y + y_base
    
    # Khung cửa
    frame_mat = (0.15, 0.10, 0.05)
    # Khung trái
    make_box(x, y_center, z, 0.06, 0.08, h, f"{name}_Frame_L").data.materials.append(
        assign_material(make_box(0,0,0,0.01,0.01,0.01), frame_mat, "DoorFrame", roughness=0.6))
    # Khung phải
    make_box(x + w - 0.06, y_center, z, 0.06, 0.08, h, f"{name}_Frame_R").data.materials.append(
        assign_material(make_box(0,0,0,0.01,0.01,0.01), frame_mat, "DoorFrame", roughness=0.6))
    # Khung trên
    make_box(x, y_center, z + h - 0.06, w, 0.08, 0.06, f"{name}_Frame_T").data.materials.append(
        assign_material(make_box(0,0,0,0.01,0.01,0.01), frame_mat, "DoorFrame", roughness=0.6))
    # Khung dưới
    make_box(x, y_center, z, w, 0.08, 0.04, f"{name}_Frame_B").data.materials.append(
        assign_material(make_box(0,0,0,0.01,0.01,0.01), frame_mat, "DoorFrame", roughness=0.6))
    
    # Cánh cửa (chính)
    door_w = w - 0.16
    door_h = h - 0.12
    door = make_box(x + 0.08, y_center + 0.01, z + 0.04, door_w, 0.04, door_h, f"{name}_Panel")
    assign_material(door, (0.72, 0.52, 0.28), name="DoorWood", roughness=0.7)
    
    # Cánh cửa (phụ - bên phải)
    sub_w = w - 0.36
    door2 = make_box(x + w - 0.26, y_center + 0.01, z + 0.04, sub_w, 0.04, door_h, f"{name}_Panel2")
    assign_material(door2, (0.72, 0.52, 0.28), name="DoorWood2", roughness=0.7)
    
    # Tay nắm
    handle = make_box(x + door_w - 0.1, y_center + 0.05, z + h/2 - 0.1, 0.02, 0.03, 0.6, f"{name}_Handle")
    assign_material(handle, (0.8, 0.6, 0.2), name="Handle", roughness=0.3, metallic=0.8)
    
    # Ô kính trang trí trên cửa
    make_glass(x + 0.2, y_center + 0.03, z + 0.3, door_w - 0.24, 0.02, 0.3, f"{name}_GlassTop")

def make_balcony(x, y, z, w, d, h, name="Balcony"):
    """Lan can ban công"""
    # Thanh ngang trên
    rail = make_box(x, y, z + h - 0.05, w, d, 0.05, f"{name}_Rail_T")
    assign_material(rail, (0.4, 0.4, 0.4), name="Rail_T", roughness=0.3, metallic=0.5)
    # Thanh ngang dưới
    rail_b = make_box(x, y, z, w, d, 0.05, f"{name}_Rail_B")
    assign_material(rail_b, (0.4, 0.4, 0.4), name="Rail_B", roughness=0.3, metallic=0.5)
    # Thanh đứng
    for i in range(int(w / 0.2)):
        px = x + i * 0.2
        if i % 2 == 0:
            bar = make_box(px, y, z, 0.03, d, h, f"{name}_Bar_{i}")
            assign_material(bar, (0.4, 0.4, 0.4), name="Bar", roughness=0.3, metallic=0.5)
    # Trụ góc
    for px, py in [(x, y), (x, y+d), (x+w, y), (x+w, y+d)]:
        pillar = make_box(px, py, z, 0.06, 0.06, h, f"{name}_Pillar_{px}_{py}")
        assign_material(pillar, (0.35, 0.35, 0.35), name="BalconyPillar", roughness=0.4, metallic=0.4)

def make_stairs(x, y, z, width, depth, height, n_steps=14, name="Stairs"):
    """Cầu thang"""
    step_h = height / n_steps
    step_d = depth / n_steps
    for i in range(n_steps):
        sz = z + i * step_h
        sy = y + i * step_d
        # Bậc thang
        step = make_box(x, sy, sz, width, step_d, step_h, f"{name}_Step_{i}")
        assign_material(step, (0.6, 0.55, 0.5), name="Step", roughness=0.8)
        # Mặt bậc (lighter)
        tread = make_box(x, sy, sz + step_h - 0.01, width, step_d, 0.01, f"{name}_Tread_{i}")
        assign_material(tread, (0.7, 0.6, 0.5), name="Tread", roughness=0.6)

def make_pillar(x, y, z, w, d, h, name="Pillar"):
    """Cột trụ vuông"""
    obj = make_box(x, y, z, w, d, h, name)
    assign_material(obj, (0.75, 0.72, 0.68), name="Pillar", roughness=0.8)
    return obj

def make_roof_overhang(x, y, z, w, d, thick=0.12, name="RoofOverhang"):
    """Mái đua ra"""
    obj = make_box(x, y, z, w, d, thick, name)
    assign_material(obj, (0.35, 0.15, 0.08), name="Roof_Tile", roughness=0.8)
    return obj

def setup_lighting():
    """Thiết lập ánh sáng đẹp"""
    # Xoá lights mặc định
    bpy.ops.object.select_by_type(type='LIGHT')
    bpy.ops.object.delete()
    
    # Mặt trời chính
    bpy.ops.object.light_add(type='SUN', location=(15, 20, 30))
    sun = bpy.context.active_object
    sun.name = "Sun_Main"
    sun.data.energy = 8
    sun.data.angle = math.radians(1.5)
    sun.rotation_euler = (math.radians(55), math.radians(5), math.radians(45))
    
    # Mặt trời phụ (fill)
    bpy.ops.object.light_add(type='SUN', location=(-10, -5, 25))
    sun2 = bpy.context.active_object
    sun2.name = "Sun_Fill"
    sun2.data.energy = 3
    sun2.data.angle = math.radians(1)
    sun2.rotation_euler = (math.radians(40), math.radians(10), math.radians(-30))
    
    # Area light từ trên (bounce)
    bpy.ops.object.light_add(type='AREA', location=(3, 8, 20))
    area = bpy.context.active_object
    area.name = "Area_Top"
    area.data.energy = 100
    area.data.size = 10
    
    # World background
    bpy.context.scene.world.use_nodes = True
    world = bpy.context.scene.world.node_tree.nodes
    bg = world.get("Background")
    if bg:
        bg.inputs[0].default_value = (0.15, 0.18, 0.25, 1)  # Xanh nhạt
        bg.inputs[1].default_value = 0.5
    
    # Thêm sky texture nếu có
    try:
        bpy.context.scene.world.node_tree.nodes.new("ShaderNodeTexSky")
        sky = bpy.context.scene.world.node_tree.nodes["ShaderNodeTexSky"]
        sky.sky_type = 'HOSEK_WILKIE'
        sky.sun_intensity = 0.8
        sky.sun_rotation = math.radians(45)
        sky.sun_elevation = math.radians(50)
        links = bpy.context.scene.world.node_tree.links
        links.new(sky.outputs[0], bg.inputs[0])
    except:
        pass
    
def setup_cameras():
    """Thiết lập nhiều camera góc đẹp"""
    cameras = []
    
    # Camera 1: Góc 3/4 view chính diện (đẹp nhất)
    bpy.ops.object.camera_add(location=(10, -5, 8))
    cam1 = bpy.context.active_object
    cam1.name = "Camera_3_4"
    cam1.rotation_euler = (math.radians(58), 0, math.radians(75))
    cam1.data.lens = 50
    cameras.append(cam1)
    
    # Camera 2: Góc cao tổng thể
    bpy.ops.object.camera_add(location=(12, 12, 18))
    cam2 = bpy.context.active_object
    cam2.name = "Camera_Top"
    cam2.rotation_euler = (math.radians(65), 0, math.radians(38))
    cam2.data.lens = 35
    cameras.append(cam2)
    
    # Camera 3: Góc view mặt tiền
    bpy.ops.object.camera_add(location=(3, -8, 4))
    cam3 = bpy.context.active_object
    cam3.name = "Camera_Front"
    cam3.rotation_euler = (math.radians(45), 0, math.radians(90))
    cam3.data.lens = 50
    cameras.append(cam3)
    
    # Camera 4: Góc bên hông nhìn dọc
    bpy.ops.object.camera_add(location=(-6, 10, 6))
    cam4 = bpy.context.active_object
    cam4.name = "Camera_Side"
    cam4.rotation_euler = (math.radians(50), 0, math.radians(10))
    cam4.data.lens = 50
    cameras.append(cam4)
    
    return cameras

def render_scene(camera, output_path):
    """Render ra ảnh"""
    bpy.context.scene.camera = camera
    bpy.context.scene.render.engine = 'CYCLES'
    bpy.context.scene.render.resolution_x = 1920
    bpy.context.scene.render.resolution_y = 1080
    bpy.context.scene.render.filepath = output_path
    bpy.context.scene.render.image_settings.file_format = 'PNG'
    bpy.context.scene.cycles.samples = 256
    bpy.context.scene.cycles.use_denoising = True
    bpy.ops.render.render(write_still=True)
    print(f"✅ Render xong: {output_path}")

# ═══════ MAIN ═══════

print("🧹 Dọn scene...")
clean_scene()

# === NỀN ĐẤT ===
print("🌍 Vẽ đất + cảnh quan...")
# Nền đất
ground = make_box(-12, -12, -0.3, 40, 50, 0.3, "Ground")
assign_material(ground, (0.55, 0.45, 0.35), name="Ground", roughness=1.0)
ground.hide_viewport = False

# Mặt đường trước nhà
road = make_box(-2, -10.5, 0.01, 12, 4, 0.05, "Road")
assign_material(road, (0.25, 0.25, 0.25), name="Road", roughness=0.95)
# Vỉa hè
sidewalk = make_box(-2, -6.5, 0.01, 12, 1.5, 0.08, "Sidewalk")
assign_material(sidewalk, (0.7, 0.68, 0.65), name="Sidewalk", roughness=0.9)

# === Sàn các tầng ===
print("🏗️ Vẽ sàn bê tông...")
make_slab(0, 0, 0, W, D, "Slab_Ground")  # Sàn trệt (móng)
make_slab(0, 0, H1, W, D, "Slab_F1")      # Sàn tầng 1
make_slab(0, 0, H1 + H2, W, D, "Slab_F2")  # Sàn tầng 2

# === TẦNG 1 — Showroom (thụt 1m phía trước) ===
print("🧱 Vẽ tầng 1...")
z1 = H1
t1_x = SETBACK  # thụt 1m
t1_w = W - SETBACK

# Tường trái
make_wall(t1_x, 0, 0, WALL_T, D, z1, "Wall_F1_L")
# Tường phải
make_wall(W - WALL_T, 0, 0, WALL_T, D, z1, "Wall_F1_R")
# Tường trước (mặt tiền - lùi SETBACK)
make_wall(t1_x, 0, 0, t1_w, WALL_T, z1, "Wall_F1_F")
# Tường sau
make_wall(0, D - WALL_T, 0, W, WALL_T, z1, "Wall_F1_B")
# Tường ngăn WC + cầu thang (phía cuối nhà)
make_wall(0, D - 4.5, 0, W, WALL_T, z1, "Wall_F1_Divider")

# Cửa kính lớn mặt tiền showroom
make_door(t1_x + 0.5, 0, 1.0, 1.8, 2.4, WALL_T, "MainDoor_F1", on_front=True)

# Cửa sổ kính lớn showroom mặt tiền
make_window(t1_x + 3.0, 0, 1.0, 1.8, 1.8, WALL_T, "ShowroomWindow_F1", on_front=True)

# === TẦNG 2 — Showroom ===
print("🧱 Vẽ tầng 2...")
z2 = H1 + H2

# Tường bao
make_wall(0, 0, H1, WALL_T, D, H2, "Wall_F2_L")
make_wall(W - WALL_T, 0, H1, WALL_T, D, H2, "Wall_F2_R")
make_wall(0, 0, H1, W, WALL_T, H2, "Wall_F2_F")
make_wall(0, D - WALL_T, H1, W, WALL_T, H2, "Wall_F2_B")

# Cửa sổ mặt tiền tầng 2
for i, wx in enumerate([0.5, 2.3, 4.1]):
    make_window(wx, 0, H1 + 0.8, 1.2, 1.6, WALL_T, f"Window_F2_{i}")

# Cửa sổ bên hông tầng 2
for i, wy in enumerate([1.5, 5, 9, 13]):
    make_window(0, wy, H1 + 0.8, 1.0, 1.4, WALL_T, f"Window_F2_SideL_{i}", on_front=False)

# Ban công nhỏ tầng 2 (mặt tiền)
# Sàn ban công
balcony_slab = make_box(0.2, -0.5, H1 + H2 - 0.1, W - 0.4, 0.6, 0.1, "Balcony_F2_Floor")
assign_material(balcony_slab, (0.5, 0.5, 0.5), name="Balcony_Floor", roughness=0.8)
# Lan can ban công
make_balcony(0.2, -0.5, H1 + H2 - 0.05, W - 0.4, 0.6, 1.0, "Balcony_F2")

# === TẦNG 3 — 2 phòng ngủ ===
print("🧱 Vẽ tầng 3...")
z3 = H1 + H2 + H3

make_wall(0, 0, H1 + H2, WALL_T, D, H3, "Wall_F3_L")
make_wall(W - WALL_T, 0, H1 + H2, WALL_T, D, H3, "Wall_F3_R")
make_wall(0, 0, H1 + H2, W, WALL_T, H3, "Wall_F3_F")
make_wall(0, D - WALL_T, H1 + H2, W, WALL_T, H3, "Wall_F3_B")

# Tường ngăn phòng ngủ
make_wall(0, 0, H1 + H2, W, WALL_T, H3, "Wall_F3_Divider", color="white")

# Cửa sổ phòng ngủ mặt tiền
for i, wx in enumerate([0.5, 2.3, 4.1]):
    make_window(wx, 0, H1 + H2 + 0.9, 1.2, 1.5, WALL_T, f"Window_F3_{i}")

# Cửa sổ bên hông
for i, wy in enumerate([1.5, 5, 9, 13]):
    make_window(0, wy, H1 + H2 + 0.9, 1.0, 1.3, WALL_T, f"Window_F3_SideL_{i}", on_front=False)

# Ban công tầng 3
balcony_slab3 = make_box(0.2, -0.5, H1 + H2 + H3 - 0.1, W - 0.4, 0.6, 0.1, "Balcony_F3_Floor")
assign_material(balcony_slab3, (0.5, 0.5, 0.5), name="Balcony_F3_Floor", roughness=0.8)
make_balcony(0.2, -0.5, H1 + H2 + H3 - 0.05, W - 0.4, 0.6, 1.0, "Balcony_F3")

# === CỘT TRỤ ===
print("🏛️ Vẽ cột trụ...")
# Cột góc nhà
for cx, cy in [(0, 0), (W - 0.2, 0), (0, D - 0.2), (W - 0.2, D - 0.2)]:
    make_pillar(cx, cy, 0, 0.2, 0.2, H1 + H2 + H3, f"Pillar_Corner_{cx}_{cy}")

# Cột treo/mái đua trước nhà
for cx in [0.2, W - 0.4]:
    make_pillar(cx, -0.3, 0, 0.25, 0.25, H1, f"Pillar_Portico_{cx}")

# === MÁI ===
print("🏠 Vẽ mái nhà...")
# Mái chính
roof = make_box(-0.3, -0.3, H1 + H2 + H3, W + 0.6, D + 0.6, 0.15, "Roof_Main")
assign_material(roof, (0.55, 0.25, 0.12), name="Roof_Tiles", roughness=0.85)

# Viền mái
make_box(-0.3, -0.3, H1 + H2 + H3 + 0.15, 0.12, D + 0.6, 0.2, "Roof_Eave_F")
assign_material(make_box(-0.3, -0.3, 0, 0.01, 0.01, 0.01), (0.5, 0.5, 0.5), name="Eave", roughness=0.5, metallic=0.3)
make_box(W + 0.18, -0.3, H1 + H2 + H3 + 0.15, 0.12, D + 0.6, 0.2, "Roof_Eave_R")
make_box(-0.3, -0.3, H1 + H2 + H3 + 0.15, W + 0.6, 0.12, 0.2, "Roof_Eave_Front")
make_box(-0.3, D + 0.18, H1 + H2 + H3 + 0.15, W + 0.6, 0.12, 0.2, "Roof_Eave_Back")

# === CÂY CỐI ===
print("🌳 Vẽ cây xanh...")
for tx, tz, scale in [(4, 5, 1.0), (-2, 3, 0.8), (-1.5, 12, 0.9)]:
    # Thân cây
    trunk = bpy.ops.mesh.primitive_cylinder_add(
        vertices=8, radius=0.08*scale, depth=0.8*scale,
        location=(tx, tz, 0.4*scale)
    )
    # Tán cây (hình cầu)
    bpy.ops.mesh.primitive_uv_sphere_add(
        radius=0.4*scale, location=(tx, tz, 0.9*scale + 0.4*scale)
    )
    tree_canopy = bpy.context.active_object
    tree_canopy.name = f"Tree_Canopy_{tx}_{tz}"
    assign_material(tree_canopy, (0.1, 0.5, 0.1), name="Tree_Green", roughness=1.0)

# Sửa lỗi: dùng primitive
for tx, tz, scale in [(4, 5, 1.0), (-2, 3, 0.8), (-1.5, 12, 0.9)]:
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=8, radius=0.08*scale, depth=0.8*scale,
        location=(tx, tz, 0.4*scale)
    )
    trunk = bpy.context.active_object
    trunk.name = f"Tree_Trunk_{tx}_{tz}"
    assign_material(trunk, (0.35, 0.2, 0.08), name="Tree_Bark", roughness=0.9)
    
    bpy.ops.mesh.primitive_uv_sphere_add(
        radius=0.4*scale, location=(tx, tz, 0.9*scale + 0.05)
    )
    canopy = bpy.context.active_object
    canopy.name = f"Tree_Canopy_{tx}_{tz}"
    assign_material(canopy, (0.08, 0.45, 0.08), name="Tree_Green", roughness=1.0)

# === CAMERA + RENDER ===
print("📷 Thiết lập camera...")
cameras = setup_cameras()

print("💡 Thiết lập ánh sáng...")
setup_lighting()

# Render nhiều góc
for i, cam in enumerate(cameras):
    output_path = os.path.join(OUTPUT_DIR, f"house_view_{i+1}.png")
    render_scene(cam, output_path)
    print(f"📸 View {i+1}/4 hoàn thành!")

print("🎉 HOÀN THÀNH! Ảnh đã lưu trong images/")
