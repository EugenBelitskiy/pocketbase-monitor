/// <reference path="../pb_data/types.d.ts" />

// Настройка автобэкапов при старте (для PocketBase v0.35.0)
onAfterBootstrap((e) => {
    // Автоматический бэкап каждые 6 часов
    cronAdd("pb-backup", "0 */6 * * *", () => {
        try {
            const backupName = "backup-" + new Date().toISOString().replace(/[:.]/g, '-') + ".zip"
            
            // Создаём бэкап
            $app.createBackup(backupName)
            
            console.log("✅ Бэкап создан:", backupName)
            
            // Удаляем старые бэкапы (оставляем последние 7)
            const backups = $app.listBackups()
            if (backups.length > 7) {
                const oldBackups = backups.slice(7)
                for (let i = 0; i < oldBackups.length; i++) {
                    $app.deleteBackup(oldBackups[i].key)
                    console.log("🗑️ Удалён старый бэкап:", oldBackups[i].key)
                }
            }
            
        } catch (err) {
            console.error("❌ Ошибка бэкапа:", err)
        }
    })
    
    console.log("✅ Автобэкапы настроены (каждые 6 часов)")
})
