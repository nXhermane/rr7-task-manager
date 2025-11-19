import { createCookieSessionStorage } from "react-router";

const session = createCookieSessionStorage({
    cookie: { isSigned: true, sameSite: "lax", httpOnly: true, secure: true, secrets: ['my-secret'] }
})

export const { getSession, commitSession, destroySession } = session;
