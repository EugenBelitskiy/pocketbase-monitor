/// <reference path="../pb_data/types.d.ts" />

// Очистка auxiliary.db каждый день в 09:00 UTC
cronAdd("cleanup_auxiliary", "0 9 * * *", () => {
    console.log("🧹 Запуск очистки auxiliary.db...");
    
    try {
        const result = $os.exec("sh", "-c", `
            cd pb_data || exit 1
            
            if ls auxiliary.db* >/dev/null 2>&1; then
                echo "📊 Найденные файлы:"
                ls -lh auxiliary.db* 2>/dev/null
                
                # Считаем размер в байтах
                SIZE=$(du -b auxiliary.db auxiliary.db-shm auxiliary.db-wal 2>/dev/null | awk '{sum+=$1} END {print sum}')
                
                if [ "$SIZE" -gt 0 ]; then
                    # Конвертируем в MB через awk
                    SIZE_MB=$(echo "$SIZE" | awk '{printf "%.2f", $1/1024/1024}')
                    echo "📊 Размер ДО очистки: \${SIZE_MB} MB"
                    
                    rm -f auxiliary.db auxiliary.db-shm auxiliary.db-wal
                    echo "✅ Файлы удалены. Освобождено: \${SIZE_MB} MB"
                else
                    echo "ℹ️ Файлы пусты"
                fi
            else
                echo "ℹ️ Файлы auxiliary.db* не найдены"
            fi
        `);
        
        console.log(result);
        console.log("✅ Очистка завершена!");
        
    } catch (err) {
        console.error(`❌ Ошибка: ${err}`);
    }
});
