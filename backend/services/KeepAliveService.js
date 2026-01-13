import axios from 'axios';

const KeepAliveService = {
    start: () => {
        // Ping every 14 minutes (14 * 60 * 1000) to stay within 15-30min limits
        const INTERVAL_MS = 14 * 60 * 1000;

        console.log('🔄 Keep-Alive Service started. Pinging every 14 minutes.');

        setInterval(async () => {
            try {
                // 1. Ping Backend
                const baseUrl = process.env.PUBLIC_URL || `http://localhost:${process.env.PORT || 3001}`;
                const healthUrl = `${baseUrl}/api/health`;

                console.log(`📡 Pinging Backend at ${healthUrl} to keep active...`);

                try {
                    const response = await axios.get(healthUrl);
                    if (response.status === 200) {
                        console.log('✅ Backend Ping successful:', response.data.message);
                    } else {
                        console.warn(`⚠️ Backend Ping returned status: ${response.status}`);
                    }
                } catch (error) {
                    console.error('❌ Backend Ping failed:', error.message);
                }

                // 2. Ping Frontend (if configured)
                const frontendUrl = process.env.FRONTEND_URL;
                if (frontendUrl) {
                    console.log(`📡 Pinging Frontend at ${frontendUrl} to keep active...`);
                    try {
                        const response = await axios.get(frontendUrl);
                        if (response.status >= 200 && response.status < 300) {
                            console.log('✅ Frontend Ping successful');
                        } else {
                            console.warn(`⚠️ Frontend Ping returned status: ${response.status}`);
                        }
                    } catch (error) {
                        console.error('❌ Frontend Ping failed:', error.message);
                    }
                } else {
                    console.log('ℹ️ No FRONTEND_URL configured, skipping frontend ping.');
                }
            } catch (error) {
                console.error('❌ Keep-Alive Service Error:', error.message);
            }
        }, INTERVAL_MS);
    }
};

export default KeepAliveService;
