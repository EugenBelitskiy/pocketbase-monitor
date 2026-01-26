/// <reference path="../pb_data/types.d.ts" />

// Очистка auxiliary.db каждый день в 01:00 UTC и в 13:00 UTC
cronAdd("cleanup_auxiliary", "0 1,13 * * *", () => {
    // Путь к файлу по умолчанию: ./pb_data/auxiliary.db
    // Если вы используете кастомную директорию через --dir, путь может отличаться
    const dbPath = `${$app.dataDir()}/auxiliary.db`;

    console.log("[Cron] Начало процесса очистки auxiliary.db...");

    try {
        // 1. Получаем размер файла ДО очистки
        let sizeBefore = 0;
        try {
            sizeBefore = $os.stat(dbPath).size();
        } catch (e) {
            console.warn("[Cron] Не удалось определить начальный размер файла:", e.message);
        }

        // 2. Удаляем записи старше 7 дней
        const threshold = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .replace("T", " ");

        $app.auxDB()
            .newQuery("DELETE FROM _logs WHERE created < {:threshold}")
            .bind({ "threshold": threshold })
            .execute();
        
        console.log("[Cron] Устаревшие логи удалены.");

        // 3. Выполняем VACUUM для сжатия файла
        console.log("[Cron] Выполнение VACUUM...");
        $app.auxDB().newQuery("VACUUM").execute();

        // 4. Получаем размер файла ПОСЛЕ очистки
        let sizeAfter = 0;
        try {
            sizeAfter = $os.stat(dbPath).size();
        } catch (e) {
            console.warn("[Cron] Не удалось определить итоговый размер файла.");
        }

        // 5. Вывод статистики
        const beforeMB = (sizeBefore / 1024 / 1024).toFixed(2);
        const afterMB = (sizeAfter / 1024 / 1024).toFixed(2);
        const freedMB = ((sizeBefore - sizeAfter) / 1024 / 1024).toFixed(2);

        console.log(`[Cron] Очистка завершена успешно!`);
        console.log(`[Cron] Размер ДО: ${beforeMB} MB`);
        console.log(`[Cron] Размер ПОСЛЕ: ${afterMB} MB`);
        console.log(`[Cron] Освобождено: ${freedMB} MB`);

    } catch (err) {
        console.error("[Cron] Критическая ошибка при работе с auxiliary.db:", err.message);
    }
});

console.log("✅ Автоочистка auxiliary.db загружена");
console.log("🧹 Запуск: каждый день в 1:00 и в 13:00 UTC");
console.log("🗑️ Удаление логов старше 3 дней + VACUUM");
