# 狗狗品種辨識 PWA

這是一個使用 React 和 TensorFlow.js 開發的漸進式網頁應用程式（PWA），可以辨識狗狗的品種。

## 功能特點

- 使用 MobileNet 模型進行狗狗品種辨識
- 支援圖片上傳和即時預測
- 顯示預測結果和可能性百分比
- 提供中英文對照的狗狗品種名稱
- 具有 PWA 功能，可安裝到設備上離線使用

## 技術棧

- React 18
- TypeScript
- Vite
- TensorFlow.js
- MobileNet 模型
- Tailwind CSS
- Lucide React（圖標）

## 開始使用

1. clone repository:

   ```
   git clone https://github.com/ketyykes/dog-recognition-pwa-react.git
   ```

2. 安裝依賴：

   ```
   pnpm install
   ```

3. 啟動開發伺服器：

   ```
   pnpm run dev
   ```

4. 在瀏覽器中打開 `http://localhost:2666` 查看應用程式

## 建置專案

運行以下命令來建置專案：

```
pnpm run build
```

建置完成後，會在 `dist` 目錄下生成靜態文件，可以部署到任何靜態文件伺服器上。

## 部署

將 `dist` 目錄下的文件部署到你的靜態文件伺服器上即可。

