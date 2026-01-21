/// <reference path="../pb_data/types.d.ts" />

// Очистка auxiliary.db каждый день в 01:00 UTC
cronAdd("cleanup_auxiliary", "0 1 * * *", () => {
    console.log("🧹 Запуск очистки auxiliary.db...");
    
    try {
        // ПРАВИЛЬНЫЙ путь к pb_data (относительно корня приложения)
        const dataDir = "./pb_data";
        const auxiliaryPath = `${dataDir}/auxiliary.db`;
        const shmPath = `${dataDir}/auxiliary.db-shm`;
        const walPath = `${dataDir}/auxiliary.db-wal`;
        
        console.log(`🔍 Проверка директории: ${dataDir}`);
        
        let totalSize = 0;
        let deletedFiles = [];
        
        // Удаляем auxiliary.db
        try {
            const size = $os.getFileSize(auxiliaryPath);
            if (size > 0) {
                console.log(`📊 Найден auxiliary.db: ${(size / 1024 / 1024).toFixed(2)} MB`);
                totalSize += size;
                $os.remove(auxiliaryPath);
                deletedFiles.push("auxiliary.db");
                console.log(`   ✅ auxiliary.db удалён`);
            }
        } catch (e) {
            console.log(`   ℹ️ auxiliary.db не найден (${e.message})`);
        }
        
        // Удаляем auxiliary.db-shm
        try {
            const size = $os.getFileSize(shmPath);
            if (size > 0) {
                console.log(`📊 Найден auxiliary.db-shm: ${(size / 1024 / 1024).toFixed(2)} MB`);
                totalSize += size;
                $os.remove(shmPath);
                deletedFiles.push("auxiliary.db-shm");
                console.log(`   ✅ auxiliary.db-shm удалён`);
            }
        } catch (e) {
            console.log(`   ℹ️ auxiliary.db-shm не найден (${e.message})`);
        }
        
        // Удаляем auxiliary.db-wal
        try {
            const size = $os.getFileSize(walPath);
            if (size > 0) {
                console.log(`📊 Найден auxiliary.db-wal: ${(size / 1024 / 1024).toFixed(2)} MB`);
                totalSize += size;
                $os.remove(walPath);
                deletedFiles.push("auxiliary.db-wal");
                console.log(`   ✅ auxiliary.db-wal удалён`);
            }
        } catch (e) {
            console.log(`   ℹ️ auxiliary.db-wal не найден (${e.message})`);
        }
        
        if (deletedFiles.length > 0) {
            console.log(`✅ Очистка завершена! Удалено файлов: ${deletedFiles.length}, освобождено: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
        } else {
            console.log("⚠️ Нечего удалять - файлы не найдены по пути ./pb_data/");
        }
        
    } catch (err) {
        console.error(`❌ Критическая ошибка очистки: ${err.message}`);
    }
});
