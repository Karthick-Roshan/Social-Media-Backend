import db from "../connect.js"
import jwt from "jsonwebtoken"

export const getlikes = (req, res) => {
    const q = "SELECT userid FROM likes WHERE postid = ?";

    db.query(q, [req.query.postid], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data.map(like => like.userid))
    });
}

export const addlike = (req, res) => {

    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not Logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if(err) return res.status(403).json("Token not Valid!")

        const q = "INSERT INTO likes (`userid`, `postid`) VALUES (?)";

        const values = [
            userInfo.id,
            req.body.postid
        ]

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("post has been liked.")
        });
    });
}

export const deletelike = (req, res) => {

    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not Logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if(err) return res.status(403).json("Token not Valid!")

        const q = "DELETE FROM likes WHERE `userid` = ? AND `postid` = ?";

        db.query(q, [userInfo.id, req.query.postid], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("like removed.")
        });
    });
}