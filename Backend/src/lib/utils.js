import jwt from "jsonwebtoken"

export const generateToken = (userId,res) => {
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7d"
    })

    res.cookie("jwt",token,{
        httpOnly:true,
        secure:true,
        sameSite:"none",
        maxAge:24*7*60*60*1000
    })
    return token;
}
