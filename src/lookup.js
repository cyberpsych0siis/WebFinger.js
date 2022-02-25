import { getDomain } from "./finger.js";

const useStrictDomainChecking = function() {
    return Boolean(process.env.STRICT_DOMAIN_CHECKING ?? "true") == true;
}

export const lookupIdentifier = function (identifier) {
    const { protocol, href, auth, hostname } = identifier;
    if (protocol === "acct:" && (useStrictDomainChecking() || hostname === getDomain())) {
        //search for auth in database
        const userdata = searchForUserdata(auth);

        if (userdata) {
            Object.assign(userdata, {subject: href});
            return userdata;
        }
    }

    return null;
}

function searchForUserdata(name) {
    if (name === "example") {
        return {
            subject: null,
            aliases: [
                "http://localhost"
            ],
            links: [
                {
                    "rel": "http://webfinger.net/rel/profile-page",
                    "type": "text/html",
                    "href": "http://localhost"
                }
            ]
        }
    }
    
    return null;
}