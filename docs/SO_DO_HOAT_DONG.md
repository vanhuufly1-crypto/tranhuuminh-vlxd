# 🗺️ Sơ đồ hoạt động Website VLHT Trần Hữu Minh

```mermaid
flowchart TD
    %% KHÁCH HÀNG
    KH("[👤 Khách hàng]") -->|Truy cập| WEB
    
    %% GIAO DIỆN
    subgraph WEB["🌐 Website (GitHub Pages)"]
        HEADER["📌 Header / Menu"]
        HOME["🏠 Trang chủ"]
        PRODUCTS["📦 Sản phẩm<br/>(7 thương hiệu)"]
        PRICE["💰 Bảng giá<br/>(Munich, NanoHouse...)"]
        QUOTE["📋 Báo giá<br/>(Form + link)"]
        PROCESS["🔧 Quy trình thi công"]
        GALLERY["🖼️ Gallery ảnh"]
        NEWS["📰 Tin tức / Dự án"]
        FOOTER["📍 Liên hệ / Bản đồ"]
    end

    %% DỮ LIỆU
    subgraph DATA["📁 Dữ liệu (Local files)"]
        JS_PROD["js/products.js<br/>(SP + Giá)"]
        JS_APP["js/app.js<br/>(Render + Search)"]
        JS_CHAT["js/chat.js<br/>(Chat widget Mây)"]
        CSS["css/style.css<br/>(Giao diện)"]
        IMG["images/*.webp<br/>(Ảnh sản phẩm)"]
    end

    %% SERVER
    subgraph SERVER["🖥️ Server (Local - Ollama)"]
        LLAMA["llava:7b<br/>(AI Model)"]
        FASTAPI["FastAPI Server<br/>port 5000"]
    end

    %% KẾT NỐI
    HEADER --> HOME
    HEADER --> PRODUCTS
    HEADER --> PROCESS
    HEADER --> QUOTE
    
    PRODUCTS -->|"Click brand"| JS_APP
    JS_APP -->|"Render"| GALLERY
    JS_APP -->|"Hiển thị giá"| PRICE
    
    QUOTE -->|"Gửi yêu cầu"| KH
    QUOTE -->|"Gọi/Zalo"| HOTLINE["📞 0378.679.633<br/>(Anh Hữu)"]

    WEB -.->|"Chat (if server on)"| FASTAPI
    FASTAPI <--> LLAMA
    JS_CHAT -.->|"fetch /chat"| FASTAPI

    %% DEPLOY
    DEV["💻 Chỉnh sửa file"] -->|"git add + commit + push"| GITHUB["🐙 GitHub"]
    GITHUB -->|"Auto deploy"| WEB

    style KH fill:#e1f7e7,stroke:#27ae60
    style WEB fill:#d5f4e6,stroke:#0fb9b1
    style SERVER fill:#ffeaa7,stroke:#f39c12
    style HOTLINE fill:#ffebee,stroke:#e74c3c
```

## Mô tả luồng hoạt động:

### 📌 Luồng chính (Website)
1. **Khách hàng** truy cập → Web hiện trang chủ
2. **Click menu** → Chuyển section tương ứng
3. **Click thương hiệu** → Render danh sách sản phẩm
4. **Search** → Tìm kiếm sản phẩm
5. **Báo giá** → Gửi yêu cầu / Gọi hotline

### 🛠️ Luồng cập nhật
1. Anh Hữu sửa file (products.js, index.html...)
2. `git add .` → `git commit` → `git push`
3. GitHub Auto-deploy → Web cập nhật sau 1-2 phút

### 🤖 Luồng Chat bot Mây (khi server bật)
1. Khách chat trên web → fetch API
2. Server (local) → Ollama llava:7b → Trả lời
3. Hiển thị câu trả lời lên widget

---

*Cập nhật: 03/05/2026*
