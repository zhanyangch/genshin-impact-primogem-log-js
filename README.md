#原神原石紀錄導出
1. 程式參考 [hjmmc](https://github.com/hjmmc/genshin-gacha-export-js)
2. 本工具本地運行
3. 目前僅在繁中環境 & 亞洲服測試

# 一、新增書籤

1. 書籤標題: 原神原石紀錄導出  
2. 書籤內容:
```
javascript:(function(){const s=document.createElement("script");s.src='https://cdn.jsdelivr.net/gh/zhanyangch/genshin-impact-primogem-log-js@V0.2/index.js';document.body.append(s)})();
```

## 二、使用方法

1. 新增瀏覽器書籤
2. 遊戲內打開 派蒙選單 -> 意見回饋
3. 在當前頁面打開書籤 會自動下載excel檔案
4. [原神原石紀錄統計表](https://docs.google.com/spreadsheets/d/1_tWDs17TUOcH6WYOQVjgPduM0Lzc7EzAS36yNL_dmBo/edit?usp=sharing) 檔案->建立副本->將前三行修改為剛下載的excel內容
5. 修改起始日期、結束日期
6. 看看你拿到了多少原石