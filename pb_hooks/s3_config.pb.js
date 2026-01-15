/// <reference path="../pb_data/types.d.ts" />

onAfterBootstrap((e) => {
    const s3Bucket = $os.getenv('S3_BUCKET')
    const s3Region = $os.getenv('S3_REGION')
    const s3Endpoint = $os.getenv('S3_ENDPOINT')
    const s3AccessKey = $os.getenv('S3_ACCESS_KEY')
    const s3Secret = $os.getenv('S3_SECRET_KEY')
    
    console.log("🔧 S3 Config:")
    console.log(`   Bucket: ${s3Bucket}`)
    console.log(`   Region: ${s3Region}`)
    console.log(`   Endpoint: ${s3Endpoint}`)
    console.log(`   Access Key: ${s3AccessKey ? s3AccessKey.substring(0, 8) + '...' : 'NOT SET'}`)
    console.log(`   Secret: ${s3Secret ? '***' : 'NOT SET'}`)
    
    if (!s3Bucket || !s3Region || !s3Endpoint || !s3AccessKey || !s3Secret) {
        console.error("❌ Не все S3 переменные установлены!")
        return
    }
    
    try {
        const settings = $app.settings()
        
        // Настройка S3 для файлов
        settings.s3.enabled = true
        settings.s3.bucket = s3Bucket
        settings.s3.region = s3Region
        settings.s3.endpoint = s3Endpoint
        settings.s3.accessKey = s3AccessKey
        settings.s3.secret = s3Secret
        settings.s3.forcePathStyle = true
        
        $app.dao().saveSettings(settings)
        
        console.log("✅ S3 настройки применены успешно")
    } catch (err) {
        console.error(`❌ Ошибка применения S3 настроек: ${err}`)
    }
})
