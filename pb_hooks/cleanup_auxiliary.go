package main

import (
    "fmt"
    "log"
    "os"
    "path/filepath"

    "github.com/pocketbase/pocketbase/core"
)

func init() {
    // Очистка auxiliary.db каждый день в 09:00 UTC
    core.CronAdd("cleanup_auxiliary", "0 9 * * *", func() {
        log.Println("🧹 Запуск очистки через ГО auxiliary.db...")
        
        dataDir := "./pb_data"
        files := []string{
            filepath.Join(dataDir, "auxiliary.db"),
            filepath.Join(dataDir, "auxiliary.db-shm"),
            filepath.Join(dataDir, "auxiliary.db-wal"),
        }
        
        totalSize := int64(0)
        deletedCount := 0
        
        for _, file := range files {
            info, err := os.Stat(file)
            if err != nil {
                if !os.IsNotExist(err) {
                    log.Printf("   ℹ️ Не удалось получить информацию о %s: %v", filepath.Base(file), err)
                }
                continue
            }
            
            size := info.Size()
            totalSize += size
            
            err = os.Remove(file)
            if err != nil {
                log.Printf("   ❌ Ошибка удаления %s: %v", filepath.Base(file), err)
            } else {
                log.Printf("   ✅ %s удалён (%.2f MB)", filepath.Base(file), float64(size)/1024/1024)
                deletedCount++
            }
        }
        
        if deletedCount > 0 {
            log.Printf("✅ Очистка завершена! Удалено файлов: %d, освобождено: %.2f MB", 
                deletedCount, float64(totalSize)/1024/1024)
        } else {
            log.Println("ℹ️ Файлы auxiliary.db* не найдены или уже удалены")
        }
    })
}
