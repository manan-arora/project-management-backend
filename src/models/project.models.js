import mongoose, { Schema } from "mongoose";


const projectSchema = new Schema( 
{
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        // Reference to the user who created this record.
        required: true
    }
}, 
{
    timestamps: true
})

export const Project = mongoose.model("Project", projectSchema);