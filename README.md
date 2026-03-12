<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Studio React 應用專案

這是一份整合了 Vite 與 React 的前端專案，可協助您在本地端順利開發與部署您的應用程式。

## 🚀 執行專案 (Run Locally)

**環境需求:**  Node.js (建議 v18 或 v20 以上版本)

1. **安裝依賴套件**:
   ```bash
   npm install
   ```

2. **設定環境變數**:
   請複製 `.env.example` 為 `.env`，並將您的 API Key 等資訊填寫進去：
   ```bash
   cp .env.example .env
   ```
   > 🔴 *備註：請確保您擁有一組可用的 Gemini API key 並設定至 `GEMINI_API_KEY`*

3. **啟動開發伺服器**:
   ```bash
   npm run dev
   ```
   伺服器將會啟動在開發者模式，預設可於 `http://localhost:3000` 預覽效果。

## 📦 建置與部署 (Build & Deploy)

### GitHub Pages 自動部署

我們已配置 GitHub Actions 腳本：`.github/workflows/deploy.yml`。

1. 請至您的 GitHub Repository 的 **Settings** -> **Pages**
2. 將 Source 更改為 **GitHub Actions**
3. 只要將程式碼推上 `main` 分支，GitHub 就會自動執行建置流程 (`npm ci` & `npm run build`)，並將 `dist` 資料夾部署上線。

### 手動建置

如果您需要手動建置靜態檔案：
```bash
npm run build
```
建置結果會輸出在 `dist` 資料夾內，您可以將其部署至包括 Vercel、Netlify 或任何靜態託管平台。

---

*檢視您的應用於 AI Studio: https://ai.studio/apps/de78adf2-bd09-48a9-b168-39272b2d827f*
