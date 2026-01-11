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
        type: Boolean,
        default: false
    },
    is_recurring: {
        type: Boolean,
        default: false
    },
    specific_date: {
        type: Date,
        default: null
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
