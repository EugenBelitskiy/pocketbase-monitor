/// <reference path="../pb_data/types.d.ts" />

// Очистка auxiliary.db каждый день в 01:00 UTC
cronAdd("cleanup_auxiliary", "0 1 * * *", () => {
    console.log("🧹 Запуск очистки auxiliary.db...");
    
    let deletedCount = 0;
    
    // Пробуем удалить каждый файл отдельно
    const files = [
        "pb_data/auxiliary.db",
        "pb_data/auxiliary.db-shm", 
        "pb_data/auxiliary.db-wal"
    ];
    
    for (const file of files) {
        try {
            $os.exec("rm", "-f", file);
            console.log(`   ✅ Удалён: ${file}`);
            deletedCount++;
        } catch (err) {
            console.log(`   ℹ️ Не удалось удалить ${file}: ${err}`);
        }
    }
    
    if (deletedCount > 0) {
        console.log(`✅ Очистка завершена! Удалено файлов: ${deletedCount}`);
    } else {
        console.log("ℹ️ Файлы не найдены или не удалось удалить");
    }
});
