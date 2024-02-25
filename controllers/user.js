import { db } from "../connect.js";
import { jwt } from "jsonwebtoken";


export const getUser = (req, res) => {
    const userid = req.query.userid;
    const q = "SELECT * FROM users WHERE id = ?"

    db.query(q, [userid], (err, data) => {
        if ( err ) return res.status(500).json(err)
        const {password, ...info} = data[0];
        return res.json(info)
    })
}