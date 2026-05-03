#!/usr/bin/env python3
"""
🏢 Blender Architecture V3 — Nhà 6x16 3 tầng cao cấp
Chạy: blender --background --python generate_house_v3.py

Cải tiến so với V1:
✓ Cửa sổ khung nhôm + kính trong suốt
✓ Cửa đi chính 2 cánh + tay nắm
✓ Ban công tầng 2,3 có lan can
✓ Cột trụ trang trí
✓ Mái đua + viền mái
✓ Cây xanh cảnh quan
✓ 4 góc camera đẹp
✓ Render WEBP chất lượng cao
✓ Vật liệu PBR với màu sắc thực tế
"""
import bpy
import math
import os
import sys

# ═══════ THÔNG SỐ ═══════
W, D = 6.0, 16.0          # Kích thước nhà
H1, H2, H3 = 3.5, 3.3, 3.3  # Cao tầng
WALL_T = 0.2              # Tường dày
SETBACK = 1.0             # Thụt
SAMPLES = 128

OUTPUT_DIR = os.path.expanduser("~/.openclaw/workspace/tranhuuminh-vlxd/images")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ═══════ BLENDER API HELPERS ═══════

def node_clean(nodes):
    """Xoá tất cả nodes trừ output"""
    out = nodes.get("Material Output")
    for n in list(nodes):
        if n != out:
            nodes.remove(n)
    return out

def make_pbr_mat(name, color=(0.8,0.8,0.8), roughness=0.5, metallic=0.0):
    """Tạo Principled BSDF material (Blender 5.x compatible)"""
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    out = node_clean(nodes)
    bsdf = nodes.new(type="ShaderNodeBsdfPrincipled")
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    mat.node_tree.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return mat

def make_glass_mat(name="Glass"):
    """Kính trong suốt"""
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    out = node_clean(nodes)
    bsdf = nodes.new(type="ShaderNodeBsdfPrincipled")
    bsdf.inputs["Base Color"].default_value = (0.9, 0.95, 1.0, 1.0)
    bsdf.inputs["Roughness"].default_value = 0.0
    bsdf.inputs["Transmission Weight"].default_value = 0.95
    bsdf.inputs["IOR"].default_value = 1.45
    mat.node_tree.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return mat

def assign_mat(obj, mat):
    if obj.data.materials:
        obj.data.materials[0] = mat
    else:
        obj.data.materials.append(mat)
    return obj

def box(name, x, y, z, w, d, h):
    """Khối hộp"""
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x+w/2, y+d/2, z+h/2))
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = (w, d, h)
    bpy.ops.object.transform_apply(scale=True)
    return obj

def wall(name, x, y, z, w, d, h, color=(0.92,0.90,0.87), rough=0.7):
    o = box(name, x, y, z, w, d, h)
    mat = make_pbr_mat(f"M_{name}", color, rough)
    assign_mat(o, mat)
    return o

def slab(name, x, y, z, w, d):
    return box(f"Slab_{name}", x, y, z, w, d, 0.15)

def make_metal_box(name, x, y, z, w, d, h, color=(0.2,0.2,0.2), rough=0.3, metal=0.6):
    o = box(name, x, y, z, w, d, h)
    assign_mat(o, make_pbr_mat(f"M_{name}", color, rough, metal))
    return o

def make_window(x, y, z, w, h, name="W"):
    """Cửa sổ hoàn chỉnh"""
    glass_mat = make_glass_mat(f"Glass_{name}")
    frame_mat = make_pbr_mat(f"Frame_{name}", (0.22,0.22,0.22), 0.3, 0.4)
    sill_mat = make_pbr_mat(f"Sill_{name}", (0.5,0.45,0.4), 0.6)

    # Kính
    g = box(f"{name}_G", x+0.05, y+0.005, z+0.05, w-0.1, 0.02, h-0.1)
    assign_mat(g, glass_mat)

    # Khung
    fw, fd, fh = 0.04, 0.06, h
    make_metal_box(f"{name}_FL", x, y, z, fw, fd, fh).data.materials[0] = frame_mat
    make_metal_box(f"{name}_FR", x+w-fw, y, z, fw, fd, fh).data.materials[0] = frame_mat
    make_metal_box(f"{name}_FT", x, y, z+h-0.04, w, fd, 0.04).data.materials[0] = frame_mat
    make_metal_box(f"{name}_FB", x, y, z, w, fd, 0.04).data.materials[0] = frame_mat
    make_metal_box(f"{name}_MV", x+w/2-0.02, y, z+0.04, 0.04, fd, h-0.10).data.materials[0] = frame_mat
    # Thanh ngang giữa
    make_metal_box(f"{name}_MH", x+0.04, y, z+h/2-0.02, w-0.08, fd, 0.04).data.materials[0] = frame_mat

    # Bệ cửa sổ
    s = box(f"{name}_Sill", x-0.03, y-0.01, z, w+0.06, 0.10, 0.05)
    assign_mat(s, sill_mat)

