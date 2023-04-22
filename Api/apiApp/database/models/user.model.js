const mongoose =require("mongoose")
const validator =require("validator")
const bcrypt =require("bcrypt")
const jwt =require("jsonwebtoken")
const user = require("../../app/controller/user.controller")
const userSchema=mongoose.Schema(
    {
    title:{
        type:String,
        trim:true,
        require:true,
        lowercase:true,
        minLength:5,
        maxLength:20
    },
    des:{
        type: String,
        trim:true,
        require:true,
        lowercase:true,
        minLength:5,
        maxLength:20
    },
    age:{
        type:String,
        require:true,
        min:16,
        max:80
    },
    email:{
        type:String,
        trim:true,
        require:true,
        lowercase:true,
       unique:true,
       validate(value){
if(!validator.isEmail(value))
throw new Error("invalid email format")
       },
    },
    password:{
        type:String,
        trim:true,
        require:true,
        // lowercase:true,
        // match:/^[A-Za-z]{1,4}[0-9]{0,12}$/

    },
    status:{
        type:Boolean,
      default:false  
    },
    image:{
        type:String
    },
    gender:{
        type:String,
        trim:true,
        lowercase:true,
       enum:["mail","femail"]
    },
    dOfBirth:{
        type:Date
    },
    phone:{
        type:String,
        trim:true,
        addresses:[
            {
                addrName:{
                    type:String,
                    trim:true,
                    require:true,
                    lowercase:true,
                },
                addrDetails:{
                    type:String,
                    trim:true,
                    require:true,
                    lowercase:true,
                }
            }
        ],
       
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }

    ]
    

},{
    timestamps:true
}

)
userSchema.pre("save",async function(){
    // console.log("pre save");
    // console.log(this);
    if(this.isModified("password"))
    this.password= await bcrypt.hash(this.password,12)

})


userSchema.statics.loginMe=async function(email,password){
    const userData =await userModel.findOne({email:email})
    if(!userData) throw new Error ("invalid email")
    const matched =await bcrypt.compare(password,userData.password)
    if(!matched) throw new Error ("invalid password")
    return userData
}

userSchema.methods.generateToken=async function(){
    const token=jwt.sign({_id:this._id},process.env.JWTKEY)
    // this.tokens.push({token})
    this.tokens =this.tokens.concat({token})
    await this.save()
    return token
}
const userModel =mongoose.model("User" ,userSchema)
module.exports=userModel