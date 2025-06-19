import { HttpStatus } from "@nestjs/common";

export function mapDirectusErrorCodeToStatus(code: string): HttpStatus {
    switch (code) {
        case 'TOKEN_EXPIRED':
            return HttpStatus.UNAUTHORIZED;
        case 'FORBIDDEN':
            return HttpStatus.FORBIDDEN;
        case 'INVALID_CREDENTIALS':
            return HttpStatus.UNAUTHORIZED;
        case 'RECORD_NOT_UNIQUE':
            return HttpStatus.CONFLICT;
        case 'INVALID_PAYLOAD':
            return HttpStatus.BAD_REQUEST;
        default:
            return HttpStatus.BAD_REQUEST;
    }
}