def make_door(x, y, z, w, h, name="D"):
    """Cửa đi 2 cánh"""
    wood_mat = make_pbr_mat(f"Wood_{name}", (0.68,0.48,0.25), 0.7)
    frame_mat = make_pbr_mat(f"DFrame_{name}", (0.12,0.08,0.04), 0.6)
    handle_mat = make_pbr_mat(f"Handle_{name}", (0.8,0.6,0.15), 0.2, 0.9)
    glass_mat = make_glass_mat(f"DGlass_{name}")

    fw = 0.06
    # Khung
    make_metal_box(f"{name}_FL", x, y, z, fw, 0.08, h).data.materials[0] = frame_mat
    make_metal_box(f"{name}_FR", x+w-fw, y, z, fw, 0.08, h).data.materials[0] = frame_mat
    make_metal_box(f"{name}_FT", x, y, z+h-0.04, w, 0.08, 0.04).data.materials[0] = frame_mat
    make_metal_box(f"{name}_FB", x, y, z, w, 0.08, 0.04).data.materials[0] = frame_mat

    # Cánh cửa
    pw = w/2 - 0.10
    ph = h - 0.10
    for j, (px, pw2) in enumerate([(x+0.08, pw), (x+0.08+pw+0.04, pw)]):
        door = box(f"{name}_P{j}", px, y+0.01, z+0.04, pw2, 0.04, ph)
        assign_mat(door, wood_mat)
        # Ô kính trang trí
        kg = box(f"{name}_KG{j}", px+0.08, y+0.02, z+0.20, pw2-0.16, 0.02, 0.25)
        assign_mat(kg, glass_mat)

    # Tay nắm bên phải
    hn = box(f"{name}_HN", x+w-0.35, y+0.05, z+ph/2, 0.02, 0.03, 0.4)
    assign_mat(hn, handle_mat)

def make_balcony(x, y, z, w, d, h, name="B"):
    """Lan can ban công"""
    metal_mat = make_pbr_mat(f"B_Metal_{name}", (0.35,0.35,0.35), 0.3, 0.5)

    # Thanh trên/dưới
    for layer_z, thick in [(z+h-0.04, 0.04), (z, 0.04)]:
        o = box(f"{name}_R_{layer_z}", x, y, layer_z, w, d, thick)
        assign_mat(o, metal_mat)

    # Thanh đứng
    n = int(w / 0.15)
    for i in range(n):
        if i % 2 == 0:
            bx = x + i * w / n
            o = box(f"{name}_V_{i}", bx, y, z, 0.03, d, h)
            assign_mat(o, metal_mat)

    # Trụ góc
    for cx, cy in [(x,y), (x,y+d-0.05), (x+w-0.05,y), (x+w-0.05,y+d-0.05)]:
        o = box(f"{name}_P_{cx}_{cy}", cx, cy, z, 0.06, 0.06, h)
        assign_mat(o, metal_mat)

# ═══════ BUILD ═══════

