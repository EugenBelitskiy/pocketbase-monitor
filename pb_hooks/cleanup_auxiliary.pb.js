/// <reference path="../pb_data/types.d.ts" />

// Очистка auxiliary.db каждый день в 09:00 UTC
cronAdd("cleanup_auxiliary", "0 9 * * *", () => {
    console.log("🧹 Запуск очистки auxiliary.db...");
    
    try {
        const auxiliaryPath = `${__hooks}/../pb_data/auxiliary.db`;
        const shmPath = `${auxiliaryPath}-shm`;
        const walPath = `${auxiliaryPath}-wal`;
        
        let totalSize = 0;
        let deletedFiles = [];
        
        // Удаляем auxiliary.db
        try {
            const size = $os.getFileSize(auxiliaryPath);
            if (size > 0) {
                totalSize += size;
                $os.remove(auxiliaryPath);
                deletedFiles.push("auxiliary.db");
                console.log(`   ✅ auxiliary.db удалён (${(size / 1024 / 1024).toFixed(2)} MB)`);
            }
        } catch (e) {
            console.log("   ℹ️ auxiliary.db не найден или уже удалён");
        }
        
        // Удаляем auxiliary.db-shm
        try {
            const size = $os.getFileSize(shmPath);
            if (size > 0) {
                totalSize += size;
                $os.remove(shmPath);
                deletedFiles.push("auxiliary.db-shm");
                console.log(`   ✅ auxiliary.db-shm удалён (${(size / 1024 / 1024).toFixed(2)} MB)`);
            }
        } catch (e) {
            console.log("   ℹ️ auxiliary.db-shm не найден");
        }
        
        // Удаляем auxiliary.db-wal
        try {
            const size = $os.getFileSize(walPath);
            if (size > 0) {
                totalSize += size;
                $os.remove(walPath);
                deletedFiles.push("auxiliary.db-wal");
                console.log(`   ✅ auxiliary.db-wal удалён (${(size / 1024 / 1024).toFixed(2)} MB)`);
            }
        } catch (e) {
            console.log("   ℹ️ auxiliary.db-wal не найден");
        }
        
        if (deletedFiles.length > 0) {
            console.log(`✅ Очистка завершена! Удалено файлов: ${deletedFiles.length}, освобождено: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
        } else {
            console.log("ℹ️ Нечего удалять - файлы уже отсутствуют");
        }
        
    } catch (err) {
        console.error(`❌ Критическая ошибка очистки: ${err.message}`);
    }
});
