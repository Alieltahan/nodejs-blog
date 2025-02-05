import { Request } from "express";
import { AuthenticatePayload, SignUpPayload } from "./payload";

export type authenticatePayloadType = Request & AuthenticatePayload;

export type SignUpPayloadType = Request & SignUpPayload
