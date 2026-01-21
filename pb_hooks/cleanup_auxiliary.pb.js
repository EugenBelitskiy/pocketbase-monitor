/// <reference path="../pb_data/types.d.ts" />

// Очистка auxiliary.db каждый день в 01:00 UTC
cronAdd("cleanup_auxiliary", "0 1 * * *", () => {
    console.log("🧹 Запуск очистки auxiliary.db...");
    
    try {
        // Проверяем наличие файлов
        let checkResult;
        try {
            checkResult = $os.exec("ls", "-lh", "pb_data/auxiliary.db", "pb_data/auxiliary.db-shm", "pb_data/auxiliary.db-wal");
            console.log("📊 Найденные файлы:");
            console.log(checkResult);
        } catch (e) {
            console.log("ℹ️ Некоторые или все файлы auxiliary.db* отсутствуют");
        }
        
        // Считаем размер ДО удаления (в байтах)
        let sizeBefore = 0;
        try {
            const sizeCmd = $os.exec("sh", "-c", 
                "du -b pb_data/auxiliary.db pb_data/auxiliary.db-shm pb_data/auxiliary.db-wal 2>/dev/null | awk '{sum+=$1} END {print sum}'"
            );
            sizeBefore = parseInt(sizeCmd.trim()) || 0;
        } catch (e) {
            // Игнорируем ошибку, если файлы не найдены
        }
        
        if (sizeBefore > 0) {
            console.log(`📊 Размер ДО очистки: ${(sizeBefore / 1024 / 1024).toFixed(2)} MB`);
            
            // Удаляем файлы
            try {
                $os.exec("rm", "-f", "pb_data/auxiliary.db", "pb_data/auxiliary.db-shm", "pb_data/auxiliary.db-wal");
                console.log("   ✅ Файлы auxiliary.db* удалены");
            } catch (e) {
                console.error(`   ❌ Ошибка удаления: ${e.message}`);
            }
            
            console.log(`✅ Очистка завершена! Освобождено: ${(sizeBefore / 1024 / 1024).toFixed(2)} MB`);
        } else {
            console.log("ℹ️ Файлы auxiliary.db* не найдены или уже пусты");
        }
        
    } catch (err) {
        console.error(`❌ Критическая ошибка: ${err.message}`);
    }
});
