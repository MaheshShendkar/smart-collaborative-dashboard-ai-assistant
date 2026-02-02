import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema=new mongoose.Schema({
     name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    role: {
      type: String,
      enum: ["admin", "manager", "user"],
      default: "user", // 👈 default role
    },
    active:{type:Boolean,default:true},
    //we'll store (rotated) refresh tokens here - keepas array to support multiple devices 
    refreshTokens:[String]
},
{timestamps:true}
);

// hash password
userSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next();
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
    next();
});
userSchema.methods.matchPassword=async function (entered){
    return bcrypt.compare(entered,this.password);

};

export default mongoose.model("User",userSchema);