def build_house():
    """Xây nhà"""
    print("🧹 Dọn scene...")
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()
    for m in list(bpy.data.materials):
        bpy.data.materials.remove(m)

    # === NỀN ĐẤT ===
    print("🌍 Nền đất + mặt đường...")
    ground_wall_mat = make_pbr_mat("M_Ground", (0.55,0.48,0.38), 1.0)
    assign_mat(box("Ground", -10, -10, -0.3, 35, 50, 0.3), ground_wall_mat)
    # Đường
    road_mat = make_pbr_mat("M_Road", (0.20,0.20,0.20), 0.95)
    assign_mat(box("Road", -2, -8.0, 0.01, 12, 6, 0.05), road_mat)
    # Vỉa hè
    sw_mat = make_pbr_mat("M_Sidewalk", (0.72,0.70,0.67), 0.9)
    assign_mat(box("Sidewalk", -2, -2.5, 0.01, 12, 1.5, 0.08), sw_mat)
    # Vỉa hè bên
    assign_mat(box("Sidewalk_Side", W+0.5, 0, 0.01, 2, D, 0.08), sw_mat)

    # === MÓNG & SÀN ===
    print("🏗️ Sàn bê tông...")
    concrete_mat = make_pbr_mat("M_Concrete", (0.65,0.63,0.60), 0.9)
    for level in [0.0, H1, H1+H2]:
        o = box(f"Floor_{level}", -0.1, -0.1, level, W+0.2, D+0.2, 0.15)
        assign_mat(o, concrete_mat)

    H_total = H1 + H2 + H3
    wall_color = (0.92, 0.90, 0.87)  # Cream
    white_color = (0.95, 0.95, 0.93)

    # === TẦNG 1 ===
    print("🧱 Tầng 1 (Showroom)...")
    z0 = 0.0

    # Tường bao
    wall("T1_L", SETBACK, 0, z0, WALL_T, D, H1, wall_color)
    wall("T1_R", W-WALL_T, 0, z0, WALL_T, D, H1, wall_color)
    wall("T1_F", SETBACK, 0, z0, W-SETBACK, WALL_T, H1, wall_color)
    wall("T1_B", 0, D-WALL_T, z0, W, WALL_T, H1, wall_color)

    # Cửa kính mặt tiền
    make_door(SETBACK+0.4, 0, 1.0, 1.8, 2.4, "MainDoor")
    make_window(SETBACK+3.0, 0, 1.0, 1.8, 1.8, "ShowWindow")

    # Vách kính bên phải - dùng glass block thay vì window
    g = box("SideGlass1", W-WALL_T-0.1, 2.0, 1.0, 0.1, 0.02, 1.5)
    assign_mat(g, make_glass_mat("Glass_Side1"))

    # Cửa sổ bên hông
    for i, wy in enumerate([2.5, 7, 11]):
        make_window(0.005, wy, 1.0, 1.2, 1.4, f"SideW_F1_{i}")

    # === TẦNG 2 ===
    print("🧱 Tầng 2 (Showroom)...")
    z1 = H1

    wall("T2_L", 0, 0, z1, WALL_T, D, H2, white_color)
    wall("T2_R", W-WALL_T, 0, z1, WALL_T, D, H2, white_color)
    wall("T2_F", 0, 0, z1, W, WALL_T, H2, white_color)
    wall("T2_B", 0, D-WALL_T, z1, W, WALL_T, H2, white_color)

    # Cửa sổ mặt tiền
    for i, wx in enumerate([0.4, 2.2, 4.0]):
        make_window(wx, 0, z1+0.9, 1.4, 1.6, f"FrontW_F2_{i}")

    # Cửa sổ bên hông
    for i, wy in enumerate([2.5, 7, 11]):
        make_window(0.005, wy, z1+0.9, 1.2, 1.4, f"SideW_F2_{i}")

    # Sàn ban công
    bc_mat = make_pbr_mat("M_Balcony", (0.65,0.65,0.55), 0.8)
    o = box("Balcony_F2_Floor", 0.3, -0.6, H1+H2-0.1, W-0.6, 0.7, 0.1)
    assign_mat(o, bc_mat)
    # Lan can ban công
    make_balcony(0.3, -0.6, H1+H2-0.05, W-0.6, 0.7, 1.0, "Balcony_F2")

    # === TẦNG 3 ===
    print("🧱 Tầng 3 (Phòng ngủ)...")
    z2 = H1 + H2

    wall("T3_L", 0, 0, z2, WALL_T, D, H3, white_color)
    wall("T3_R", W-WALL_T, 0, z2, WALL_T, D, H3, white_color)
    wall("T3_F", 0, 0, z2, W, WALL_T, H3, white_color)
    wall("T3_B", 0, D-WALL_T, z2, W, WALL_T, H3, white_color)

    # Cửa sổ mặt tiền
    for i, wx in enumerate([0.4, 2.2, 4.0]):
        make_window(wx, 0, z2+0.9, 1.4, 1.6, f"FrontW_F3_{i}")

    # Cửa sổ bên hông
    for i, wy in enumerate([2.5, 7, 11]):
        make_window(0.005, wy, z2+0.9, 1.2, 1.4, f"SideW_F3_{i}")

    # Ban công tầng 3
    o = box("Balcony_F3_Floor", 0.3, -0.6, H_total-0.1, W-0.6, 0.7, 0.1)
    assign_mat(o, bc_mat)
    make_balcony(0.3, -0.6, H_total-0.05, W-0.6, 0.7, 1.0, "Balcony_F3")

    # === CỘT TRỤ ===
    print("🏛️ Cột trụ...")
    pillar_mat = make_pbr_mat("M_Pillar", (0.55,0.50,0.45), 0.8)
    for cx, cy in [(0,0), (W-WALL_T,0), (0,D-WALL_T), (W-WALL_T,D-WALL_T)]:
        o = box(f"Pillar_{cx}_{cy}", cx, cy, 0, WALL_T, WALL_T, H_total)
        assign_mat(o, pillar_mat)

    # Cột mái đua
    for cx in [0.1, W-0.3]:
        o = box(f"PortPillar_{cx}", cx, -0.3, 0, 0.25, 0.25, H1)
        assign_mat(o, pillar_mat)

    # === MÁI ===
    print("🏠 Mái nhà...")
    roof_mat = make_pbr_mat("M_Roof", (0.55,0.22,0.10), 0.85)
    eave_mat = make_pbr_mat("M_Eave", (0.50,0.50,0.50), 0.5, 0.3)

    roof_ext = 0.4
    o = box("Roof", -roof_ext, -roof_ext, H_total, W+2*roof_ext, D+2*roof_ext, 0.15)
    assign_mat(o, roof_mat)

    # Viền mái
    ew = 0.10
    for ex, ey, ew2, ed2 in [
        (-roof_ext, -roof_ext, ew, D+2*roof_ext),
        (W+roof_ext-ew, -roof_ext, ew, D+2*roof_ext),
        (-roof_ext, -roof_ext, W+2*roof_ext, ew),
        (-roof_ext, D+roof_ext-ew, W+2*roof_ext, ew),
    ]:
        o = box(f"Eave_{ex}_{ey}", ex, ey, H_total+0.15, ew2, ed2, 0.2)
        assign_mat(o, eave_mat)

    # === CÂY XANH ===
    print("🌳 Cây xanh...")
    trunk_mat = make_pbr_mat("M_Trunk", (0.35,0.20,0.08), 0.9)
    leaf_mat = make_pbr_mat("M_Leaf", (0.06,0.40,0.06), 1.0)

    for tx, tz, sc in [(4, 4, 1.0), (-2, 2, 0.8), (-1.5, 11, 0.9)]:
        bpy.ops.mesh.primitive_cylinder_add(
            vertices=8, radius=0.08*sc, depth=0.8*sc, location=(tx, tz, 0.4*sc))
        assign_mat(bpy.context.active_object, trunk_mat)
        bpy.ops.mesh.primitive_uv_sphere_add(
            radius=0.4*sc, location=(tx, tz, 0.9*sc+0.05))
        assign_mat(bpy.context.active_object, leaf_mat)

    print("✅ Mô hình hoàn tất!")

