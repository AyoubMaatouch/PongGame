import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class twofaguard extends AuthGuard('2fa') {}
