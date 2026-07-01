#!/usr/bin/env python3
"""
Keyword Strategy for Tran Huu Minh VLXD
- Analyzes current blog coverage
- Suggests missing high-value keywords
- Generates targeted content briefs
"""

import json, os, re, sys

# === HIGH-VALUE TARGET KEYWORDS ===
KEYWORD_CLUSTERS = {
    "sơn_chống_thấm": {
        "head": "sơn chống thấm Hải Phòng",
        "long_tail": [
            "sơn chống thấm sân thượng Hải Phòng",
            "sơn chống thấm nhà vệ sinh Hải Phòng",
            "báo giá sơn chống thấm Hải Phòng 2026",
            "sơn chống thấm tường ngoài trời Hải Phòng",
            "chống thấm tum Hải Phòng",
            "chống thấm tầng hầm Hải Phòng",
            "giá sơn chống thấm Munich tại Hải Phòng",
            "thợ chống thấm Hải Phòng",
            "dịch vụ chống thấm Hải Phòng",
        ],
        "volume": "cao",
        "priority": "⭐ ⭐ ⭐"
    },
    "báo_giá_sơn": {
        "head": "bảng giá sơn Hải Phòng",
        "long_tail": [
            "báo giá sơn nhà Hải Phòng",
            "bảng giá sơn Dulux Hải Phòng",
            "báo giá sơn Jotun Hải Phòng",
            "giá sơn Munich Hải Phòng mới nhất",
            "báo giá sơn Kova Hải Phòng",
            "bảng giá sơn Nano House Hải Phòng",
            "sơn nhà giá rẻ Hải Phòng",
            "báo giá sơn Nippon Hải Phòng",
            "báo giá sơn nội thất Hải Phòng",
        ],
        "volume": "cao",
        "priority": "⭐ ⭐ ⭐"
    },
    "vlxd_hai_phong": {
        "head": "vật liệu xây dựng Hải Phòng",
        "long_tail": [
            "cửa hàng vật liệu xây dựng Hải Phòng",
            "địa chỉ mua vật liệu xây dựng Hải Phòng",
            "vật liệu xây dựng Đồ Sơn Hải Phòng",
            "vật liệu xây dựng uy tín Hải Phòng",
            "mua vật liệu xây dựng online Hải Phòng",
            "vật liệu hoàn thiện Hải Phòng",
            "vật liệu xây dựng Quận Đồ Sơn",
        ],
        "volume": "cao",
        "priority": "⭐ ⭐ ⭐"
    },
    "thi_công_sơn": {
        "head": "thi công sơn nhà Hải Phòng",
        "long_tail": [
            "thuê thợ sơn nhà Hải Phòng",
            "thi công sơn nội thất Hải Phòng",
            "dịch vụ sơn nhà trọn gói Hải Phòng",
            "thợ sơn chuyên nghiệp Hải Phòng",
            "báo giá thi công sơn nhà Hải Phòng",
            "sơn lại nhà cũ Hải Phòng",
            "thi công sơn ngoại thất Hải Phòng",
        ],
        "volume": "cao",
        "priority": "⭐ ⭐ ⭐"
    },
    "munich": {
        "head": "sơn Munich Hải Phòng",
        "long_tail": [
            "báo giá sơn Munich Hải Phòng",
            "đại lý Munich Hải Phòng",
            "Munich chính hãng Hải Phòng",
            "Mua sơn Munich ở đâu Hải Phòng",
            "bảng giá Munich mới nhất 2026",
            "Munich chống thấm giá bao nhiêu",
            "NPP Munich Hải Phòng",
        ],
        "volume": "trung bình",
        "priority": "⭐ ⭐ ⭐"
    },
    "nanohouse": {
        "head": "sơn Nano House Hải Phòng",
        "long_tail": [
            "báo giá sơn Nano House Hải Phòng",
            "Nano House chống thấm Hải Phòng",
            "sơn giả đá Nano House Hải Phòng",
            "đại lý Nano House Hải Phòng",
            "Nano House chính hãng Hải Phòng",
            "sơn Nano House giá bao nhiêu",
            "NPP Nano House Hải Phòng",
        ],
        "volume": "trung bình",
        "priority": "⭐ ⭐"
    },
    "thiết_bị_vệ_sinh": {
        "head": "thiết bị vệ sinh Hải Phòng",
        "long_tail": [
            "báo giá thiết bị vệ sinh Hải Phòng",
            "bồn cầu TOTO Hải Phòng",
            "bồn cầu INAX Hải Phòng",
            "bồn cầu CAESAR Hải Phòng",
            "bồn cầu COTTO Hải Phòng",
            "báo giá bồn cầu Hải Phòng",
            "mua thiết bị vệ sinh uy tín Hải Phòng",
        ],
        "volume": "trung bình",
        "priority": "⭐ ⭐"
    },
    "thiết_bị_điện": {
        "head": "thiết bị điện Hải Phòng",
        "long_tail": [
            "báo giá đèn LED Rạng Đông Hải Phòng",
            "bảng giá dây điện CADIVI Hải Phòng",
            "thiết bị điện Panasonic Hải Phòng",
            "aptomat LS Hải Phòng",
            "dây điện Trần Phú Hải Phòng",
            "báo giá thiết bị điện Hải Phòng",
        ],
        "volume": "trung bình",
        "priority": "⭐ ⭐"
    }
}