# ═══════ SETUP ═══════

def setup():
    """Camera + ánh sáng + render settings"""
    # Xoá lights mặc định
    bpy.ops.object.select_by_type(type='LIGHT')
    bpy.ops.object.delete()

    # Render settings
    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'
    scene.render.resolution_x = 1920
    scene.render.resolution_y = 1080
    scene.cycles.samples = SAMPLES
    scene.cycles.use_denoising = True
    try:
        scene.cycles.denoiser = 'OPENIMAGEDENOISE'
    except TypeError:
        # Blender 5.x denoiser handling
        pass
    try:
        scene.render.dither_intensity = 0.02
    except:
        pass

    # View transform
    scene.view_settings.view_transform = 'AgX'
    try:
        scene.view_settings.look = 'Default'
    except TypeError:
        scene.view_settings.look = 'AgX - Base Contrast'

    # Ánh sáng mặt trời
    bpy.ops.object.light_add(type='SUN', location=(15, 20, 30))
    sun = bpy.context.active_object
    sun.name = "Sun_Main"
    sun.data.energy = 10
    sun.data.angle = math.radians(2)
    sun.rotation_euler = (math.radians(50), math.radians(3), math.radians(40))

    # Fill light
    bpy.ops.object.light_add(type='SUN', location=(-12, -3, 25))
    sun2 = bpy.context.active_object
    sun2.name = "Sun_Fill"
    sun2.data.energy = 3
    sun2.data.angle = math.radians(1)
    sun2.rotation_euler = (math.radians(35), math.radians(5), math.radians(-20))

    # Area từ trên
    bpy.ops.object.light_add(type='AREA', location=(3, 8, 25))
    area = bpy.context.active_object
    area.name = "Area_Top"
    area.data.energy = 80
    area.data.size = 10

    # World background
    world = scene.world
    world.use_nodes = True
    bg = world.node_tree.nodes.get("Background")
    if bg:
        bg.inputs["Color"].default_value = (0.12, 0.15, 0.22, 1.0)
        bg.inputs["Strength"].default_value = 0.8

