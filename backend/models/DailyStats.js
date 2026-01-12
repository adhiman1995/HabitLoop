import mongoose from 'mongoose';

const dailyStatsSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String, // YYYY-MM-DD
        required: true,
        index: true
    },
    count: {
        type: Number,
        default: 0
    }
});

// Compound index to ensure unique date per user
dailyStatsSchema.index({ user_id: 1, date: 1 }, { unique: true });

const DailyStats = mongoose.model('DailyStats', dailyStatsSchema);
export default DailyStats;
