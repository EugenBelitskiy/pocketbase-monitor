/// <reference path="../pb_data/types.d.ts" />

// Cron задача для очистки auxiliary.db каждые 24 часа
cronAdd("cleanup_auxiliary", "0 1 * * *", () => {
    const fs = require('fs');
    const path = require('path');
    
    console.log("🧹 Запуск очистки auxiliary.db...");
    
    try {
        const auxiliaryPath = path.join(__hooks, "..", "pb_data", "auxiliary.db");
        const auxiliaryShm = auxiliaryPath + "-shm";
        const auxiliaryWal = auxiliaryPath + "-wal";
        
        let totalSizeBefore = 0;
        
        // Считаем размер ДО очистки
        if (fs.existsSync(auxiliaryPath)) {
            totalSizeBefore += fs.statSync(auxiliaryPath).size;
        }
        if (fs.existsSync(auxiliaryShm)) {
            totalSizeBefore += fs.statSync(auxiliaryShm).size;
        }
        if (fs.existsSync(auxiliaryWal)) {
            totalSizeBefore += fs.statSync(auxiliaryWal).size;
        }
        
        console.log(`📊 Размер auxiliary.db ДО очистки: ${(totalSizeBefore / 1024 / 1024).toFixed(2)} MB`);
        
        // Удаляем файлы (PocketBase создаст новые при необходимости)
        if (fs.existsSync(auxiliaryPath)) {
            fs.unlinkSync(auxiliaryPath);
            console.log("   ✅ auxiliary.db удалён");
        }
        
        if (fs.existsSync(auxiliaryShm)) {
            fs.unlinkSync(auxiliaryShm);
            console.log("   ✅ auxiliary.db-shm удалён");
        }
        
        if (fs.existsSync(auxiliaryWal)) {
            fs.unlinkSync(auxiliaryWal);
            console.log("   ✅ auxiliary.db-wal удалён");
        }
        
        console.log(`✅ Очистка завершена! Освобождено: ${(totalSizeBefore / 1024 / 1024).toFixed(2)} MB`);
        
    } catch (err) {
        console.error(`❌ Ошибка очистки auxiliary.db: ${err.message}`);
    }
});