def make_cameras():
    """Tạo 4 camera với Track To constraint để luôn nhìn vào nhà"""
    cams = []
    
    # Target để camera luôn nhìn vào
    bpy.ops.object.empty_add(type='PLAIN_AXES', location=(W/2, D/2, H1+H2/2))
    target = bpy.context.active_object
    target.name = "Cam_Target"
    
    # Cam 1: 3/4 view - thấy mặt tiền + bên hông
    bpy.ops.object.camera_add(location=(12, -4, 10))
    cam = bpy.context.active_object; cam.name = "Cam_34"; cam.data.lens = 50
    track = cam.constraints.new(type='TRACK_TO')
    track.target = target
    track.track_axis = 'TRACK_NEGATIVE_Z'
    track.up_axis = 'UP_Y'
    cam.data.clip_end = 1000
    cams.append(cam)
    
    # Cam 2: Góc cao tổng quan
    bpy.ops.object.camera_add(location=(10, 12, 20))
    cam = bpy.context.active_object; cam.name = "Cam_Top"; cam.data.lens = 35
    track = cam.constraints.new(type='TRACK_TO')
    track.target = target
    track.track_axis = 'TRACK_NEGATIVE_Z'
    track.up_axis = 'UP_Y'
    cam.data.clip_end = 1000
    cams.append(cam)
    
    # Cam 3: Mặt tiền chính diện
    bpy.ops.object.camera_add(location=(3, -12, 5))
    cam = bpy.context.active_object; cam.name = "Cam_Front"; cam.data.lens = 50
    track = cam.constraints.new(type='TRACK_TO')
    track.target = target
    track.track_axis = 'TRACK_NEGATIVE_Z'
    track.up_axis = 'UP_Y'
    cam.data.clip_end = 1000
    cams.append(cam)
    
    # Cam 4: Góc bên hông
    bpy.ops.object.camera_add(location=(-10, 8, 6))
    cam = bpy.context.active_object; cam.name = "Cam_Side"; cam.data.lens = 50
    track = cam.constraints.new(type='TRACK_TO')
    track.target = target
    track.track_axis = 'TRACK_NEGATIVE_Z'
    track.up_axis = 'UP_Y'
    cam.data.clip_end = 1000
    cams.append(cam)
    
    return cams

# ═══════ MAIN ═══════

if __name__ == "__main__":
    build_house()
    setup()
    cams = make_cameras()
    
    for i, cam in enumerate(cams):
        scene = bpy.context.scene
        scene.camera = cam
        png_path = os.path.join(OUTPUT_DIR, f"house_v3_view_{i+1}.png")
        scene.render.filepath = png_path
        bpy.ops.render.render(write_still=True)
        print(f"📸 View {i+1}/4 → {png_path}")
    
    print("🎉 HOÀN THÀNH! Ảnh đã lưu trong images/")
