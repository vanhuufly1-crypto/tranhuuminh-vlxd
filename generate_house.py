#!/usr/bin/env python3
"""
🏢 Blender Architecture Generator — Tự động vẽ nhà 3D chuyên nghiệp
Chạy: blender --background --python generate_house.py
"""
import bpy
import math
import os

# ═══════ THÔNG SỐ ═══════
W = 6.0   # Ngang (m)
D = 16.0  # Dài (m)
H1, H2, H3 = 3.5, 3.3, 3.3  # Cao mỗi tầng (đúng TCVN)
SETBACK = 1.0  # Thụt 1m
WALL_T = 0.2   # Tường dày 0.2m

OUTPUT = os.path.expanduser("~/.openclaw/workspace/tranhuuminh-vlxd/docs/thiet_ke_blender.png")

def clean_scene():
    """Xoá đối tượng mặc định"""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()

def make_box(x, y, z, w, d, h, name="Box"):
    """Tạo khối hộp"""
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x+w/2, y+d/2, z+h/2))
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = (w, d, h)
    bpy.ops.object.transform_apply(scale=True)
    return obj

def make_wall(x, y, z, w, d, h, name="Wall"):
    """Tạo tường"""
    obj = make_box(x, y, z, w, d, h, name)
    mat = bpy.data.materials.new(name=f"Mat_{name}")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs[0].default_value = (0.85, 0.85, 0.82, 1)  # Base Color
    bsdf.inputs[2].default_value = 0.5                     # Roughness
    if obj.data.materials:
        obj.data.materials[0] = mat
    else:
        obj.data.materials.append(mat)
    return obj

def make_glass(x, y, z, w, d, h, name="Window"):
    """Tạo kính"""
    obj = make_box(x, y, z, w, d, h, name)
    mat = bpy.data.materials.new(name=f"Mat_{name}")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs[0].default_value = (0.7, 0.85, 1.0, 0.3)  # Base Color
    bsdf.inputs[2].default_value = 0.0                     # Roughness
    bsdf.inputs[18].default_value = 0.3                    # Transmission (subsurface scale thay cho transmission)
    bsdf.inputs[3].default_value = 1.45                    # IOR
    if obj.data.materials:
        obj.data.materials[0] = mat
    else:
        obj.data.materials.append(mat)
    return obj

def make_roof(x, y, z, w, d, h, name="Roof"):
    """Tạo mái"""
    obj = make_box(x, y, z, w, d, h, name)
    mat = bpy.data.materials.new(name=f"Mat_{name}")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs[0].default_value = (0.6, 0.2, 0.1, 1)  # Base Color
    bsdf.inputs[2].default_value = 0.8                  # Roughness
    if obj.data.materials:
        obj.data.materials[0] = mat
    else:
        obj.data.materials.append(mat)
    return obj

def setup_camera():
    """Thiết lập camera"""
    bpy.ops.object.camera_add(location=(15, 20, 15))
    cam = bpy.context.active_object
    cam.rotation_euler = (math.radians(60), 0, math.radians(45))
    bpy.context.scene.camera = cam
    
    # Ánh sáng
    bpy.ops.object.light_add(type='SUN', location=(10, 10, 25))
    sun = bpy.context.active_object
    sun.data.energy = 5
    sun.rotation_euler = (math.radians(60), 0, math.radians(30))
    
    # Ánh sáng phụ
    bpy.ops.object.light_add(type='AREA', location=(-10, 20, 10))
    area = bpy.context.active_object
    area.data.energy = 200
    area.data.size = 5

def render(output_path):
    """Render ra ảnh"""
    bpy.context.scene.render.engine = 'CYCLES'
    bpy.context.scene.render.resolution_x = 1920
    bpy.context.scene.render.resolution_y = 1080
    bpy.context.scene.render.filepath = output_path
    bpy.context.scene.render.image_settings.file_format = 'PNG'
    bpy.ops.render.render(write_still=True)
    print(f"✅ Render xong: {output_path}")

# ═══════ MAIN ═══════
clean_scene()

# Nền đất
make_box(-5, -5, -0.3, 30, 30, 0.3, "Ground").hide_viewport = True

# === TẦNG 1 (thụt 1m) ===
z1 = 0
# Sàn tầng 1
make_wall(SETBACK, 0, z1, W-SETBACK, D, WALL_T, "Floor1")
# Tường tầng 1
make_wall(SETBACK, 0, z1, WALL_T, D, H1)  # Tường trái
make_wall(SETBACK, 0, z1, W-SETBACK, WALL_T, H1)  # Tường trước
make_wall(SETBACK, D-WALL_T, z1, W-SETBACK, WALL_T, H1)  # Tường sau
make_wall(W-WALL_T, 0, z1, WALL_T, D, H1)  # Tường phải

# Cửa kính mặt tiền
make_glass(W/2-0.8, 0, z1, 1.6, 0.1, 2.4, "FrontDoor")

# Khu để xe (mái che)
make_box(SETBACK-0.5, 8, H1-0.1, 0.5, 0.5, 0.1, "Carport_Pillar1")
make_box(SETBACK-0.5, 0, H1-0.1, 0.5, 0.5, 0.1, "Carport_Pillar2")

# === TẦNG 2 ===
z2 = H1
make_wall(0, 0, z2, WALL_T*2, D, H2)  # Tường trái
make_wall(0, 0, z2, W, WALL_T, H2)  # Tường trước
make_wall(0, D-WALL_T, z2, W, WALL_T, H2)  # Tường sau
make_wall(W-WALL_T*2, 0, z2, WALL_T*2, D, H2)  # Tường phải

# Cửa sổ
for wx in [1.0, 2.5, 4.0]:
    make_glass(wx, 0.01, z2+0.8, 0.8, 0.1, 1.5, f"Window_T2_{wx}")

# === TẦNG 3 ===
z3 = H1 + H2
make_wall(0, 0, z3, WALL_T*2, D, H3)
make_wall(0, 0, z3, W, WALL_T, H3)
make_wall(0, D-WALL_T, z3, W, WALL_T, H3)
make_wall(W-WALL_T*2, 0, z3, WALL_T*2, D, H3)

# Cửa sổ
for wx in [1.0, 2.5, 4.0]:
    make_glass(wx, 0.01, z3+0.8, 0.8, 0.1, 1.5, f"Window_T3_{wx}")

# Mái
make_roof(-0.5, -0.5, H1+H2+H3, W+1, D+1, 0.15, "Roof")

# Camera + ánh sáng
setup_camera()

# Render
os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
render(OUTPUT)

print("🎉 HOÀN THÀNH!")
