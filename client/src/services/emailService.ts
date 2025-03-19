import { templateId } from "../lib/utils";
import * as emailjs from "@emailjs/browser";

const serviceAPI: any = process.env.REACT_APP_API_EMAIL_SERVICE;
const publicKey: any = process.env.REACT_APP_API_PK_EMAIL;
emailjs.init(publicKey);
class emailService {
    static async send(templateId: templateId, options: any) {
        try {
            await emailjs.send(serviceAPI, templateId, options);
        }
        catch (error) {
            console.error(error);
        }
    }
}

export default emailService;