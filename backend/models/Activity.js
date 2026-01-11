import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: true
    },
    day_of_week: {
        type: String, // 'Monday', 'Tuesday', etc.
        required: true
    },
    time_slot: {
        type: String, // '09:00', '14:30'
        required: true
    },
    duration: {
        type: Number, // in minutes
        required: true
    },
    completed: {
        type: Number, // 0 or 1 to match SQLite legacy, or could switch to Boolean. Keeping 0/1 for minimal frontend friction if it relies on numbers. Actually let's check frontend. Frontend checks `activity.completed ? ...`. Boolean is better for Mongo. Let's make it Boolean.
        // Wait, frontend expects `completed` to be truthy/falsy.
        // In SQLite it was 0/1. Handlers in frontend might send true/false.
        // The previous code had: `completed !== undefined ? (completed ? 1 : 0) : existing.completed`
        // Let's use Boolean in Mongo. When sending generic JSON, 1/0 works fine as truthy/falsy usually, but cleanest is Boolean.
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Add a virtual 'id' field that maps to _id
activitySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtuals are included in JSON
activitySchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;
