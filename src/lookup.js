import { getDomain } from "./finger.js";
import dotenv from 'dotenv';
import SqlSingleton from './sql.js';
dotenv.config();


const useStrictDomainChecking = function() {
    return Boolean(process.env.STRICT_DOMAIN_CHECKING ?? "true") == true;
}

export const lookupIdentifier = async function (identifier) {
    const { protocol, href, auth, hostname } = identifier;
    if (protocol === "acct:" && (useStrictDomainChecking() || hostname === getDomain())) {
        //search for auth in database
        const userdata = await searchForUserdata(auth);
        console.log(userdata);

        if (userdata) {
            Object.assign(userdata, {subject: href});
            return userdata;
        }
    }

    return null;
}

export function createDataEntry(subjectName) {
    let ownAddress = process.env.JWT_AUDENIENCES ?? "http://localhost";
    
    return {
        subject: null,
        aliases: [
            ownAddress
        ],
        links: [
            {
                //rel="publickey" type="text/plain" title="Public Key" href="http://rasterweb.net/raster/pgpkey.txt"
                "rel": "http://webfinger.net/rel/profile-page",
                "type": "text/html",
                "href": "http://localhost"
            },
            {
                "rel": "publickey",
                "type": "text/plain",
                "href": ownAddress + "/.well-known/keys?resource=acct" + subjectName + "@" + ownAddress
            }
        ]
    }
}

async function searchForUserdata(name) {

    //needed for keys
    //sql.query("SELECT `publicKey` FROM `userKeys` WHERE username = ?",

    return await SqlSingleton.query("SELECT `username` FROM `userKeys` WHERE username = ?", [name].map(s => { return createDataEntry(s) }));
}