def analyze_coverage():
    """Analyze which keywords are covered by existing blog posts."""
    blog_dir = "/home/huu-minh/website-vlxd/blog"
    if not os.path.isdir(blog_dir):
        print("❌ Blog directory not found")
        return {}

    posts = [f for f in os.listdir(blog_dir) if f.endswith('.html') and f != 'index.html']
    
    coverage = {}
    for cluster, data in KEYWORD_CLUSTERS.items():
        covered_kw = []
        uncovered_kw = []
        for kw in data["long_tail"]:
            kw_slug = kw.lower().replace(" ", "-")[:30]
            matched = False
            for post in posts:
                if kw_slug in post.lower() or \
                   any(word in post.lower() for word in kw.lower().split()[:3]):
                    if kw.split()[-1].lower() in post.lower():
                        matched = True
                        break
            if matched:
                covered_kw.append(kw)
            else:
                uncovered_kw.append(kw)
        
        # Also check head keyword
        head_covered = any(data["head"].split()[0] in p.lower() for p in posts)
        
        coverage[cluster] = {
            "head": data["head"],
            "total": len(data["long_tail"]),
            "covered": len(covered_kw),
            "uncovered": len(uncovered_kw),
            "covered_kw": covered_kw,
            "uncovered_kw": uncovered_kw,
            "priority": data["priority"],
            "head_covered": head_covered
        }
    
    return coverage

def generate_daily_brief():
    """Generate today's keyword brief for the blog pipeline."""
    coverage = analyze_coverage()
    
    # Find clusters with most uncovered keywords
    missing = sorted(
        [c for c in coverage.values() if c["uncovered"] > 0],
        key=lambda x: x["uncovered"],
        reverse=True
    )
    
    if not missing:
        return None, None
    
    # Pick the cluster with highest priority and most missing
    target = missing[0]
    
    brief = f"""
=== KEYWORD BRIEF ===
Cluster: {target['head']}
Covered: {target['covered']}/{target['total']}
Uncovered keywords to target: {len(target['uncovered_kw'])}

Today's target keywords:
"""
    for i, kw in enumerate(target['uncovered_kw'][:3], 1):
        brief += f"  {i}. {kw}\n"
    
    brief += f"\nHead keyword: {target['head']}"
    
    return target['uncovered_kw'][:3], target['head']

def main():
    coverage = analyze_coverage()
    
    print("=" * 60)
    print("📊 KEYWORD COVERAGE ANALYSIS")
    print("=" * 60)
    
    total_kw = sum(c["total"] for c in coverage.values())
    total_covered = sum(c["covered"] for c in coverage.values())
    
    print(f"\n📝 Total long-tail keywords: {total_kw}")
    print(f"✅ Covered: {total_covered}")
    print(f"❌ Missing: {total_kw - total_covered}")
    print(f"📈 Coverage: {total_covered/total_kw*100:.0f}%\n")
    
    for cluster, data in sorted(coverage.items(), 
                                key=lambda x: x[1]["priority"], 
                                reverse=True):
        icon = "✅" if data["uncovered"] == 0 else "⚠️"
        print(f"{icon} {data['head']}")
        print(f"   {data['covered']}/{data['total']} keywords | Priority: {data['priority']}")
        if data["uncovered_kw"]:
            for kw in data["uncovered_kw"][:3]:
                print(f"   ➡️  {kw}")
        print()
    
    # Generate daily brief
    kws, head = generate_daily_brief()
    if kws:
        print("=" * 60)
        print("📋 HOM NAY VIET VE:")
        print("=" * 60)
        print(f"Từ khoá chính: {head}")
        for kw in kws[:3]:
            print(f"  → {kw}")
        
        # Save brief for pipeline
        matched = 'vlxd'
        head_lower = head.lower()
        cluster_map = {
            'munich': 'munich', 'nanohouse': 'nanohouse', 'nano': 'nanohouse',
            'kova': 'kova', 'sika': 'sika', 'jotun': 'jotun', 'dulux': 'dulux',
            'nippon': 'nippon', 'toto': 'vlxd', 'inax': 'vlxd', 'caesar': 'vlxd',
            'cotto': 'vlxd', 'cadivi': 'vlxd', 'panasonic': 'vlxd',
            'rang dong': 'vlxd',
        }
        for key, val in cluster_map.items():
            if key in head_lower:
                matched = val
                break
        brief_data = {
            "date": os.popen("date +%Y-%m-%d").read().strip(),
            "head_keyword": head,
            "target_keywords": kws[:3],
            "cluster": matched
        }
        with open("/tmp/seo-keyword-brief.json", "w") as f:
            json.dump(brief_data, f, ensure_ascii=False)
        print("\n💾 Saved to /tmp/seo-keyword-brief.json")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
