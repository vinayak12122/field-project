import jwt from 'jsonwebtoken';

export const authenticateAccessToken = (req,res,next)=>{
    const auth = req.headers["authorization"];
    if(!auth) return res.status(401).json({error:"Missing Auth Header"});

    const [type,token] = auth.split(" ");
    if (type !== "Bearer" || !token) return res.status(401).json({ error: "Malformed auth header" });

    try{
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = {
            userId: payload.userId || payload._id || payload.id, 
            ...payload
        };
        next();
    }catch(err){
        return res.status(401).json({ error: "Invalid/expired token" });
    }
}
