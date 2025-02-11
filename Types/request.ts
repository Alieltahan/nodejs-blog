import { Request } from "express";
import { AuthenticatePayload, BlogPayload, SignUpPayload, UserObject } from "./payload";

export type authenticatePayloadType = Request & AuthenticatePayload;

export type signUpPayloadType = Request & SignUpPayload;

export type blogPayloadType = Request & BlogPayload;
export type userObjectPayload = Request & UserObject;
