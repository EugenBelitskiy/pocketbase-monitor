/// <reference path="../pb_data/types.d.ts" />

// Очистка auxiliary.db каждый день в 09:00 UTC
cronAdd("cleanup_auxiliary", "0 9 * * *", () => {
    console.log("🧹 Запуск очистки auxiliary.db...");
    
    try {
        // Пробуем выполнить команду напрямую
        const cmd = "cd pb_data && ls -lh auxiliary.db* 2>/dev/null && du -sh auxiliary.db* 2>/dev/null && rm -fv auxiliary.db auxiliary.db-shm auxiliary.db-wal";
        
        const output = $os.exec("bash", "-c", cmd);
        
        if (output && output.length > 0) {
            console.log("📊 Результат выполнения:");
            console.log(output);
            console.log("✅ Очистка завершена!");
        } else {
            console.log("ℹ️ Файлы не найдены или команда не вернула вывод");
        }
        
    } catch (err) {
        console.error(`❌ Ошибка выполнения: ${err}`);
        
        // Запасной вариант - пробуем через отдельные команды
        try {
            console.log("🔄 Пробуем альтернативный способ...");
            $os.exec("rm", "-f", "pb_data/auxiliary.db");
            $os.exec("rm", "-f", "pb_data/auxiliary.db-shm");
            $os.exec("rm", "-f", "pb_data/auxiliary.db-wal");
            console.log("✅ Файлы удалены через прямой вызов rm");
        } catch (err2) {
            console.error(`❌ И запасной вариант не сработал: ${err2}`);
        }
    }
});
