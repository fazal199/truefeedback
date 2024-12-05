import {z} from "zod"

export const verifySchema = z.object({
     code : z
     .string()
     .length(6,{message : "Verificationcode must be contain 6 digits!"})
})