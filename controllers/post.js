import moment from 'moment/moment.js';
import { db } from '../connect.js'
import { jwt } from 'jsonwebtoken';

export const getPosts = (req, res) => {

    const userid = req.query.userid;

    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not Logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if(err) return res.status(403).json("Token not Valid!")

        const q = userid 
        ? `SELECT p.*, u.id AS userid, name, profilePic FROM posts AS p JOIN users AS u ON 
        (u.id = p.userId) WHERE p.userid = ?`
        : `SELECT p.*, u.id AS userid, name, profilePic FROM posts AS p JOIN users AS u ON 
        (u.id = p.userId) LEFT JOIN relationships AS r ON 
        (p.userid = r.followedUserid) WHERE r.followerUserid = ? OR P.userid = ?
        ORDER BY p.createdAt DESC`;

        const values = userid ? [userid] : [userInfo.id, userInfo.id]

        db.query(q, values, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data)
        });
    });
}

export const addPost = (req, res) => {

    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not Logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if(err) return res.status(403).json("Token not Valid!")

        const q = "INSERT INTO posts (`desc`, `img`, `createdAt`, `userid`) VALUES (?)";

        const values = [
            req.body.desc,
            req.body.img,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id
        ]

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Post has been created")
        });
    });
}

export const deletePost = (req, res) => {

    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not Logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if(err) return res.status(403).json("Token not Valid!")

        const q = "DELETE FROM posts WHERE `id` = ? AND `userid` = ?";

        db.query(q, [req.query.id, userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err);
            if(data.affectedRows > 0) return res.status(200).json("Post has been deleted")
            return res.status(403).json("You can delete only your post.")
        });
    });
}