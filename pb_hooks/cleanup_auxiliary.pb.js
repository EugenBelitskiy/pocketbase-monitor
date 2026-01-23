/// <reference path="../pb_data/types.d.ts" />

// Очистка auxiliary.db каждый день в 01:00 UTC и в 13:00 UTC
cronAdd("cleanup_auxiliary", "0 1,13 * * *", () => {
    console.log("[Cron] Начало процесса очистки auxiliary.db...");

    try {
        // 1. Удаляем записи старше 3 дней
        const threshold = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
            .toISOString()
            .replace("T", " ");

        $app.auxDB()
            .newQuery("DELETE FROM _logs WHERE created < {:threshold}")
            .bind({ "threshold": threshold })
            .execute();
        
        console.log("[Cron] Устаревшие логи удалены успешно.");

        // 2. Выполняем VACUUM для физического уменьшения размера файла
        console.log("[Cron] Выполнение VACUUM для сжатия файла...");
        $app.auxDB().newQuery("VACUUM").execute();
        
        console.log("[Cron] Очистка auxiliary.db успешно завершена.");

    } catch (err) {
        console.error("[Cron] Ошибка при очистке auxiliary.db:", err.message);
    }
});

console.log("✅ Автоочистка auxiliary.db загружена");
console.log("🧹 Запуск: каждый день в 1:00 и в 13:00 UTC");
console.log("🗑️ Удаление логов старше 3 дней + VACUUM");
