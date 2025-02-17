export interface AuthRegSendEmailPort {
    confirmRegistration: (emailTo: string, confirmedCode: string) => void
    recoveryPassword: (emailTo: string, confirmedCode: string) => void
}