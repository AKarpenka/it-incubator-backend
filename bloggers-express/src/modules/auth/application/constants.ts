import { SETTINGS } from "../../../core/settings/settings";

// тут хардкод, который на фронт отправляет рандомную ссылку с кодом подтверждения
// и затем фронт еще один пост запрос делает для вызова логики подтверждения 
export const REGISTRATION_SUBJECT = 'Registration confirm';
export const getRegistrationMessage = (confirmationCode: string) => `
    <h1>Thank for your registration</h1>
    <p>To finish registration please follow the link below:
        <a href="${SETTINGS.PATH.BASE_URL}${SETTINGS.PATH.AUTH}/registration-confirmation?code=${confirmationCode}">complete registration</a>
    </p>
`;

export const RECOVERY_SUBJECT = 'Password recovery';
export const getRecoveryPasswordMessage = (recoveryCode: string) => `
    <h1>Password recovery</h1>
       <p>To finish password recovery please follow the link below:
          <a href="https://somesite.com/password-recovery?recoveryCode=${recoveryCode}">recovery password</a>
      </p>
`