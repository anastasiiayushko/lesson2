export interface AuthRegSendEmailPort {
    confirmRegistration: (emailTo: string, confirmedCode: string) => void
}